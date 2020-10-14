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
import { EditClassComponent } from './edit-class/edit-class.component';
import { SettingsComponent } from './settings/settings.component';
import { SClassComponent } from './s-class/s-class.component';
import { SubInfoComponent } from './sub-info/sub-info.component';

const appRoutes: Routes = [
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "teacherHP/:id", component: TeacherHPComponent },
  { path: "teacherHP/:id/newClass", component: NewClassComponent },
  { path: ":id/settings", component: SettingsComponent },
  { path: "teacherHP/:id/tClass/:cId", component: TClassComponent },
  { path: "teacherHP/:id/tClass/:cId/edit", component: EditClassComponent },
  { path: "studentHP/:id", component: StudentHPComponent },
  { path: "studentHP/:id/sClass/:cId", component: SClassComponent },
  { path: "teacherHP/:id/tClass/:cId/:info", component: SubInfoComponent },
  { path: "studentHP/:id/sClass/:cId/:info", component: SubInfoComponent },
  { path: "NoAccess/:id", component: NoAccessComponent },
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
    EditClassComponent,
    SettingsComponent,
    SClassComponent,
    SubInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
