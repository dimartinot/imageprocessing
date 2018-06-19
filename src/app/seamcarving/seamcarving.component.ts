import { Component, OnInit } from '@angular/core';
import { ToCarveImage } from './classes/ToCarveImage';
import * as $ from 'jquery';
@Component({
  selector: 'app-seamcarving',
  templateUrl: './seamcarving.component.html',
  styleUrls: ['./seamcarving.component.css']
})

export class SeamcarvingComponent implements OnInit {
  idPicture: number = 1;
  isDone: boolean = false;
  toCarveImage: ToCarveImage;
  constructor() {
  }

  ngOnInit() {
  }

  switchPicture(id: number) {
    this.isDone = false;
    if (id != this.idPicture) {
      var picture_holder = $("#picture_holder_1");
      var picture_holder_2 = $("#picture_holder_2");
      var picture_holder_3 = $("#picture_holder_3");

      if (id == 1) {
        this.idPicture = 1;
        picture_holder.css('background',"url('/assets/images/seam/1.jpg') no-repeat");
        picture_holder_2.css('background',"url('/assets/images/seam/1.jpg') no-repeat");
        picture_holder_3.css('background',"url('/assets/images/seam/1.jpg') no-repeat");

      } else if (id == 2) {
        this.idPicture = 2;
        picture_holder.css('background',"url('/assets/images/seam/2.jpg') no-repeat");
        picture_holder_2.css('background',"url('/assets/images/seam/2.jpg') no-repeat");
        picture_holder_3.css('background',"url('/assets/images/seam/2.jpg') no-repeat");
      } else if (id == 3) {
        this.idPicture = 3;
        picture_holder.css('background',"url('/assets/images/seam/3.jpg') no-repeat");
        picture_holder_2.css('background',"url('/assets/images/seam/3.jpg') no-repeat");
        picture_holder_3.css('background',"url('/assets/images/seam/3.jpg') no-repeat");

      } else {
        this.idPicture = 4;
        picture_holder.css('background',"url('/assets/images/seam/4.jpg') no-repeat");
        picture_holder_2.css('background',"url('/assets/images/seam/4.jpg') no-repeat");
        picture_holder_3.css('background',"url('/assets/images/seam/4.jpg') no-repeat");

      }
      picture_holder.css('background-size','cover');
      picture_holder_2.css('background-size','cover');
      picture_holder_3.css('background-size','cover');

    }
  }

  setToCarveImage(img:ToCarveImage): void {
    this.toCarveImage = img;
  }

  launchCarving(): void {
      this.isDone = true;
        this.setToCarveImage(new ToCarveImage(this.idPicture));
        this.toCarveImage.seamsCalculation();
        this.setEnergyImg();

    }

    setEnergyImg(): void {
      let data = new Array();
      for (let i = 0; i < this.toCarveImage.getEnergyArray().length; i+=1) {
        data.push(this.toCarveImage.getEnergyArray()[i].r);
        data.push(this.toCarveImage.getEnergyArray()[i].g);
        data.push(this.toCarveImage.getEnergyArray()[i].b);
        data.push(255);
      }
      let cvsToGetSize = (<HTMLCanvasElement> document.getElementById('picture_holder_1'));
      let energyImage = new ImageData(new Uint8ClampedArray(data),this.toCarveImage.getInitialWidth(),this.toCarveImage.getInitialHeight());
      let picture_holder_2=<HTMLCanvasElement> document.getElementById("picture_holder_2");
      console.log(cvsToGetSize.scrollHeight,cvsToGetSize.scrollWidth);
      picture_holder_2.setAttribute('height',String(cvsToGetSize.scrollHeight));
      picture_holder_2.setAttribute('width',String(cvsToGetSize.scrollWidth));
      // picture_holder_2.getContext('2d').drawImage(energyImage,0,0,imgToGetSize.width,imgToGetSize.height);
      let ctx = picture_holder_2.getContext("2d");
      ctx.putImageData(energyImage,0,0);
    }
}
