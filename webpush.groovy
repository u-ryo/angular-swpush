@Grab('nl.martijndwars:web-push:3.1.0')
@Grab('com.sparkjava:spark-core:2.7.1')
@Grab('org.slf4j:slf4j-simple:1.8.0-beta1')
@Grab('org.bouncycastle:bcprov-jdk15on:1.59')


import groovy.json.JsonSlurper
import java.nio.file.Paths
import java.security.*
import nl.martijndwars.webpush.*
import nl.martijndwars.webpush.Utils
import static nl.martijndwars.webpush.Utils.*
import org.bouncycastle.jce.provider.BouncyCastleProvider
import org.slf4j.*
import static spark.Spark.*
import spark.*

log = LoggerFactory.getLogger('webpush')
subscription = null

Security.addProvider(new BouncyCastleProvider())

// https://web-push-codelab.glitch.me/
publicKey = 'BKBYPoDMjqxh2AIVoAPm66EYdVGLp0p9dN5Xa0KKqfF-oM3EgFk4Jf_pdnPNopL2HPbxrTViKUH7Lea-VbwxyZA'
privateKey = 'rICqkQvJDJZ1GJJZS2185vhWWtuVPxy2xyvBRjGNGek'

log.info("publicKey:${publicKey}, privateKey:${privateKey}")

push = new PushService(publicKey, privateKey, "http://localhost")


staticFiles.externalLocation(Paths.get('./dist').toRealPath().toString())
get('/publicKey', { req, res ->
  log.info('called getPublicKey:{}', publicKey)
  publicKey
    });
options('/subscribe', { req, res ->
  log.info('called webpush by options:{}', req)
  res.header('Access-Control-Allow-Methods', 'POST')
  res.header('Access-Control-Allow-Headers', 'content-type')
  res.header('Access-Control-Allow-Origin', '*')
  res.status(204)
  ''
        })
post('/subscribe', { req, res ->
  log.info('/subscribe request body:{}', req.body())
  subscription = new JsonSlurper().parseText(req.body())
  log.info('endpoint:{},key:{},auth:{}',
           subscription.endpoint, subscription.keys.p256dh,
           subscription.keys.auth)
  res.header('Access-Control-Allow-Origin', '*')
  res.status(204)
  ''
     })
post('/unsubscribe', { req, res ->
  log.info('/unsubscribe request body:{}', req.body())
  if (subscription != null) {
    log.info('endpoint:{},key:{},auth:{}',
             subscription.endpoint, subscription.keys.p256dh,
             subscription.keys.auth)
  }
  subscription = null
  res.header('Access-Control-Allow-Origin', '*')
  res.status(204)
  ''
     })
post('/push', { req, res ->
  log.info('/push request body:{}', req.body())
  if (subscription == null) {
    res.status(404)
    return 'No subscription'
  }
  response = push.send(
    new Notification(subscription.endpoint, subscription.keys.p256dh,
                     subscription.keys.auth,
                     req.body().bytes))
  log.info('response:{}', response)
  return response.toString()
     })

/*
To send a notification:

curl http://localhost:4567/push --data '{"notification":{"body":"This is a message.","title":"PUSH MESSAGE","vibrate":[300,100,400,100,400,100,400],"icon":"https://upload.wikimedia.org/wikipedia/en/thumb/3/34/AlthepalHappyface.svg/256px-AlthepalHappyface.svg.png","tag":"push demo","requireInteraction":true,"renotify":true,"data":{"url":"https://maps.google.jp"}}}'
*/
