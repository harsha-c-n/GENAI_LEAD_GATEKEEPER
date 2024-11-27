import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/main/home.component';
import { VesselCardComponent } from './Components/vessel-card/vessel-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VesselCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
