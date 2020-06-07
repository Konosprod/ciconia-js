import { Component, OnInit } from '@angular/core';
import { GalleryItemComponent } from './gallery-item/gallery-item.component'

import { GalleryService } from '../gallery.service'; /* import cart service */

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  items = [];

  constructor(
    private galleryService: GalleryService // inject cart service by adding it to constructor
  ) { }

  ngOnInit(): void {
    this.items = this.galleryService.getItems();
  }

}
