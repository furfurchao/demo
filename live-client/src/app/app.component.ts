import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WssService} from './wss.service';
import {MessageService} from './message.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rtc-live-demo';

  constructor(private wssService: WssService,
              private http: HttpClient,
              private messageSerivice: MessageService) {
    setInterval(() => {
      this.now = new Date();
    }, 1);
  }


  consumers = [];
  date = new Date().getMilliseconds();
  messages = [];
  name = 'mozhou';
  ip = '192.168.2.31';
  public now: Date = new Date();

  ngOnInit(): void {

    this.messageSerivice.sendMessage.subscribe(data => {
      this.messages.push(data);
    });
    this.wssService.$addConsumer.subscribe(data => {
      if (data) {
        this.consumers.push(data);
        console.log('收到加入请求', JSON.stringify(data));
        // this.messages.push(`收到加入请求-${JSON.stringify(data)}`);
      }
    });
    this.join();
  }

  join(): void {
    this.wssService.ip = this.ip;
    this.messages.push(`开始初始化`);
    this.wssService.init(this.name, this.date.toString(

    ), this.messages);

  }
}
