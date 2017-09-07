/**
 * Easy creation of the polygons.
 *
 * @package create-polygon
 * @author Dmitry Kaplin <dmitry.kaplin@bigdropinc.com>
 */
import elements from "../elements";
import polygon from "../objects/polygon";
import canvas from "../canvas";
import controlKey from "../control/key";

export default {
  createPolygon: function () {
    if (polygon.points.length) {
      elements.resultBox.value = polygon.getJsonCoords();
    } else {
      elements.resultBox.value = 'No results.';
    }
  },
  clear: function () {
    canvas.clear();
    elements.imageInput.el.value = '';
  },
  uploadImage: function (e) {
    canvas.clear();

    var reader = new FileReader();
    reader.onload = function (e){
      var imgObj = new Image();
      imgObj.src = e.target.result;
      imgObj.onload = function () {
        canvas.initialize(imgObj);
      }
    }
    reader.readAsDataURL(e.target.files[0]);
  },
  changePointRadius: function () {
    if (canvas.canvas === void 0)
      return;

    polygon.render();
  },
};

export const canvasHandles = {
  'mouse:down': function (o) {
    if (!controlKey.keys.cntrl)
      return false;

    polygon.addPoint(canvas.canvas.getPointer(o.e));
    polygon.render();
  },
  'object:moving': function (o) {
    for (let i = 0; i < polygon.points.length; i++) {
      if (polygon.points[i].objectId === o.target.objectId) {
        let pointer = canvas.canvas.getPointer(o.e);
        polygon.points[i].x = pointer.x;
        polygon.points[i].y = pointer.y;
      }
    }

    polygon.render();
  }
};

export const eventEmitterHandles = {
  'press-left': function () {
    polygon.updateActivePoint('left');
  },
  'press-up': function () {
    polygon.updateActivePoint('up');
  },
  'press-right': function () {
    polygon.updateActivePoint('right');
  },
  'press-down': function () {
    polygon.updateActivePoint('down');
  },
  'press-delete': function () {
    var objects = canvas.canvas.getActiveObjects();
    if (!objects.length)
      return;

    for (let i = 0; i < objects.length; i++)
      for (let j = 0; j < polygon.points.length; j++)
        if (objects[i].objectId === polygon.points[j].objectId)
          polygon.removePoint(j);

    polygon.render();
  }
};