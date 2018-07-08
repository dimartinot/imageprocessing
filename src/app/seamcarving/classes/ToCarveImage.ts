import { Pixel } from './Pixel';
  /**
  * @class
  * @classdesc class managing the image carving process and loading
  * @author Thomas DI MARTINO. (http://dimartinot.com)
  */
export class ToCarveImage {
    /**
    * Variables used to store the size of the image
    */
    initialWidth: number;
    initialHeight: number;
    /**
    * Array used to store the pixels of the image
    */
    rgbArray: Pixel[] = new Array();
    /**
    * Array used to store the energy (with the seams) of the image as Pixels
    */
    energyArray: Pixel[] = new Array();
    /**
    * Array used to store the amount of energy needed to access a given Pixel
    */
    energyAccumulatedArray: number[][] = new Array();
    /**
    * Array of seams : chain of pixels
    */
    seamsArray: number[][] = new Array();
    /**
    * Array used to store the result of the carving process
    */
    carvedImage : Pixel[] = new Array();

    /**
    * Constructor of the class.
    * @constructor
    * @param {number} id - The id to create the Image variable from the correct canvas
    * @param {string} src - The link of the image chosen to be carved.
    */
    constructor(private id:number, private src:string) {
      ToCarveImage.executeCarving(this);
    }

    /**
    * Setter of the initialWidth attribute
    * @param {number} width - the width to set the initialWidth at
    */
    setInitialWidth(width:number): void {
      this.initialWidth = width;
    }

    /**
    * Setter of the initialHeight attribute
    * @param {number} height - the height to set the initialHeight at
    */
    setInitialHeight(height:number): void {
      this.initialHeight = height;
    }

    /**
    * Getter of the initialWidth attribute
    * @return {number} - returns the initialWidth of the ToCarveImage object
    */
    getInitialWidth(): number {
      return this.initialWidth;
    }

    /**
    * Getter of the initialHeight attribute
    * @return {number} - returns the initialHeight of the ToCarveImage object
    */
    getInitialHeight(): number {
      return this.initialHeight;
    }

    /**
    * Getter of the energyArray attribute
    * @return {Pixel[]} - returns the energyArray of the ToCarveImage object
    */
    getEnergyArray(): Pixel[] {
      return this.energyArray;
    }

    /**
    * Getter of the carvedImage attribute
    * @return {Pixel[]} - returns the energyArray of the carvedImage object
    */
    getCarvedImage() : Pixel[] {
      return this.carvedImage;
    }

    /**
    * Executes the functions to create the carved image
    * @param {ToCarveImage} img - ToCarveImage variable
    */
    static executeCarving(img:ToCarveImage) {
      img.imageToRgbArray();
      img.energyCalculation();
    }

    /**
    * Procedure used to initialise an array of Pixels object (cf Pixel.ts for more details) into the rgbArray attribute
    */
    imageToRgbArray(): void {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let src= this.src;
      let cvsToGetSize = (<HTMLCanvasElement> document.getElementById('picture_holder_1'));
      if (cvsToGetSize != null) {
        canvas.setAttribute('height',String(cvsToGetSize.scrollHeight));
        canvas.setAttribute('width',String(cvsToGetSize.scrollWidth));
  
        let img = new Image();
        img.src = src;
        let imgWidth = img.width || img.naturalWidth;
        let imgHeight = img.height || img.naturalHeight;
        ctx.drawImage(img,0,0,cvsToGetSize.scrollWidth,cvsToGetSize.scrollHeight);
        this.setInitialWidth(cvsToGetSize.scrollWidth);
        this.setInitialHeight(cvsToGetSize.scrollHeight);
        let data = ctx.getImageData(0, 0, cvsToGetSize.scrollWidth,cvsToGetSize.scrollHeight).data;
        //i+=4 because the 4th value is the alpha component
        for (let i = 0; i < data.length; i += 4) {
            let pixel = new Pixel(data[i], data[i+1], data[i+2]);
                this.rgbArray.push(pixel);
            }
      } else {
        let img = new Image();
        img.src = src;
        let imgWidth = img.width || img.naturalWidth;
        let imgHeight = img.height || img.naturalHeight;
        ctx.drawImage(img,0,0,imgWidth, imgHeight);
        this.setInitialWidth(imgWidth);
        this.setInitialHeight(imgHeight);
        let data = ctx.getImageData(0, 0, imgWidth, imgHeight).data;
        //i+=4 because the 4th value is the alpha component
        for (let i = 0; i < data.length; i += 4) {
            let pixel = new Pixel(data[i], data[i+1], data[i+2]);
                this.rgbArray.push(pixel); 
        }
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
    }

    /**
    * Return the <b> position </b> of the pixel of lowest energy on top of the current one.
    *  @param {number} i - describes the row where the three pixels to work on are positioned
    * @param {number} left - describes the column of the pixel at the top left
    * @param {number} top - describes the column of the pixel at the top
    * @param {number} right - describes the column of the pixel at the top right
    * @return {number} - the position of the chosen pixel
    */
    minOfThree(i:number, left: number, top: number, right: number): number {
      let optimum = 0;
      //We firsty check if the left pixel is, indeed, in the image
      if (left >= 0) {
          let min = Infinity;
          min = this.energyAccumulatedArray[i][left];
          optimum = (i)*this.initialWidth+left;
        if (this.energyAccumulatedArray[i][top] < min) {
          min = this.energyAccumulatedArray[i][top];
          optimum = (i)*this.initialWidth+top;
        }
        //If the left pixel is, indeed, in the image, we check for the right one
        if (right < this.initialWidth) {
          if (this.energyAccumulatedArray[i][right] < min) {
            min = this.energyAccumulatedArray[i][right];
            optimum = (i)*this.initialWidth+right;
          }
        }
        return optimum;
        //If the left pixel is not in the image, we check the two others
      } else {
        optimum = (i)*this.initialWidth+top;
        let min = this.energyAccumulatedArray[i][top];
        //Starting with the right one
        if (right < this.initialWidth) {
          if (this.energyAccumulatedArray[i][right] < min) {
            optimum = (i)*this.initialWidth+right;
            min = this.energyAccumulatedArray[i][right];
          }
        }
        return optimum;
      }
    }

    /**
    * Return the <b> energy value </b> of the pixel of lowest energy on top of the current one.
    *  @param {number} i - describes the row where the three pixels to work on are positioned
    * @param {number} left - describes the column of the pixel at the top left
    * @param {number} top - describes the column of the pixel at the top
    * @param {number} right - describes the column of the pixel at the top right
    * @return {number} - the energy value of the chosen pixel
    */
    minimumEnergy(i:number, left: number, top: number, right: number): number {
      let optimum = 0;
      if (left >= 0) {
        let min = this.energyAccumulatedArray[i][left];
        optimum = (i)*this.initialWidth+left;
        if (this.energyAccumulatedArray[i][top] < min) {
          min = this.energyAccumulatedArray[i][top];
          optimum = (i)*this.initialWidth+top;
        }
        if (right < this.initialWidth) {
          if (this.energyAccumulatedArray[i][right] < min) {
            min = this.energyAccumulatedArray[i][right];
            optimum = (i)*this.initialWidth+right;
          }
        }
        return min;
      } else {
        optimum = (i)*this.initialWidth+top;
        let min = this.energyAccumulatedArray[i][top];
        if (right < this.initialWidth) {
          if (this.energyAccumulatedArray[i][right] < min) {
            optimum = (i)*this.initialWidth+right;
            min = this.energyAccumulatedArray[i][right];
          }
        }
        return min;
      }
    }

    /**
    * This method determines the closest Top neightbour of a Pixel that is not a part of a seam. As seam will be deleted, the pixels that are already part of one can be considered as not existing.
    * @param {number} currentX - the x coordinate of the current pixel
    * @param {number} currentY - the y coordinate of the current pixel
    * @return the y coordinate of the future top neighbour
    */
    getCloserNonSeamTopNeightbour(currentX: number, currentY: number): number {
      let leftY = currentY;
      let leftPixel = (leftY+currentX*this.initialWidth);
      let rightY = currentY;
      let rightPixel = (rightY+currentX*this.initialWidth);
      if (leftY >= 0 && rightY < this.initialWidth) {
        while (leftY >= 0 && (this.energyArray[leftPixel].equals(new Pixel(255,0,0)))) {
            leftY--;
            leftPixel--;
        }
        while (rightY < this.initialWidth && this.energyArray[rightPixel].equals(new Pixel(255,0,0))) {
            rightY++;
            rightPixel++;
        }
      }
      let diffRight = Math.abs(currentY-rightY);
      let diffLeft = Math.abs(currentY-leftY);
      if (diffRight < diffLeft) {
        if (rightY < this.initialWidth) {
          return rightY;
        } else {
          return leftY;
        }
      } else {
        if (leftY >= 0) {
          return leftY;
        } else {
          return rightY;
        }
      }
    }

    /**
    * This method determines the closest left neightbour of a Pixel based on the already calculated top one
    * @param {number} topX - the x coordinate of the top pixel
    * @param {number} topY - the y coordinate of the top pixel
    * @return the y coordinate of the future left neighbour
    */
    getCloserNonSeamLeftNeighbour(topX: number, topY: number): number {
      let leftY = topY-1;
      let leftPixel = (leftY+topX*this.initialWidth);
      while (leftY >= 0 && this.energyArray[leftPixel].equals(new Pixel(255,0,0)) ) {
        leftY--;
        leftPixel--;
        // console.log(topX,topY,leftPixel,leftY,this.energyArray[leftPixel].equals(new Pixel(255,0,0)));
      }
      return leftY;
    }

    /**
    * This method determines the closest right neightbour of a Pixel based on the already calculated top one
    * @param {number} topX - the x coordinate of the top pixel
    * @param {number} topY - the y coordinate of the top pixel
    * @return the y coordinate of the future right neighbour
    */
    getCloserNonSeamRightNeighbour(topX: number, topY: number): number {
      let rightY = topY+1;
      let rightPixel = (rightY+topX*this.initialWidth);
      while (rightY < this.initialWidth && this.energyArray[rightPixel].equals(new Pixel(255,0,0))) {
        rightY++;
        rightPixel++;
      }
      return rightY;
    }

    /**
    * This method evaluates the seams of a picture and write them on the seamsArray variable.
    * Then, they are drawn onto the result canva as red lines.
    */
    seamsCalculation(): void {
      let rowOfEnergy = new Array();
      for (let i=0; i < this.initialWidth; i+=1) {
        rowOfEnergy.push(this.energyArray[i].r);
      }
      this.energyAccumulatedArray.push(rowOfEnergy);
      for (let i=1; i < this.initialHeight; i+=1) {
        let rowOfEnergy = new Array();
        for (let j=0; j < this.initialWidth; j+=1) {
          rowOfEnergy.push(this.energyArray[i*this.initialWidth+j].r+this.minimumEnergy(i-1,j-1,j,j+1));
        }
        this.energyAccumulatedArray.push(rowOfEnergy);
      }
      let minJ = 0;
      let minArrival = Infinity;
      for (let i = 0; i < 100; i+=1) {
        if (this.seamsArray.length != 0) {
          //If a seam just got calculated, we do not have to re-evaluate the energyAccumulated component of every pixel, just the one next to the lastly calculated seams
          for (let s = 0; s < this.seamsArray[this.seamsArray.length-1].length-1; s++) {
            let seamComponentIndex = this.seamsArray[this.seamsArray.length-1][s];
            let x = Math.floor(seamComponentIndex / this.initialWidth);
            let y = Math.floor(seamComponentIndex % this.initialWidth);
            if (y-1 > 0 && x > 0) {
              let topPixel = this.getCloserNonSeamTopNeightbour(x-1,y-1);
              let leftPixel = this.getCloserNonSeamLeftNeighbour(Math.floor(topPixel / this.initialWidth), Math.floor(topPixel % this.initialWidth));
              let rightPixel = this.getCloserNonSeamRightNeighbour(Math.floor(topPixel / this.initialWidth), Math.floor(topPixel % this.initialWidth));
              if (this.energyAccumulatedArray[x][y-1] != Infinity) {
                this.energyAccumulatedArray[x][y-1] = this.energyArray[x*this.initialWidth+y-1].r+this.minimumEnergy(x-1,leftPixel,topPixel,rightPixel);
              }
            }
            if (y+1 < this.initialWidth && x > 0) {
              let topPixel = this.getCloserNonSeamTopNeightbour(x-1,y+1);
              let leftPixel = this.getCloserNonSeamLeftNeighbour(Math.floor(topPixel / this.initialWidth), Math.floor(topPixel % this.initialWidth));
              let rightPixel = this.getCloserNonSeamRightNeighbour(Math.floor(topPixel / this.initialWidth), Math.floor(topPixel % this.initialWidth));
              if (this.energyAccumulatedArray[x][y+1] != Infinity) {
                this.energyAccumulatedArray[x][y+1] = this.energyArray[x*this.initialWidth+y+1].r+this.minimumEnergy(x-1,leftPixel,topPixel,rightPixel);
              }
            }
          }
        }
        

        minArrival = Infinity;
        /**
        * To draw seams, we firstly have to get the lowest bottom value, as it is the equivalent of an arrival value
        */
        let tmpMinJ = minJ;
        for (let j =0; j < this.initialWidth; j+=1) {
          if (minArrival > this.energyAccumulatedArray[this.initialHeight-1][j] && this.energyAccumulatedArray[this.initialHeight-1][j] != Infinity && tmpMinJ != j) {
            minArrival = this.energyAccumulatedArray[this.initialHeight-1][j];
            minJ = j;
          }
        }
        /**
        * Then, we set the energy value to -1 in order to be sure not to pass through it again
        */
        let seam = new Array();
        let minPixel = (this.initialHeight-1)*this.initialWidth+minJ;
        let tmpMinPixel = 0;
        this.energyAccumulatedArray[this.initialHeight-1][minJ] = Infinity;
        this.energyArray[minPixel] = new Pixel(255,0,0);
        seam.push(minPixel);
        /**
        * Afterward, we loop on the Map collection to reconstruct the path and delete the visited edges in order not to go through the same path twice
        */
        while (minPixel >= this.initialWidth) {
          let x = Math.floor(minPixel / this.initialWidth);
          let y = Math.floor(minPixel % this.initialWidth);
          let topPixel = this.getCloserNonSeamTopNeightbour(x-1,y);
          let leftPixel = this.getCloserNonSeamLeftNeighbour(Math.floor(topPixel / this.initialWidth), Math.floor(topPixel % this.initialWidth));
          let rightPixel = this.getCloserNonSeamRightNeighbour(Math.floor(topPixel / this.initialWidth), Math.floor(topPixel % this.initialWidth));
          tmpMinPixel = this.minOfThree(x-1, leftPixel, topPixel, rightPixel);
          minPixel = tmpMinPixel;
          seam.push(minPixel);
          x = Math.floor(minPixel / this.initialWidth);
          y = Math.floor(minPixel % this.initialWidth);
          this.energyArray[minPixel] = new Pixel(255,0,0);
          this.energyAccumulatedArray[x][y] = Infinity;
        }
        this.seamsArray.push(seam);
      }
    }

    /**
    * This method copies every pixel of the original rgbArray except the seams
    */
    applyCarving(): void {
      let redPixel = new Pixel(255,0,0);
      let counter = 0;
      for (let i = 0; i < this.rgbArray.length; i+=1) {
        //If the current pixel is not in a seam, copy it
        if (!this.energyArray[i].equals(redPixel)) {
          this.carvedImage.push(this.rgbArray[i]);
        } else {
          counter++;
        }
      }
      console.log(counter);
    }
}
