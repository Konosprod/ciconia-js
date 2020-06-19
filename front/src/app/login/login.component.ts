import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as mdc from 'material-components-web';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private fb:FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // redirect to gallery if already logged in
    if( this.authService.isLoggedIn() ){
      this.router.navigate(['/gallery']);
    }

    // init form
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required],
    });

    //this.loginForm.valueChanges.subscribe(newVal => console.log(newVal));

    // init mdc components
    mdc.autoInit();
  }

  login() {
    const val = this.loginForm.value;

    if (val.username && val.password) {
      let req = this.authService.login(val.username, val.password);
      req.subscribe(
        res => {
          this.authService.setSession(res);
          this.router.navigate(['/gallery']);
          Swal.fire({
            title: 'Login successful!',
            icon: 'success',
            timer:2000,
            showCancelButton: false,
            showConfirmButton: false
          });
          
        },
        (error: HttpErrorResponse) => {
          this.wrongLogin();
        }
      );
    }
  }

  wrongLogin(){
    // fire alert
    Swal.fire({
      title: 'Login failed...',
      html: `
        You have either your username or password wrong !<br>
        You can always <a href='/signup'>create an account</a> if you don't have one...
      `,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

}