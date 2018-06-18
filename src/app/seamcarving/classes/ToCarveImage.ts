import { Pixel } from './Pixel'
  /**
  * class managing the image carving process and loading
  * @author Thomas DI MARTINO. (http://dimartinot.com)
  */
export class ToCarveImage {
     initialWidth: number;
     initialHeight: number;
     rgbArray: Pixel[] = new Array();
     energyArray: Pixel[] = new Array();
     loaded: boolean = false;
    /**
    * Constructor of the class.
    * @param {number} id - The id to create the Image variable from the correct canvas
    */
    constructor(public id:number) {
      this.executeCarving(this);
    }

    setInitialWidth(width:number): void {
      this.initialWidth = width;
    }

    setInitialHeight(height:number): void {
      this.initialHeight = height;
    }

    getInitialWidth(): number {
      return this.initialWidth;
    }

    getInitialHeight(): number {
      return this.initialHeight;
    }

    getEnergyArray(): Pixel[] {
      return this.energyArray;
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
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      let imgToGetSize = (<HTMLImageElement> document.getElementById('picture_holder_1'));
      canvas.setAttribute('height',String(imgToGetSize.height));
      canvas.setAttribute('width',String(imgToGetSize.width));

      let img = new Image();
      img.src = '../../../assets/images/seam/'+this.id+'.jpg';
      let imgWidth = img.width || img.naturalWidth;
      let imgHeight = img.height || img.naturalHeight;
      console.log(imgToGetSize.width,imgToGetSize.height);
      ctx.drawImage(img,0,0,imgToGetSize.width,imgToGetSize.height);
      this.setInitialWidth(imgToGetSize.width);
      this.setInitialHeight(imgToGetSize.height);
      let data = ctx.getImageData(0, 0, imgToGetSize.width,imgToGetSize.height).data;
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
      let maxEnergy = 1;
      for (let i = 0; i < listOfEnergy.length; i += 1) {
        if (listOfEnergy[i]>maxEnergy) {
          maxEnergy = listOfEnergy[i];
        }
      }
      for (let i = 0; i < this.rgbArray.length; i += 1) {
         let value = listOfEnergy[i]/255;
        let pixel = new Pixel(value,value,value);
        this.energyArray.push(pixel);
      }
      this.loaded = true;

    }


}
