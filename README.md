# Image Processing

Developed in Angular 6, this project is a WebApp listing a few processes dealing with image analysis. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes

### Prerequisites

First thing first, you need to make sure that you have both NPM and, then Angular.
For that, write down this command
```bash
npm -v
```
to get the NPM version and make sure it is installed. Afterward, enterthis
```bash
ng -v
```
for the Angular version. Pay close attention to the fact that this project in developed in Angular and NOT in AngularJS.

### Installing

As this GitHub only contains the src and e2e folders alongside with the configuration .JSON files, you might need to install some modules to have this app to work.
For that, here is the list of all external modules I have used in this project :
```typescript
import { NgbModule } from  '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from  '@ng-bootstrap/ng-bootstrap';
```
All these modules come from the [ng-bootstrap](https://ng-bootstrap.github.io/#/home) library. To download it, you just have to enter this command : 
```bash
npm install --save @ng-bootstrap/ng-bootstrap
```
## Running the project

As any other Angular project, to run it, you only have to enter this commandline :
```bash
ng serve
```
You should arrive on the main page displaying a text explaining the concepts of what I implemented. 

### Seamcarving

This part is made of two standalone *Typescript* classes respectively named **Pixel** and **toCarveImage**.
The first one represents the concept of a pixel throughout an object. Its definition is as followed :
```Typescript
export  class  Pixel {

	r:  number;
	g:  number;
	b:  number;
	
	constructor(r:  number, g:  number, b:  number) {
		this.r  =  r;
		this.g  =  g;
		this.b  =  b;
	}

	public  equals(obj:  Pixel) :  boolean {
		return ((this.r  ==  obj.r) && (this.g  ==  obj.g) && (this.b  ==  obj.b));
	}
}
```
It is made of 3 components, each describing the red, green and blue components of a pixel. Please take note that I did not take into account the *alpha* of a pixel.

The other class is composed like this :
```Typescript
export  class  ToCarveImage {
	initialWidth:  number;
	initialHeight:  number;
	rgbArray:  Pixel[] =  new  Array();
	energyArray:  Pixel[] =  new  Array();
	energyAccumulatedArray:  number[][] =  new  Array();
	seamsArray:  number[][] =  new  Array();
	carvedImage  :  Pixel[] =  new  Array();
[...]
	executeCarving(img:ToCarveImage) {
		img.imageToRgbArray();
		img.energyCalculation();
	}
}
```
I have only put the attributes of the class here but there are plenty of methods whose objective are to evaluate these attribute : 
 - The first two describe the original size of the image, not based on the image file size but on the size of the canvas containing it. It allows the process to give sensibly different results depending on the resolution of the browser.
 - The 3rd is a representation of the picture in an array of Pixels. You might ask yourself why is it not a matrix. I just like the idea of using unidimensionnal array and accessing the $(i,j)$ pixel using this formula : 
  ```Typescript
  P(i,j) = rgbArray[i*initialWidth + j]
 ``` 
  - The 4th is the same as the last array of Pixels but with their rgb values replaced by their energy value
  - The 5th is the **energyAccumulatedArray** which store, for each $(i,j)$ pixel, the minimal accumulative cost of accessing it. If this notion troubles you, I invite you to consult the front page of my [website](http://imageprocessing.dimartinot.com).
  - Afterward, we store the calculated seams in the 6th component : the **seamsArray**. It is a list of all the seams, each of them being represented as a list of number, the number being the index of the Pixel in the energyArray (i.e the rgbArray) array.

To apply my process on a **ToCarveImage** object, you only need to call the static **executeCarving** with the object granted as a parameter.
Afterward, the resulting seams will be accessible through the component I described earlier.

## Built With

* [Angular](https://angular.io/) - The web framework used
* [Ng-Bootstrap](https://ng-bootstrap.github.io/#/home) - Widget Module

## Authors

* **Thomas Di Martino** - *Initial work* - [ImageProcessing](https://imageprocessing.dimartinot.com)

See also plenty of other projects from me in my website at this [link](http://dimartinot.com).

## Acknowledgments

See the *Credits* section of my website for the exhaustive list of acknowledgments

Thank you for your interest in my project, I hope to hear more about you soon.