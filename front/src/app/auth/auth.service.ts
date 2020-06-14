import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http:HttpClient){
  }

  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(username:string, password:string) {
    var exploded = window.location.href.split(':');
    exploded.pop();
    var apiUrl = exploded.join(':');
    apiUrl += ":3000";
    
    let res = this.http.post(
      apiUrl + '/login',
      {
        "username":username,
        "password":password
      }
    );
    return res;
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
