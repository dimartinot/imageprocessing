/**
* @class
* @classdesc Pixel class representing the implementation of a Pixel object
* @author Thomas DI MARTINO. (http://dimartinot.com)
*/
export class Pixel {
  /*
  * Describes the red component of a pixel
  */
  r: number;
  /*
  * Describes the green component of a pixel
  */
  g: number;
  /*
  * Describes the blue component of a pixel
  */
  b: number;
  /**
  * @constructor
  */
  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  public equals(obj: Pixel) : boolean {
    return ((this.r == obj.r) && (this.g == obj.g) && (this.b == obj.b));
  }
}
