import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor() { }

  getItems(){
    return [
      {
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      },
      {
        url: "http://placekitten.com/1920/1080",
        thumb: "http://placekitten.com/300/300",
        type: "image"
      }
    ]
  }
}
