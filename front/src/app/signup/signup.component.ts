import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import * as mdc from 'material-components-web';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    'username': new FormControl(''),
    'password': new FormControl(''),
    'confirm-password': new FormControl('')
  });

  constructor(
    private fb:FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // init form
    this.signupForm = this.fb.group({
      'username': ['',Validators.required],
      'password': ['',Validators.required],
      'confirm-password': ['',Validators.required],
    });

    mdc.autoInit();
  }

}
