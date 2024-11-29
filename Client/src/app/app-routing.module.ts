import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/main/home.component';
import { SecondPageComponent } from './Components/second-page/second-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'secondPage', component: SecondPageComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
