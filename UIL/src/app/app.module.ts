import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { StudentHPComponent } from './student-hp/student-hp.component';
import { TeacherHPComponent } from './teacher-hp/teacher-hp.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { TClassComponent } from './t-class/t-class.component';
import { NewClassComponent } from './new-class/new-class.component';

const appRoutes: Routes = [
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "teacherHP/:id", component: TeacherHPComponent },
  { path: "studentHP/:id", component: StudentHPComponent },
  { path: "teacherHP/:id/newClass", component: NewClassComponent },
  { path: "teacherHP/:id/tClass/:cId", component: TClassComponent },
  { path: "NoAccess", component: NoAccessComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    StudentHPComponent,
    TeacherHPComponent,
    NoAccessComponent,
    TClassComponent,
    NewClassComponent,
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
