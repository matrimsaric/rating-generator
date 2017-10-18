import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
    `
    img.center {
        display: block;
        margin: 0 auto;
    }

    img {
        display: block;
        margin: 0 auto;
    }
    `
]
})
export class HomeComponent implements OnInit {

    private startImage: string = "";

  constructor() { }

  ngOnInit() {

    var choice: number = Math.floor(Math.random() * 3) + 1;

    switch(choice){
        case 1:
            this.startImage = "/assets/images/brand/DaidojiAkagi.jpg";
        break;
        case 2:
            this.startImage = "/assets/images/brand/DaidojiAkeha.jpg";
        break;
        case 3:
            this.startImage = "/assets/images/brand/DojiSeo.jpg";
        break;
    }

  }

}
