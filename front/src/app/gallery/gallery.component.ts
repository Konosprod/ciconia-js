import { Component, OnInit, ElementRef, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { GalleryItemComponent } from './gallery-item/gallery-item.component'
import { GalleryViewerComponent } from './gallery-viewer/gallery-viewer.component'

import { GalleryService } from '../gallery.service'; /* import cart service */

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements AfterViewInit, OnInit {
  itemsData = [];
  @ViewChild(GalleryViewerComponent) viewerElement: GalleryViewerComponent;

  constructor(
    private galleryService: GalleryService // inject cart service by adding it to constructor
  ) { }

  ngOnInit(): void{
    this.itemsData = this.galleryService.getItems();
  }

  ngAfterViewInit(): void {
    this.viewerElement.current = 0;
  }

  sendToViewer(i, item){
    this.viewerElement.current = i;
    console.log(this.viewerElement);
  }

}
