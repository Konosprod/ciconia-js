import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MDCTextField} from '@material/textfield';
import { Input } from '@angular/core';


@Component({
  selector: 'app-password-field',
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.scss']
})
export class PasswordFieldComponent implements OnInit {

  @Input() name;
  @Input() slug;
  @Input() parentForm: FormGroup;

  control = new FormControl('');

  constructor() { }

  ngOnInit(): void {
    if(typeof this.slug == 'undefined'){
      this.slug = this.name.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
    }

    const textField = new MDCTextField(document.querySelector('.mdc-password-field'));
  }

}
