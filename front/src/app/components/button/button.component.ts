import { Component, OnInit, Input } from '@angular/core';

import {MDCRipple} from '@material/ripple';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() name;
  @Input() slug;

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

    const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
  }

}
