import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
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
      this.authService.login(val.username, val.password)
        .subscribe(
          (res) => {
            let r = <any>{};
            r = res;
            if(r.status == "ok"){
              this.authService.isLoggedIn = true;
              this.router.navigate(['/gallery']);
            }
            else{
              alert('bad credentials');
            }
          }
      );
    }
  }

}
