import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { PushService } from './push.service';
import { environment } from '../environments/environment';
import { ControlPushComponent } from './control-push/control-push.component';

@NgModule({
  declarations: [
    AppComponent,
    ControlPushComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    ConfigService,
    PushService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
