import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/main/home.component';
import { VesselCardComponent } from './Components/vessel-card/vessel-card.component';
import {ChatbotComponent} from './Components/chatbot/chatbot.component';
import { SecondPageComponent } from './Components/second-page/second-page.component'
import { RouterModule, Routes } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VesselCardComponent,
    ChatbotComponent,
    SecondPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }