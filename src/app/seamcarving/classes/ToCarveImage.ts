import { Pixel } from './Pixel.ts'
  /**
  * class managing the image carving process and loading
  * @author Thomas DI MARTINO. (http://dimartinot.com)
  */
export class ToCarveImage {
    private initialWidth: int;
    private initialHeight: int;
    private rgbArray: Pixel[] = new Array();
    private energyArray: Pixel[] = new Array();
    private image;
    /**
    * Constructor of the class.
    * @param {string} url - The link to create the Image variable that will, afterward, be transformed into an array of Pixel
    */
    constructor(url:string) {
      this.image = new Image();
      this.image.onload = (() => this.executeCarving(this));
      this.image.src = url;
    }

    /**
    * Executes the functions to create the carved image
    * @param {ToCarveImage} img - ToCarveImage variable
    */
    executeCarving(img:ToCarveImage) {
      img.imageToRgbArray();
      img.energyCalculation();
    }

    /**
    * We initialise an array of Pixels from an Image variable.
    */
    imageToRgbArray(): void {
      this.initialWidth = this.image.width;
      this.initialHeight = this.image.height;
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
      let data = ctx.getImageData(0, 0, this.image.width, this.image.height).data;
      //i+=4 because the 4th value is the alpha one
      for (let i = 0; i < data.length; i += 4) {
          let pixel = new Pixel(data[i], data[i+1], data[i+2]);
              this.rgbArray.push(pixel);
          }
    }

    /**
    * Launch the calculus of the "energy" of the image. The notion of "image energy" is described in StackOverflow at this following link : "https://stackoverflow.com/questions/4562801/what-is-energy-in-image-processing"
    * It will fill the energyArray variable of the toCarveImage with the corresponding Pixel objects.
    */
    energyCalculation(): void {
      let listOfEnergy = new Array();
      for (let i = 0; i < this.rgbArray.length; i += 1) {
        let deltaX = 0;
        let deltaY = 0;
        /*
        * We define the y coordinate of the top neighbour (y1) and the bottom neightbour (y2) of the i Pixel
        */
        let y1 = i - this.initialWidth;
        let y2 = i + this.initialWidth;
        /*
        * We define the x coordinate of the left neighbour (x1) and the right neighbour (x2) of the i Pixel
        */
        let x1 = i - 1;
        let x2 = i + 1;
        /*
        * We deal with the border pixels
        */
        if (i < this.initialWidth) {
          y1 = i + this.initialWidth;
          y2 = i + 2*this.initialWidth;
        } else if (i/this.initialWidth >= this.initialHeight-1) {
          y1 = i - this.initialWidth;
          y2 = i - 2*this.initialWidth;
        }
        if (i % this.initialWidth == 0) {
          x1 = i + 1;
          x2 = i + 2;

        } else if ((i+1) % this.initialWidth == 0) {
          x1 = i - 1;
          x2 = i - 2;
        }
        deltaY += (this.rgbArray[y1].r-this.rgbArray[y2].r)**2+(this.rgbArray[y1].g-this.rgbArray[y2].g)**2+(this.rgbArray[y1].b-this.rgbArray[y2].b)**2;
        deltaX += (this.rgbArray[x1].r-this.rgbArray[x2].r)**2+(this.rgbArray[x1].g-this.rgbArray[x2].g)**2+(this.rgbArray[x1].b-this.rgbArray[x2].b)**2;
        listOfEnergy.push(deltaX+deltaY);
      }
      /*
      * We get the maximum energy to normalize the listOfEnergy and make it displayable and understandable
      */
      let maxEnergy = 0;
      for (let i = 0; i < listOfEnergy.length; i += 1) {
        if (listOfEnergy[i]>maxEnergy) {
          maxEnergy = listOfEnergy[i];
        }
      }
      for (let i = 0; i < this.rgbArray.length; i += 1) {
        let value = 255*listOfEnergy[i]/maxEnergy;
        let pixel = new Pixel(value,value,value);
        this.energyArray.push(pixel);
      }
    }


}
