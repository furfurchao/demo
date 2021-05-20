import {Injectable} from '@angular/core';
import protooClient from 'protoo-client';
import * as mediasoupClient from 'mediasoup-client';
import * as bowser from 'bowser';
import {BehaviorSubject, Subject} from 'rxjs';
import {io} from 'socket.io-client';
import {MessageService} from './message.service';

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

  constructor(private messageService: MessageService) {
  }

  $addConsumer = new BehaviorSubject(null);
  protoo: any;
  mediasoupDevice;
  handlerName = '';
  produceFlag = true;
  sendTransport;
  displayName = '你的名字' + Math.random();
  peers = [];
  webcam =
    {
      device: null,
      resolution: 'hd'
    };
  recvTransport;
  webCams = new Map();
  consumers = new Map();
  ip = '';

  init(roomId: string, peerId: string, messages = []): void {
    const hostname = window.location.hostname;
    const url = `ws://${this.ip}:8081/?roomId=${roomId}&peerId=${peerId}`;


    const protooTransport = new protooClient.WebSocketTransport(url);

    this.protoo = new protooClient.Peer(protooTransport);
    this.protoo.on('open', () => {
        this.messageService.sendMessage.next('protoo open');
        this.joinRoom();
      }
    );

    this.protoo.on('request', (request, accept, reject) => {
      console.log(request);
      console.log('进入request');
      this.messageService.sendMessage.next(`进入request--${request.method}`);
      switch (request.method) {
        case 'newConsumer': {

          const {
            peerId,
            producerId,
            id,
            kind,
            rtpParameters,
            type,
            appData,
            producerPaused
          } = request.data;
          console.log(request.data);
          try {
            this.recvTransport.consume(
              {
                id,
                producerId,
                kind,
                rtpParameters,
                appData: {...appData, peerId} // Trick.
              }).then(consumer_res => {
              const consumer = consumer_res;
              // Store in the map.
              this.consumers.set(consumer.id, consumer);

              consumer.on('transportclose', () => {
                this.consumers.delete(consumer.id);
              });

              const {spatialLayers, temporalLayers} =
                mediasoupClient.parseScalabilityMode(
                  consumer.rtpParameters.encodings[0].scalabilityMode);

              this.$addConsumer.next(
                {
                  id: consumer.id,
                  type: type,
                  locallyPaused: false,
                  remotelyPaused: producerPaused,
                  rtpParameters: consumer.rtpParameters,
                  spatialLayers: spatialLayers,
                  temporalLayers: temporalLayers,
                  preferredSpatialLayer: spatialLayers - 1,
                  preferredTemporalLayer: temporalLayers - 1,
                  priority: 1,
                  codec: consumer.rtpParameters.codecs[0].mimeType.split('/')[1],
                  track: consumer.track
                },
              );
              // We are ready. Answer the protoo request so the server will
              // resume this Consumer (which was paused for now if video).
              accept();
            });

          } catch (error) {
            console.log('error', error);
            // messages.push(`报错了,${JSON.stringify(error)}`);
            throw error;
          }

          break;
        }
      }
    });

    this.protoo.on('disconnect', () => {

    })
    ;
  }


  joinRoom(): void {

    this.mediasoupDevice = new mediasoupClient.Device(
      {
        handlerName: null,
      });
    // console.log(this.mediasoupDevice);
    // this.messageService.sendMessage.next(JSON.stringify(this.messageService));
    this.protoo.request('getRouterRtpCapabilities').then(res => {
      const rtpCapabilities = {routerRtpCapabilities: res};
      this.mediasoupDevice.load(rtpCapabilities).then(detail => {
        console.log('load rtpCapa');
        console.log(rtpCapabilities);

        this.consume();
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


  consume() {
    console.log('开始consume');

    this.protoo.request(
      'createWebRtcTransport',
      {
        forceTcp: false,
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
      const data = {
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
        iceServers: [],
      };
      console.log('rec params', data);
      this.recvTransport = this.mediasoupDevice.createRecvTransport(
        {
          id,
          iceParameters,
          iceCandidates,
          dtlsParameters,
          sctpParameters,
          iceServers: [],
        });
      this.messageService.sendMessage.next('就花connect');

      this.recvTransport.on(
        'connect', ({dtlsParameters}, callback, errback) => // eslint-disable-line no-shadow
        {
          this.messageService.sendMessage.next('连接onnect rece  成功');
          try {
            this.messageService.sendMessage.next('开始连接');
            this.protoo.request(
              'connectWebRtcTransport',
              {
                transportId: this.recvTransport.id,
                dtlsParameters
              })
              .then(callback)
              .catch((e) => {
                this.messageService.sendMessage.next('连接onnect rece  失败');
              });

          } catch (error) {
            this.messageService.sendMessage.next('连接onnect rece  失败');
          }

        });
      this.prootooJoin();
    });


  }


  prootooJoin(): void {
    this.messageService.sendMessage.next(JSON.stringify(this.deviceInfo()));
    this.protoo.request(
      'join',
      {
        displayName: this.displayName,
        device: this.deviceInfo(),
        rtpCapabilities: this.mediasoupDevice.rtpCapabilities,
        sctpCapabilities: this.mediasoupDevice.sctpCapabilities
      }).then(data => {
      const peers = data.peers || [];
      this.messageService.sendMessage.next('加入protto');
    });
  }

}
