import { Component, OnInit, ElementRef, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { GalleryViewerComponent } from './gallery-viewer/gallery-viewer.component'

import { GalleryService } from '../gallery.service'; /* import cart service */

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})

export class GalleryComponent implements AfterViewInit, OnInit {
  itemsData = []; // data returned by service that fetches the items to display from the api
  @ViewChild(GalleryViewerComponent) viewerElement: GalleryViewerComponent; // this creates a reference to the gallery viewer component.
  // we need this reference to open it when an item is selected, and pass its data

  selectedItem; //holds the curently selected item

  constructor(
    private galleryService: GalleryService // inject gallery service service by adding it to constructor (talks with ciconia api to fetch items to display). otherwise, it won't be available in other methods
  ) { }

  ngOnInit(): void{
    // fetch data from ciconia gallery service
    this.itemsData = this.galleryService.getItems();
  }

  ngAfterViewInit(): void {
    // set a default element for the gallery viewer
    this.viewerElement.current = 0;
  }

  onItemSelect(item): void {
    this.selectedItem = item;
    this.viewerElement.open(this.selectedItem);

    // blur other elements in the background using utility class
    // there should be a more "angular" way to do this, with property binding for example...
    document.querySelector('.mdc-top-app-bar').classList.add('blur');
    document.querySelector('.gallery-item-list').classList.add('blur');
  }
}
