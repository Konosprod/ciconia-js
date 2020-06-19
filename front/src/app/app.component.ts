import { Component } from '@angular/core';
import {MDCTopAppBar} from '@material/top-app-bar';
import * as mdc from 'material-components-web';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front';
  menuOpen: boolean;

  constructor() {}

  ngOnInit() {
    this.menuOpen = false;
    // Instantiating material top bar
    const topAppBarElement = document.querySelector('.mdc-top-app-bar');
    const topAppBar = new MDCTopAppBar(topAppBarElement);
    mdc.autoInit();
  }
}
