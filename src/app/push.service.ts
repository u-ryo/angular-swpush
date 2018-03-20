import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { ConfigService } from './config.service';

@Injectable()
export class PushService {
  private API_URL: string

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.API_URL = this.configService.get('API_URL');
  }

  addSubscriber(subscription) {
    const url = `${this.API_URL}/subscribe`;
    console.log('[Push Service] Adding subscriber');
    return this.http
      .post(url, subscription)
      .catch(this.handleError);
  }

  deleteSubscriber(subscription) {
    const url = `${this.API_URL}/unsubscribe`;
    console.log('[Push Service] Deleting subscriber');
    return this.http
      .post(url, subscription)
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      errMsg = `${error.statusText || 'Network error'}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
