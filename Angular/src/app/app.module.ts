import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerComponent } from './register/register.component';
import { loginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { teacherHPComponent } from './teacherHP/teacherHP.component';
import { studentHPComponent } from './studentHP/studentHP.component';

const appRoutes: Routes = [
  { path: "register", component: registerComponent },
  { path: "login", component: loginComponent },
  { path: "teacherHP/:id", component: teacherHPComponent },
  { path: "studentHP/:id", component: studentHPComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    registerComponent,
    loginComponent,
    teacherHPComponent,
    studentHPComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }