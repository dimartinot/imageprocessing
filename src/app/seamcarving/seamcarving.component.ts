import { Component, OnInit } from '@angular/core';
import { ToCarveImage } from './classes/ToCarveImage';
import * as $ from 'jquery';
@Component({
  selector: 'app-seamcarving',
  templateUrl: './seamcarving.component.html',
  styleUrls: ['./seamcarving.component.css']
})

/**
* @class
* @classdesc This class implements the Angular component of the seamcarving view containing a ToCarveImage object, for instance.
* @author Thomas DI MARTINO. (http://dimartinot.com)
*/
export class SeamcarvingComponent implements OnInit {
  /**
  * Tells when the calculation is over
  */
  isDone: boolean = false;
  /**
  * Describes the id of the currently examined picture
  */
  idPicture: number = 1;
  /**
  * Describes the ToCarveImage object that is to be drawn
  */
  toCarveImage: ToCarveImage;
  constructor() {
  }

  ngOnInit() {
  }

  /**
  * This method is the handler of the click event on the four bottom buttons, switching images.
  * @param {number} id - the id of the picture to set on the picutre_holder canvas
  */
  switchPicture(id: number): void {
    if (id != this.idPicture) {
      var picture_holder = $("#picture_holder_1");
      // var picture_holder_2 = $("#picture_holder_2");
      // var picture_holder_3 = $("#picture_holder_3");

      if (id == 1) {
        this.idPicture = 1;
        picture_holder.css('background',"url('/assets/images/seam/1.jpg') no-repeat");

      } else if (id == 2) {
        this.idPicture = 2;
        picture_holder.css('background',"url('/assets/images/seam/2.jpg') no-repeat");
      } else if (id == 3) {
        this.idPicture = 3;
        picture_holder.css('background',"url('/assets/images/seam/3.jpg') no-repeat");

      } else {
        this.idPicture = 4;
        picture_holder.css('background',"url('/assets/images/seam/4.jpg') no-repeat");

      }
      picture_holder.css('background-size','cover');

    }
  }

  /**
  * Setter of the toCarveImage attribute
  * @param {ToCarveImage} img - the toCarveImage object this method sets the toCarveImage attribute to
  */
  setToCarveImage(img:ToCarveImage): void {
    this.toCarveImage = img;
  }

  /**
  * Launches the carving procedure, divided in multiple sub-procedures.
  */
  launchCarving(): void {
        this.setToCarveImage(new ToCarveImage(this.idPicture));
        this.toCarveImage.seamsCalculation();
        this.setEnergyImg();
        this.toCarveImage.applyCarving();
        this.setCarvedImg();
        this.isDone = true;
    }

    /**
    * Draws the energyImage in the "process details" area
    */
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
      picture_holder_2.setAttribute('height',String(cvsToGetSize.scrollHeight));
      picture_holder_2.setAttribute('width',String(cvsToGetSize.scrollWidth));
      // picture_holder_2.getContext('2d').drawImage(energyImage,0,0,imgToGetSize.width,imgToGetSize.height);
      let ctx = picture_holder_2.getContext("2d");
      ctx.putImageData(energyImage,0,0);
    }

    setCarvedImg(): void {
      let data = new Array();
      for (let i = 0; i < this.toCarveImage.getCarvedImage().length; i+=1) {
        data.push(this.toCarveImage.getCarvedImage()[i].r);
        data.push(this.toCarveImage.getCarvedImage()[i].g);
        data.push(this.toCarveImage.getCarvedImage()[i].b);
        data.push(255);
      }
      let cvsToGetSize = (<HTMLCanvasElement> document.getElementById('picture_holder_1'));
      let energyImage = new ImageData(new Uint8ClampedArray(data),Math.floor(this.toCarveImage.getCarvedImage().length/cvsToGetSize.scrollHeight),this.toCarveImage.getInitialHeight());
      let picture_holder_3=<HTMLCanvasElement> document.getElementById("picture_holder_3");
      picture_holder_3.setAttribute('height',String(cvsToGetSize.scrollHeight));
      picture_holder_3.setAttribute('width',String(this.toCarveImage.getCarvedImage().length/cvsToGetSize.scrollHeight));
      let ctx = picture_holder_3.getContext("2d");
      ctx.putImageData(energyImage,0,0);
    }
}
