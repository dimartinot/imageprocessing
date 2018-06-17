import { Component, OnInit } from '@angular/core';
import { SeamCarvingService } from '../services/seamcarving.service';
import { ToCarveImage } from './classes/ToCarveImage';

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

  switchPicture(id number): void {
    this.isDone = false;
    if (id != this.idPicture) {
      let picture_holder = $("#picture_holder_1");
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


  launchCarving(): void {
      this.isDone = true;
      this.toCarveImage = new ToCarveImage('/assets/images/seam/'+this.idPicture+'.jpg');
      console.log(this.toCarveImage);
      this.setEnergyImg();
    }

    setEnergyImg(): void {
      let data = new Array();
      for (let i = 0; i < this.toCarveImage.energyArray.length; i+=1) {
        data.push(parseFloat(this.toCarveImage.energyArray[i].r));
        data.push(parseFloat(this.toCarveImage.energyArray[i].g));
        data.push(parseFloat(this.toCarveImage.energyArray[i].b));
        data.push(255);
      }
      let energyImage = new ImageData(new Uint8ClampedArray(data),this.toCarveImage.initialWidth,this.toCarveImage.initialHeight);
      let picture_holder_2=document.getElementById("picture_holder_2");
      let ctx = picture_holder_2.getContext("2d");
      ctx.putImageData(energyImage,0,0);
    }
}
