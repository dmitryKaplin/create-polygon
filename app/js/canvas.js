/**
 * Easy creation of the polygons.
 *
 * @package create-polygon
 * @author Dmitry Kaplin <dmitry.kaplin@bigdropinc.com>
 */
import {fabric as fabric} from "fabric";
import elements from "./elements";
import polygon from "./objects/polygon";
import {canvasHandles} from "events/handles";

class Canvas
{
  /**
   * Initialize canvas
   *
   * @param {HTMLImageElement} imgObj
   * @return {Canvas}
   */
  initialize(imgObj)
  {
    var image,
      canvas,
      note;

    image = new fabric.Image(imgObj);
    image.set({angle: 0, selectable: false, opacity: .7});

    // remove old canvas DOM element
    if (canvas = document.getElementById('canvas'))
      canvas.parentNode.removeChild(canvas);

    // create canvas DOM element
    canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = imgObj.width+60;
    canvas.height = imgObj.height+60;
    elements.canvasWrapper.appendChild(canvas);

    // remvoe old note
    if (note = document.getElementById('note'))
      note.parentNode.removeChild(note);

    note = document.createElement('p');
    note.id = 'note';
    note.innerHTML = `
      <div>Please press <b>CTRL + click</b> to create a new point.</div>
      <div>Please select point and press <b>delete</b> or <b>back</b> key to delete point.</div>
    `;
    elements.canvasWrapper.appendChild(note);

    // initialize fabric canvas
    canvas = new fabric.Canvas('canvas');
    canvas.hoverCursor = 'pointer';

    // bind all canvas events
    for (let key in canvasHandles)
      if ('function' === typeof canvasHandles[key])
        canvas.on(key, canvasHandles[key]);

    canvas.centerObject(image);
    canvas.add(image);
    canvas.renderAll();

    // save canvas instance
    this.canvas = canvas;

    return this;
  }

  /**
   * Clear canvas
   *
   * @return {Canvas}
   */
  clear()
  {
    let h2,
      note;

    if (this.canvas === void 0)
      return this;

    polygon.objectId = 0;
    polygon.points = [];

    // remove note elements
    if (note = document.getElementById('note'))
      note.parentNode.removeChild(note);

    // remove old canvas elements
    this.canvas.wrapperEl.parentNode.removeChild(this.canvas.wrapperEl);

    // create notive title
    h2 = document.createElement('h2');
    h2.innerText = 'Please select image.';
    h2.id = 'canvas';
    elements.canvasWrapper.appendChild(h2);

    elements.resultBox.value = 'No results.';
    elements.radiusInput.el.value = 3;
    this.canvas = void 0;

    return this;
  }
}

let canvas = new Canvas();
export default canvas;