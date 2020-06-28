import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TextFieldComponent } from './components/text-field/text-field.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ButtonComponent } from './components/button/button.component';
import { PasswordFieldComponent } from './components/password-field/password-field.component';
import { GalleryComponent } from './gallery/gallery.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GalleryItemComponent } from './gallery/gallery-item/gallery-item.component';
import { GalleryViewerComponent } from './gallery/gallery-viewer/gallery-viewer.component';
import { LogoutComponent } from './logout/logout.component';

import { AuthInterceptor } from './interceptor/auth.interceptor';

@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      SignupComponent,
      TextFieldComponent,
      CheckboxComponent,
      ButtonComponent,
      PasswordFieldComponent,
      GalleryComponent,
      NotFoundComponent,
      GalleryItemComponent,
      GalleryViewerComponent,
      LogoutComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule
   ],
   providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
