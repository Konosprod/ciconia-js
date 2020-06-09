import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-gallery-viewer',
  templateUrl: './gallery-viewer.component.html',
  styleUrls: ['./gallery-viewer.component.scss']
})
export class GalleryViewerComponent implements OnInit {

  // this enables the component to update its class list itself based on a condition. Here the condition is a private boolean property.
  // This is the same as using NgClass on a child element
  @HostBinding('class.open') private isOpen = false; // setting this add/removes 'selected' class

  @Input() current;
  @Input() items;

  constructor() { }

  ngOnInit(): void {
    // init viewer as closed
    this.isOpen = false;
  }

  /**
   * handler called when user clicks on the next arrow in the viewer
   * Should display next item in gallery with a nice transition if possible
   */
  nextItem(){
    alert('next item : TODO :D');
  }

  /**
   * handler called when user clicks on the prev arrow in the viewer
   * Should display previous item in gallery with a nice transition if possible
   */
  prevItem(){
    alert('prev item : TODO :D');
  }

  /**
   * Opens the viewer and shows its current item (only supports images for now)
   * @param item is a ciconia item object as defined in the ciconia gallery service
   * handler called when viewer is openned. Will used last current item if not provided, or the first of gallery (as initialized in gallery component)
   */
  open(item=this.current){
    this.current = item;
    // thanks to the Host binding above, changing the isOpen property to true adds the "open" class to this component automatically
    this.isOpen = true;
  }

  /**
   * Closes the viewer...
   * that's all...
   */
  close(){
    // host binding !
    this.isOpen = false;

    // "unblur" other elements.
    // there should be a more "angular" way of doing this
    document.querySelector('.mdc-top-app-bar').classList.remove('blur');
    document.querySelector('.gallery-item-list').classList.remove('blur');
  }
}
