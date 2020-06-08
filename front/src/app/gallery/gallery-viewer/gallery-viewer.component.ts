import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gallery-viewer',
  templateUrl: './gallery-viewer.component.html',
  styleUrls: ['./gallery-viewer.component.scss']
})
export class GalleryViewerComponent implements OnInit {

  @Input() current;
  @Input() items;

  constructor() { }

  ngOnInit(): void {
  }

}
