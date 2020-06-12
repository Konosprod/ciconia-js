import { Component, OnInit, Input, HostBinding } from '@angular/core';

import { GalleryService } from '../../gallery.service'; /* import cart service */

@Component({
  selector: 'app-gallery-viewer',
  templateUrl: './gallery-viewer.component.html',
  styleUrls: ['./gallery-viewer.component.scss']
})
export class GalleryViewerComponent implements OnInit {

  // this enables the component to update its class list itself based on a condition. Here the condition is a private boolean property.
  // This is the same as using NgClass on a child element
  @HostBinding('class.open') public isOpen = false; // setting this add/removes 'selected' class

  @Input() current;
  itemsData = []; // data returned by service that fetches the items to display from the api

  constructor(
    private galleryService: GalleryService // inject gallery service service by adding it to constructor (talks with ciconia api to fetch items to display). otherwise, it won't be available in other methods
  ) { }

  ngOnInit(): void {
    // init viewer as closed
    this.isOpen = false;
    // fetch data from ciconia gallery service
    this.itemsData = this.galleryService.getItems();
  }

  /**
   * handler called when user clicks on the next arrow in the viewer
   * Should display next item in gallery with a nice transition if possible
   */
  nextItem(){
    this.setCurrent(this.current + 1);
  }

  /**
   * handler called when user clicks on the prev arrow in the viewer
   * Should display previous item in gallery with a nice transition if possible
   */
  prevItem(){
    this.setCurrent(this.current - 1);
  }

  /**
   * used in this.nextItem and this.prevItem
   * returns the order of the currently displayed photo
   */
  getCurrentItemOrder(){
    let itemOrder = 0;
    let current = this.current;
    this.itemsData.map(function(item, k){
      if(item.id == current){
        itemOrder = k;
      }
    });

    return itemOrder;
  }

  /**
   * Opens the viewer and shows its current item (only supports images for now)
   * @param id is an integer representing a ciconia item id
   * handler called when viewer is openned. Will used last current item if not provided, or the first of gallery (as initialized in gallery component)
   */
  open(order=this.current){
    this.setCurrent(order);

    // remove selected on other items
    for(var i=0; i < this.itemsData.length; i++){
      // update this components data
      this.itemsData[i].selected = false;
    }
    // set this item as selected
    this.itemsData[order].selected = true;
    // update service items data
    this.galleryService.setItems(this.itemsData);

    // thanks to the Host binding above, changing the isOpen property to true adds the "open" class to this component automatically
    this.isOpen = true;
  }

  setCurrent(order){
    if(order < 0) order = this.itemsData.length - 1;
    if(order >= this.itemsData.length) order = 0
    this.current = order
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
