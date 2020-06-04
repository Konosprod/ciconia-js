import { Component, OnInit } from '@angular/core';
import {MDCTextField} from '@material/textfield';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
  }

}
