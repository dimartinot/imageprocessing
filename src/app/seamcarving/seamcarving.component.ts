import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seamcarving',
  templateUrl: './seamcarving.component.html',
  styleUrls: ['./seamcarving.component.css']
})
export class SeamcarvingComponent implements OnInit {
  idPicture: number = 1;
  isDone: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  switchPicture(id number) {
    this.isDone = false;
    if (id != this.idPicture) {
      var picture_holder = $("#picture_holder_1");
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

  launchCarving() {
    this.isDone = true;
    console.log(true);
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        console.log(ctx);
      }
      img.src = '/assets/images/seam/'+this.idPicture+'.jpg';

}
