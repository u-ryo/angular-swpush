import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/take';
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
    console.log('[Control-Push] subscribeToPush was push. publicKey:%s, swPush:%s',
                this.VAPID_PUBLIC_KEY, this.swPush);
    // Requesting messaging service to subscribe current client (browser)
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then((pushSubscription) => {
      console.log('[Control-Push] pushSubscription', pushSubscription);
      console.log('[Control-Push] pushSubscription.getKey(auth)', pushSubscription.getKey('auth'));
      console.log('[Control-Push] pushSubscription.getKey(p256dh)', pushSubscription.getKey('p256dh'));
      // Passing subscription object to our backend
      this.pushService.addSubscriber(pushSubscription)
        .subscribe(
          (res) => {
            console.log('[Control-Push] Add subscriber request answer', res);
          },
          (err) => {
            console.log('[Control-Push] Add subscriber request failed', err);
          }
        );
    }).then(() => {
      this.swPush.messages
        .take(1)
        .subscribe((message) => {
          console.log('[App] Push message received', message);
        })
    }).catch((err) => {
      console.error(err);
    });
  }

  unsubscribeFromPush() {
    console.log('[Control-Push] unsubscribeFromPush', this.swPush.subscription);
    // Get active subscription
    this.swPush.subscription
      .take(1)
      .subscribe((pushSubscription) => {
        console.log('[Control-Push] pushSubscription', pushSubscription);
        // Delete the subscription from the backend
        this.pushService.deleteSubscriber(pushSubscription)
          .subscribe(
            (res) => {
              console.log('[Control-Push] Delete subscriber request answer', res);
              // Unsubscribe current client (browser)
              pushSubscription.unsubscribe()
                .then((success) => {
                  console.log('[Control-Push] Unsubscription successful', success);
                })
                .catch((err) => {
                  console.log('[Control-Push] Unsubscription failed', err);
                })
                  },
            (err) => {
              console.log('[Control-Push] Delete subscription request failed', err);
            })
      });
  }
}
