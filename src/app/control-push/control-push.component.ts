import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from './../config.service';
import { PushService } from './../push.service';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-control-push',
  templateUrl: './control-push.component.html',
  styleUrls: ['./control-push.component.css']
})
export class ControlPushComponent implements OnInit {
  private VAPID_PUBLIC_KEY: string;

  constructor(private pushService: PushService,
              private configService: ConfigService, private swPush: SwPush) {}

  ngOnInit() {
    this.VAPID_PUBLIC_KEY = this.configService.get('VAPID_PUBLIC_KEY');
  }

  subscribeToPush() {
    console.log('subscribeToPush was push. publicKey:%s, swPush:%s',
                this.VAPID_PUBLIC_KEY, this.swPush);
    // Requesting messaging service to subscribe current client (browser)
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(pushSubscription => {
      // Passing subscription object to our backend
      this.pushService.addSubscriber(pushSubscription)
        .subscribe(
          res => {
            console.log('[App] Add subscriber request answer', res)
          },
          err => {
            console.log('[App] Add subscriber request failed', err)
          }
        );
    }).then(() => {
      this.swPush.messages
        .subscribe(message => {
          console.log('[App] Push message received', message)
        })
    }).catch(err => {
      console.error(err);
    });
  }
}
