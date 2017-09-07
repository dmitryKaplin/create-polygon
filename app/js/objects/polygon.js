/**
 * Easy creation of the polygons.
 *
 * @package create-polygon
 * @author Dmitry Kaplin <dmitry.kaplin@bigdropinc.com>
 */
import {fabric as fabric} from "fabric";
import canvas from "../canvas";
import elements from "../elements";

class Polygon
{
  constructor()
  {
    this.points = [];
    this.cacheObjects = [];
    this.objectId = 0;
  }

  /**
   * Retrieve json coordinates
   *
   * @return {String}
   */
  getJsonCoords()
  {
    var coords;

    coords = [];

    for (let i = 0; i < this.points.length; i++) {
      let x = this.points[i].x.toFixed(0)*1,
        y = this.points[i].y.toFixed(0)*1;
      coords.push([x-30, y-30]);
    }

    return JSON.stringify(coords);
  }

  /**
   * Add point to collection
   *
   * @param {Object} point
   * @return {Polygon}
   */
  addPoint(point)
  {
    point.objectId = ++this.objectId;
    this.points.push(point);
    return this;
  }

  /**
   * Remove point by index
   *
   * @param {Number} index
   * @return {Polygon}
   */
  removePoint(index)
  {
    polygon.points.splice(index, 1);
    return this;
  }

  updateActivePoint(dir)
  {
    var activeObject = canvas.canvas.getActiveObject();

    if (!activeObject || !activeObject.objectId)
      return this;

    for (let i = 0; i < this.points.length; i++) {
      if (activeObject.objectId == this.points[i].objectId) {
        activeObject = this.points[i];
        break;
      }
    }

    switch (dir) {
      case 'up':
        activeObject.y -= 1;
        break;
      case 'down':
        activeObject.y += 1;
        break;
      case 'left':
        activeObject.x -= 1;
        break;
      case 'right':
        activeObject.x += 1;
        break;
    }

    this.render();

    return this;
  }

  /**
   * Render polygon
   *
   * @return {Polygon}
   */
  render()
  {
    var activeObject,
      pointRadius;

    if (canvas.canvas === void 0)
      return this;

    activeObject = canvas.canvas.getActiveObject();

    // remove old objects (points and lines)
    for (let i = 0; i < this.cacheObjects.length; i++)
      canvas.canvas.remove(this.cacheObjects[i]);
    this.cacheObjects = [];

    pointRadius = parseInt(elements.radiusInput.el.value);
    // add all points
    for (let i = 0; i < this.points.length; i++) {
      let point = new fabric.Circle({
        left: this.points[i].x,
        top: this.points[i].y,
        objectId: this.points[i].objectId,
        radius: pointRadius > 10 ? 10 : pointRadius < 0 ? 0 : pointRadius,
        fill: 'black',
        isPoint: true,
        selectable: true,
        originX: 'center',
        originY: 'center'
      });
      this.cacheObjects.push(point);
      canvas.canvas.add(point);
    }

    if (this.points.length >= 2) {
      for (let i = 0; i < this.points.length; i++) {
        if (!this.points[i+1])
          break;

        let line = new fabric.Line([this.points[i].x, this.points[i].y, this.points[i+1].x, this.points[i+1].y], {
          stroke: 'blue',
          isLine: true,
          selectable: false
        });

        this.cacheObjects.push(line);
        canvas.canvas.add(line);
      }
    }

    canvas.canvas.setActiveObject(activeObject);

    if (this.points.length) {
      elements.resultBox.value = this.getJsonCoords();
    } else {
      elements.resultBox.value = 'No results.';
    }

    return this;
  }
}

let polygon = new Polygon();
export default polygon;