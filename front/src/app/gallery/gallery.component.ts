import { Component, OnInit, ElementRef, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { GalleryViewerComponent } from './gallery-viewer/gallery-viewer.component'
import { HttpClient } from '@angular/common/http';

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

  hasMore: boolean = true;

  limit = 15;
  offset = 0;

  constructor(
    private http: HttpClient // inject gallery service service by adding it to constructor (talks with ciconia api to fetch items to display). otherwise, it won't be available in other methods
  ) { }

  ngOnInit(): void{
    // fetch data from ciconia gallery service
    this.fetchData();
  }

  ngAfterViewInit(): void {
    // set a default element for the gallery viewer
    this.viewerElement.current = 0;
  }

  onItemSelect(order): void {
    this.selectedItem = order;

    // remove selected on other items
    for(var i=0; i < this.itemsData.length; i++){
      // update this components data
      this.itemsData[i].selected = false;
    }
    // set this item as selected
    this.itemsData[order].selected = true;

    if(!this.viewerElement.isOpen){
      this.viewerElement.open(this.selectedItem);

      // blur other elements in the background using utility class
      // there should be a more "angular" way to do this, with property binding for example...
      document.querySelector('.mdc-top-app-bar').classList.add('blur');
      document.querySelector('.gallery-item-list').classList.add('blur');
    }
  }

  morePage(): void {
    this.offset += this.limit
    this.fetchData();
    this.viewerElement.current = 0;
  }

  fetchData(): void {
    this.http.post<any>("http://localhost:3000/gallery", { "limit": this.limit, "offset": this.offset }).subscribe(data => {
      let files = []
      let i = this.itemsData.length + 1;

      if (data.length < 15) {
        this.hasMore = false;
      }

      data.forEach(element => {
        let img = {
          id: i,
          url: "http://localhost:3000/push/" + element.url,
          thumb: "http://localhost:3000/thumbs/" + element.url,
          type: element.mime
        }
        i++;

        this.itemsData.push(img);
        this.viewerElement.itemsData = this.itemsData;
      });
    });
  }
}
