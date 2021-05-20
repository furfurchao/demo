import {Injectable} from '@angular/core';
import protooClient from 'protoo-client';
import * as mediasoupClient from 'mediasoup-client';
import * as bowser from 'bowser';
import {BehaviorSubject, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const PC_PROPRIETARY_CONSTRAINTS =
  {
    optional: [{googDscp: true}]
  };
const VIDEO_CONSTRAINS =
  {
    qvga: {width: {ideal: 320}, height: {ideal: 240}},
    vga: {width: {ideal: 640}, height: {ideal: 480}},
    hd: {width: {ideal: 1280}, height: {ideal: 720}}
  };

@Injectable({
  providedIn: 'root'
})
export class WssService {

  constructor(private http: HttpClient) {
  }

  $addConsumer = new BehaviorSubject(null);
  protoo: any;
  mediasoupDevice;
  handlerName = '';
  produceFlag = true;
  sendTransport;
  displayName = '你的名字' + Math.random();
  peers = [];
  selectScreen = false;
  webcam =
    {
      device: null,
      resolution: 'hd'
    };
  recvTransport;
  webCams = new Map();
  consumers = new Map();

  init(roomId: string, peerId: string): void {
    const hostname = window.location.hostname;
    const url = `ws://127.0.0.1:8081/?roomId=${roomId}&peerId=${peerId}`;


    const protooTransport = new protooClient.WebSocketTransport(url);

    this.protoo = new protooClient.Peer(protooTransport);
    this.protoo.on('open', () => {
        this.joinRoom();
      }
    );
    this.protoo.on('disconnect', () => {

    });

    // this.listenNotify();


  }


  joinRoom(): void {

    this.mediasoupDevice = new mediasoupClient.Device(
      {
        handlerName: null,
      });
    console.log(this.mediasoupDevice);
    this.protoo.request('getRouterRtpCapabilities').then(res => {
      const rtpCapabilities = {routerRtpCapabilities: res};
      this.mediasoupDevice.load(rtpCapabilities).then(detail => {
        this.protooJoin();
        // this.produce();
      });
    });
  }

  deviceInfo() {
    const ua = navigator.userAgent;
    const browser = bowser.getParser(ua);
    let flag;

    if (browser.satisfies({chrome: '>=0', chromium: '>=0'})) {
      flag = 'chrome';
    } else if (browser.satisfies({firefox: '>=0'})) {
      flag = 'firefox';
    } else if (browser.satisfies({safari: '>=0'})) {
      flag = 'safari';
    } else if (browser.satisfies({opera: '>=0'})) {
      flag = 'opera';
    } else if (browser.satisfies({'microsoft edge': '>=0'})) {
      flag = 'edge';
    } else {
      flag = 'unknown';
    }

    return {
      flag,
      name: browser.getBrowserName(),
      version: browser.getBrowserVersion()
    };
  }

  getCam() {
    // navigator.mediaDevices.enumerateDevices().then(items => {
    //   const devices = items;
    //   devices.forEach(_device => {
    //     if (_device.kind === 'videoinput') {
    //       this.webcam.device = _device;
    //       this.webCams.set(_device.deviceId, _device);
    //     }
    //   });
    //   const {resolution} = this.webcam;
    //   if (!this.webcam) {
    //     return;
    //   }
      this.selectScreen = true;
      console.log(this.selectScreen);
      // @ts-ignore
      navigator.mediaDevices.getDisplayMedia(
        {
          video: true,
          audio: false
        }).then(stream => {
        const track = stream.getVideoTracks()[0];
        let encodings;
        let codec;
        const codecOptions =
          {
            videoGoogleStartBitrate: 1000
          };
        this.sendTransport.produce(
          {
            track,
            encodings,
            codecOptions,
            codec
          });
      });
    // });
  }

  consume() {
    this.protoo.request(
      'createWebRtcTransport',
      {
        forceTcp: true,
        producing: false,
        consuming: true,
        sctpCapabilities: this.mediasoupDevice.sctpCapabilities
      }).then(info => {
      const transportInfo = info;
      const {
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters
      } = transportInfo;

      this.recvTransport = this.mediasoupDevice.createRecvTransport(
        {
          id,
          iceParameters,
          iceCandidates,
          dtlsParameters,
          sctpParameters,
          iceServers: [],
        });

      this.recvTransport.on(
        'connect', ({dtlsParameters}, callback, errback) => // eslint-disable-line no-shadow
        {
          this.protoo.request(
            'connectWebRtcTransport',
            {
              transportId: this.recvTransport.id,
              dtlsParameters
            })
            .then(callback)
            .catch(errback);
        });
    });


  }

  produce() {
    this.protoo.request(
      'createWebRtcTransport',
      {
        forceTcp: false,
        producing: true,
        consuming: false,
        sctpCapabilities: this.mediasoupDevice.sctpCapabilities
      }).then(info => {
      console.log('data channel', {
        forceTcp: false,
        producing: true,
        consuming: false,
        sctpCapabilities: this.mediasoupDevice.sctpCapabilities
      });
      const transportInfo = info;

      const {
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters
      } = transportInfo;

      this.sendTransport = this.mediasoupDevice.createSendTransport(
        {
          id,
          iceParameters,
          iceCandidates,
          dtlsParameters,
          sctpParameters,
          iceServers: [],
          proprietaryConstraints: PC_PROPRIETARY_CONSTRAINTS,
          additionalSettings:
            {encodedInsertableStreams: false}
        });
      this.sendTransport.on(
        'connect', ({dtlsParameters}, callback, errback) => // eslint-disable-line no-shadow
        {
          this.protoo.request(
            'connectWebRtcTransport',
            {
              transportId: this.sendTransport.id,
              dtlsParameters
            })
            .then(callback)
            .catch(errback);
        });

      this.sendTransport.on(
        'produce', ({kind, rtpParameters, appData}, callback, errback) => {
          try {
            // eslint-disable-next-line no-shadow
            this.protoo.request(
              'produce',
              {
                transportId: this.sendTransport.id,
                kind,
                rtpParameters,
                appData
              }).then(data => {
              console.log('produce', data.id);
              callback({id: data.id});
            });
          } catch (error) {
            errback(error);
          }
        });


      this.sendTransport.on('producedata', async (
        {
          sctpStreamParameters,
          label,
          protocol,
          appData
        },
        callback,
        errback
      ) => {

        try {
          // eslint-disable-next-line no-shadow
          this.protoo.request(
            'produceData',
            {
              transportId: this.sendTransport.id,
              sctpStreamParameters,
              label,
              protocol,
              appData
            }).then(data => {
            console.log('produce data', data.id);
            callback({id: data.id});
          });


        } catch (error) {
          errback(error);
        }
      });


    });


  }


  protooJoin() {
    this.produce();
    console.log('data channel', {
      displayName: this.displayName,
      device: this.deviceInfo(),
      // sctpCapabilities: this.mediasoupDevice.sctpCapabilities
    });
    this.protoo.request(
      'join',
      {
        displayName: this.displayName,
        device: this.deviceInfo(),
        // sctpCapabilities: this.mediasoupDevice.sctpCapabilities
      }).then(data => {
      const peers = data.peers || [];
      this.getCam();

    });

  }

}
