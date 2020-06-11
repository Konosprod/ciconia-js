import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor() { }

  /**
   * Talks with ciconia api to get files to display in gallery.
   * Returns only dummy data for now
   */
  getItems(){
    return [
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
}
