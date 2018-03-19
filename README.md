# AngularSwpush

This is just a test application for the web push notification using the service worker on angular5.

I refered to [pwatter(A simple app for the PWA Workshop)](https://github.com/webmaxru/pwatter).
I traced that on the latest Angular5 by my hand.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

## Development server

Trying the service worker, you need to build the app as the production mode.
`ng serve` won't work.

So I added a push server written by groovy(2.5+).
Please try,

```
$ ng build --prod
$ groovy webpush.groovy
```

(If your groovy version is under 2.5, you'll need `-cp /usr/share/java/servlet-api-3.1.jar` because [SparkJava](http://sparkjava.com) needs a newer servlet-api than the one included in groovy2.4-)

And access to `http://localhost:4567/` by your browser(Chrome or Firefox or Opera? or...),
push the button 'Subscribe for push' and accept the notification.
To send a push notification, please use `curl` on the command line like below:

```
$ curl http://localhost:4567/push --data \
  '{"notification":
    {
      "title":"PUSH MESSAGE",
      "body":"This is a message.",
      "vibrate":[300,100,400,100,400,100,400],
      "icon":"https://upload.wikimedia.org/wikipedia/en/thumb/3/34/AlthepalHappyface.svg/256px-AlthepalHappyface.svg.png",
      "tag":"push demo",
      "requireInteraction":true,
      "renotify":true
    }
  }'
```

You can also try:

1. Download [webpush.groovy server](https://raw.githubusercontent.com/u-ryo/angular-swpush/master/webpush.groovy)
1. Execute the server by `groovy webpush.groovy` (with groovy 2.5+) or `groovy -cp /usr/share/java/servlet-api-3.1.jar webpush.groovy` (with groovy 2.4-)
1. Open https://u-ryo.github.io/angular-swpush/ by Chrome (Firefox will fail because of the mixed content)
1. Push "Subscribe for push" button and accept the notification
1. Execute `curl` command like below:
```
curl http://localhost:4567/push --data '{"notification":{"body":"This is a message.","title":"PUSH MESSAGE","vibrate":[300,100,400,100,400,100,400],"icon":"https://upload.wikimedia.org/wikipedia/en/thumb/3/34/AlthepalHappyface.svg/256px-AlthepalHappyface.svg.png","tag":"push demo","requireInteraction":true,"renotify":true,"data":{"url":"https://maps.google.com"}}}'
```
1. You'll see the notification
1. If you click the notification, you'll see the Google Map

## notification click

If you want to respond "notificationclick" event
(=> when you click the notification,
the browser will pop up and open the specified URL),
add the codes below to `ngsw-worker.js` around the line `this.scope.addEventListener('push', (event) => this.onPush(event));`(Line 1775).

```
      this.scope.addEventListener('notificationclick', (event) => {
        console.log('[Service Worker] Notification click Received. event:%s', event);
        event.notification.close();
        if (clients.openWindow && event.notification.data.url) {
          event.waitUntil(clients.openWindow(event.notification.data.url));
        }
      });
```

(If you add the code to `node_modules/@angular/service-worker/ngsw-worker.js`,
you'll need to `ng build` again.)

Then you can specify the URL in the "notification.data.url".

```
$ curl http://localhost:4567/push --data \
  '{"notification":
    {
      "body":"This is a message.",
      "title":"PUSH MESSAGE",
      "vibrate":[300,100,400,100,400,100,400],
      "icon":"https://upload.wikimedia.org/wikipedia/en/thumb/3/34/AlthepalHappyface.svg/256px-AlthepalHappyface.svg.png",
      "tag":"push demo",
      "requireInteraction":true,
      "renotify":true,
      "data":{"url":"https://maps.google.com"}
    }
  }'
```

When you click the notification, Google Map will appear.
