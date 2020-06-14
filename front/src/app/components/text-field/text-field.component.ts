import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MDCTextField} from '@material/textfield';
import { Input } from '@angular/core';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements OnInit {

  @Input() name;
  @Input() slug;
  @Input() parentForm: FormGroup;

  constructor() {}

  ngOnInit(): void {
    if(typeof this.slug == 'undefined'){
      this.slug = this.name.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
    }
    
    const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
  }

}
