import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  items = [];

  constructor(private http:HttpClient) { }

  /**
   * Talks with ciconia api to get files to display in gallery.
   * Returns only dummy data for now
   */
  getItems() {
    this.http.post<any>("http://localhost:3000/gallery", {"limit": 15, "offset": 0}).subscribe(data => {
      let files = []
      let i = 0;
      data.forEach(element => {
        let img = {
          id: i,
          url: "http://localhost:3000/push/" + element.url,
          thumb: "http://localhost:3000/thumbs/" + element.url,
          type: element.mime
        }
        i++;

        this.items.push(img);
      });
    });

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
