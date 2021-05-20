import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzInputModule} from 'ng-zorro-antd/input';
import {ConsumerComponent} from './consumer/consumer.component';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    ConsumerComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    NzGridModule,
    NzButtonModule,
    NzInputModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
