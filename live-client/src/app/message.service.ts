import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() {
  }

  sendMessage = new BehaviorSubject('');
}
