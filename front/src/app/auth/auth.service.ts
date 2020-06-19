import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http:HttpClient){
  }

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(username:string, password:string) {
    var exploded = window.location.href.split(':');
    exploded.pop();
    var apiUrl = exploded.join(':');
    apiUrl += ":3000";
    
    return this.http.post(
      apiUrl + '/login',
      {
        "username":username,
        "password":password
      }
    );
  }

  public setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn,'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }

  public isLoggedIn() {
    console.log("is logged in ?", moment().isBefore(this.getExpiration()));
    return moment().isBefore(this.getExpiration());
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  logout() {
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
  }
}
