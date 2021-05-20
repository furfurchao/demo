import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.scss']
})
export class ConsumerComponent implements OnInit, AfterViewInit {

  constructor() {
  }

  @Input() consumer;

  ngOnInit(): void {

  }

  @ViewChild('video') video: ElementRef;

  ngAfterViewInit(): void {
    const stream = new MediaStream();
    const videoTrack = this.consumer.track;

    stream.addTrack(videoTrack);
    this.video.nativeElement.srcObject = stream;
    this.video.nativeElement.muted = true;
    this.video.nativeElement.autoplay = false;
    setTimeout(_ => {
      this.video.nativeElement.play();
    }, 1000);
    // this.video.nativeElement.play();
  }

  play(): void {
    this.video.nativeElement.play();
  }
}
