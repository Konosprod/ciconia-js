import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  items = [];

  constructor() { }

  /**
   * Talks with ciconia api to get files to display in gallery.
   * Returns only dummy data for now
   */
  getItems(){
    if(this.items.length == 0){
      this.items = [
        {
          id: 14,
          url: "http://placekitten.com/1920/1080",
          thumb: "http://placekitten.com/300/300",
          type: "image"
        },
        {
          id: 21,
          url: "http://placekitten.com/1920/1080",
          thumb: "http://placekitten.com/300/300",
          type: "image"
        },
        {
          id: 22,
          url: "http://placekitten.com/1920/1080",
          thumb: "http://placekitten.com/300/300",
          type: "image"
        },
        {
          id: 70,
          url: "http://placekitten.com/1920/1080",
          thumb: "http://placekitten.com/300/300",
          type: "image"
        },
        {
          id: 47,
          url: "http://placekitten.com/1920/1080",
          thumb: "http://placekitten.com/300/300",
          type: "image"
        },
        {
          id: 94,
          url: "http://placekitten.com/1920/1080",
          thumb: "http://placekitten.com/300/300",
          type: "image"
        },
        {
          id: 61,
          url: "http://placekitten.com/1920/1080",
          thumb: "http://placekitten.com/300/300",
          type: "image"
        },
        {
          id: 70,
          url: "http://placekitten.com/1920/1080",
          thumb: "http://placekitten.com/300/300",
          type: "image"
        },
        {
          id: 84,
          url: "http://placekitten.com/1920/1080",
          thumb: "http://placekitten.com/300/300",
          type: "image"
        },
        {
          id: 98,
          url: "http://placekitten.com/1920/1080",
          thumb: "http://placekitten.com/300/300",
          type: "image"
        }
      ]
    }
    return this.items;
  }

  setItems(items){
    this.items = items;
  }

  setItem(item, k){
    if(typeof k != "number" && k%1 == 0){
      throw "argument k of GalleryService.setItem must be integer"
    }
    if(typeof this.items[k] == "undefined"){
      throw "error, trying to set item on undefined index " + k + " to GalleryService.items ("+this.items.length+") in GalleryService.setItem";
    }
    this.items[k] = item;
  }
}
