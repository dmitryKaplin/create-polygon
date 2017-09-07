/**
 * Easy creation of the polygons.
 *
 * @package create-polygon
 * @author Dmitry Kaplin <dmitry.kaplin@bigdropinc.com>
 */
export default {
  btnCreatePolygon: {
    el: document.getElementById('create-polygon'),
    events: {
      click: ['createPolygon']
    }
  },
  btnClear: {
    el: document.getElementById('clear'),
    events: {
      click: ['clear']
    }
  },
  imageInput: {
    el: document.getElementById('image'),
    events: {
      change: ['uploadImage']
    }
  },
  resultBox: document.getElementById('result'),
  radiusInput: {
    el: document.getElementById('radius'),
    events: {
      input: ['changePointRadius']
    }
  },
  canvasWrapper: document.getElementById('canvas-wrapper')
};