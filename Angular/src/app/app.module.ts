import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { signUpComponent } from './signUp/signUp.component';
import { loginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  {path:"signUp",component:signUpComponent},
  {path:"login",component:loginComponent},
  {path: '',redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    signUpComponent,
    loginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }