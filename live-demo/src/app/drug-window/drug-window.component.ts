import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularResizeElementEvent} from 'angular-resize-element';
import { WssService } from '../wss.service';

enum AngularResizeElementDirection {
  TOP = 'top',
  TOP_RIGHT = 'top-right',
  RIGHT = 'right',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM = 'bottom',
  BOTTOM_LEFT = 'bottom-left',
  LEFT = 'left',
  TOP_LEFT = 'top-left'
}

const VIDEO_CONSTRAINS =
  {
    qvga: {width: {ideal: 320}, height: {ideal: 240}},
    vga: {width: {ideal: 640}, height: {ideal: 480}},
    hd: {width: {ideal: 1280}, height: {ideal: 720}}
  };


@Component({
  selector: 'app-drug-window',
  templateUrl: './drug-window.component.html',
  styleUrls: ['./drug-window.component.scss']
})
export class DrugWindowComponent implements OnInit {


  public readonly AngularResizeElementDirection = AngularResizeElementDirection;

  constructor(public wssSeervice: WssService) {
  }


  @ViewChild('v', {static: false}) video: ElementRef;

  public data: any = {};
  isPlayVideo = false;
  isStopVideo = false;
  selectScreen = false;
  exitClassroom = false;
  exitOkloading = false;
  kickedOutStudent = false;
  kickedOutOkloading = false;


  token = '006c76ba8e9ccfd40de84f669b7162e7bd6IAC1MEkzSb0p80iUVkYvZVDG8wNGqx6iiqJbi41nUfaALAB1hp4AAAAAEACHBVD565KDYAEAAQDrkoNg';
  appid = 'c76ba8e9ccfd40de84f669b7162e7bd6';
  client;
  watchClient;


  ngOnInit() {

  }


  device;


  public onResize(evt: AngularResizeElementEvent): void {
    this.data.width = evt.currentWidthValue;
    this.data.height = evt.currentHeightValue;
    this.data.top = evt.currentTopValue;
    this.data.left = evt.currentLeftValue;
  }

  choose(): void {
    this.wssSeervice.selectScreen = true;
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({video: true, audio: false}).then(stream => {
      console.log(stream);
      this.video.nativeElement.srcObject = stream;
    });
  }

  chooseVideo(): void {
    this.wssSeervice.selectScreen = true;
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({video: true, audio: false}).then(stream => {
      console.log(stream);
      this.video.nativeElement.srcObject = stream;
    });
    // navigator.mediaDevices.enumerateDevices().then(items => {
    //   const devices = items;
    //   console.log(items);
    //   devices.forEach(device => {
    //     if (device.kind === 'videoinput') {
    //       this.device = device;
    //     }
    //   });
    //   navigator.mediaDevices.getUserMedia({
    //     video: {
    //       deviceId: this.device.deviceId,
    //       ...{width: {ideal: 1280}, height: {ideal: 720}}
    //     },
    //     audio: true
    //   }).then(stream => {
    //     const v = this.video.nativeElement;
    //     v.srcObject = stream;
    //     v.onloadedmetadata = (e) => {
    //       v.play();
    //     };
    //   });
    // });
  }

}
