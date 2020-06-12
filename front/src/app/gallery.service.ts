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
        id: 0,
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        id: 1,
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        id: 2,
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        id: 3,
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        id: 4,
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        id: 5,
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        id: 6,
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        id: 7,
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        id: 8,
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        id: 9,
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      }
    ]
  }
}
