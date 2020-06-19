import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private authServive: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.authServive.isLoggedIn()){
      this.authServive.logout();
      this.router.navigate(['/']);
      Swal.fire({
        title: 'See you !',
        text: 'You have successfully logged out',
        icon: 'success',
        timer:2000,
        showCancelButton: false,
        showConfirmButton: false
      })
    }
    else this.router.navigate(['/']);
  }

}
