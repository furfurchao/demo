import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzInputModule} from 'ng-zorro-antd/input';
import {ConsumerComponent} from './consumer/consumer.component';
import {HttpClientModule} from '@angular/common/http';
import {DrugWindowComponent} from './drug-window/drug-window.component';
import {AngularResizeElementModule} from 'angular-resize-element';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule} from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [
    AppComponent,
    DrugWindowComponent,
    ConsumerComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    NzModalModule,
    NzButtonModule,
    NzInputModule,
    AngularResizeElementModule,
    NzLayoutModule,
    NzMenuModule,
    DragDropModule,
    FormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
