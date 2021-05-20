import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WssService} from './wss.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rtc-live-demo';

  constructor(public wssService: WssService) {
  }


  windows = [];
  name = 'mozhou';
  consumers = [];
  date = new Date().getMilliseconds();

  ngOnInit(): void {
    this.wssService.$addConsumer.subscribe(data => {
      if (data) {
        this.consumers.push(data);
        console.log('收到加入请求', data);
      }
    });


  }

  start(): void {
    this.wssService.selectScreen = true;
    console.log(this.wssService.selectScreen);
    this.wssService.init(this.name, this.date.toString(

    ));
  }

  addWindow(): void {
    this.windows.push(1);
  }

  join(): void {
  }
}
