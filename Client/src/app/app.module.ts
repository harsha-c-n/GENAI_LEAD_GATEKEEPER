import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/main/home.component';
import {ChatbotComponent} from './Components/chatbot/chatbot.component';
import { SecondPageComponent } from './Components/second-page/second-page.component'
import { RouterModule, Routes } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';
import { VesselCardComponent } from './Components/vessel-card/vessel-card.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LeadsComponent } from './Component/leads/leads.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatbotComponent,
    SecondPageComponent,
    VesselCardComponent,
    LeadsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    NgxDatatableModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  
})
export class AppModule { }