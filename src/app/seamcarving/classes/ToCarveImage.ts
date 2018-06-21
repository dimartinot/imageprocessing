import { Pixel } from './Pixel';
  /**
  * class managing the image carving process and loading
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
    * Array used to store all the local optimal edges between the key to the value
    */
    edgesArray: Map<number, number> = new Map<number, number>();
    /**
    * Array of seams : chain of pixels
    */
    seamsArray: number[][] = new Array();
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

      let cvsToGetSize = (<HTMLCanvasElement> document.getElementById('picture_holder_1'));
      canvas.setAttribute('height',String(cvsToGetSize.scrollHeight));
      canvas.setAttribute('width',String(cvsToGetSize.scrollWidth));

      let img = new Image();
      img.src = '../../../assets/images/seam/'+this.id+'.jpg';
      let imgWidth = img.width || img.naturalWidth;
      let imgHeight = img.height || img.naturalHeight;
      console.log(cvsToGetSize.scrollWidth,cvsToGetSize.scrollHeight);
      ctx.drawImage(img,0,0,cvsToGetSize.scrollWidth,cvsToGetSize.scrollHeight);
      this.setInitialWidth(cvsToGetSize.scrollWidth);
      this.setInitialHeight(cvsToGetSize.scrollHeight);
      let data = ctx.getImageData(0, 0, cvsToGetSize.scrollWidth,cvsToGetSize.scrollHeight).data;
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
    }

    minOfThree(i:number, left: number, top: number, right: number): number {
      let optimum = 0;
      if (left >= 0) {

          let min = Infinity;
          try {
            min = this.energyAccumulatedArray[i][left];
          } catch (e) {
            console.log(i,left);
            throw e;
          }        optimum = (i)*this.initialWidth+left;
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
        return optimum;
      } else {
        optimum = (i)*this.initialWidth+top;
        let min = this.energyAccumulatedArray[i][top];
        if (right < this.initialWidth) {
          if (this.energyAccumulatedArray[i][right] < min) {
            optimum = (i)*this.initialWidth+right;
            min = this.energyAccumulatedArray[i][right];
          }
        }
        return optimum;
      }
    }

    minimumEnergy(i:number, left: number, top: number, right: number, source: number): number {
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
        if (optimum < 0) {
          this.edgesArray.set(source,0);
        } else {
          this.edgesArray.set(source,optimum);
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
        if (optimum < 0) {
          this.edgesArray.set(source,0);
        } else {
          this.edgesArray.set(source,optimum);
        }
        return min;
      }
    }

    /**
    * This method evaluates the seams of a picture and write them on the seamsArray variable.
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
          rowOfEnergy.push(this.energyArray[i*this.initialWidth+j].r+this.minimumEnergy(i-1,j-1,j,j+1,i*this.initialWidth+j));
        }
        this.energyAccumulatedArray.push(rowOfEnergy);
      }
      let minJ = 0;
      let minArrival = this.energyAccumulatedArray[this.initialHeight-1][0];
      for (let i = 0; i < 100; i+=1) {
        /**
        * To make sure that minArrival doesn't take the same value twice
        */
        for (let j = this.initialWidth-1; j > minJ; j-=1) {
          minArrival = this.energyAccumulatedArray[this.initialHeight-1][j];
        }
        minJ = 0;

        /**
        * To draw seams, we firstly have to get the lowest bottom value, as it is the equivalent of an arrival value
        */
        for (let j = 1; j < this.initialWidth; j+=1) {
          if (minArrival > this.energyAccumulatedArray[this.initialHeight-1][j] && this.energyAccumulatedArray[this.initialHeight-1][j]>0) {
            minArrival = this.energyAccumulatedArray[this.initialHeight-1][j];
            minJ = j;
          }
        }
        /**
        * Then, we set the energy value to -1 in order to be sure not to pass through it again
        */
        this.energyAccumulatedArray[this.initialHeight-1][minJ] = Infinity;
        let seam = new Array();
        let minPixel = (this.initialHeight-1)*this.initialWidth+minJ;
        let tmpMinPixel = 0;
        seam.push(minPixel);
        /**
        * Afterward, we loop on the Map collection to reconstruct the path and delete the visited edges in order not to go through the same path twice
        */
        while (minPixel > this.initialWidth) {
          //tmpMinPixel = this.edgesArray.get(minPixel);
          //this.edgesArray.delete(minPixel);
          let x = Math.floor(minPixel / this.initialWidth);
          let y = Math.floor(minPixel % this.initialWidth);
          console.log(minPixel,this.initialWidth);
          this.energyAccumulatedArray[x][y] = Infinity;
          tmpMinPixel = this.minOfThree(x-1, y-1, y, y+1);
          minPixel = tmpMinPixel;
          seam.push(minPixel);
          this.energyArray[minPixel] = new Pixel(255,0,0);
        }
        this.seamsArray.push(seam);
      }
    }
}
