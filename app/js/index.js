var canvas,
  points,
  lines,
  __objectId,
  pressedKeys,
  deletePointEvent,
  DOMEls;

points = [];
lines = [];
__objectId = 0;

pressedKeys = {
  cntrl: false,
  delete: false
};

DOMEls = {
  btnGeneratePoligon: document.getElementById('generate-poligon'),
  btnClear: document.getElementById('clear'),
  resultBox: document.getElementById('result'),
  imageInput: document.getElementById('image'),
  radiusInput: document.getElementById('radius'),
  canvasWrapper: document.getElementById('canvas-wrapper')
};

// set controls for objects (disable all control elements)
fabric.Object.prototype.setControlsVisibility({mt: false,mb: false,mr: false,ml: false,bl: false,br: false,tl: false,tr : false,mtr: false});

function renderPathByPoints() {
  var line;

  // remove all lines
  for(var i = 0; i < lines.length; i++) lines[i].remove();
  lines = [];

  if (points.length < 2) return;
  for (i = 0; i < points.length; i++) {
    if (!points[i+1]) break;
    line = new fabric.Line([points[i].x, points[i].y, points[i+1].x, points[i+1].y], { stroke: 'blue', selectable: false});
    lines.push(line); canvas.add(line);
  }
}

function initializeFabricCanvas(w, h) {
  var canvas, note;
  if (canvas = document.getElementById('canvas'))
    canvas.parentNode.removeChild(canvas);

  canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  canvas.width = w;
  canvas.height = h;
  DOMEls.canvasWrapper.appendChild(canvas);
  note = document.createElement('p');
  note.id = 'note';
  note.innerHTML = '\
    <div>Please press <b>CTRL + click</b> to create a new point.</div>\
    <div>Please select point and press <b>delete</b> or <b>back</b> key to delete point.</div>';
  DOMEls.canvasWrapper.appendChild(note);
  canvas = new fabric.Canvas('canvas'/*, {selection: false}*/);
  canvas.hoverCursor = 'pointer';
  initializeFabricCanvasEvents(canvas);
  return canvas;
}

function initializeFabricCanvasEvents(canvas) {
  canvas.on('mouse:down', function(object) {
    var pointer, circle, objectId;

    if (!pressedKeys.cntrl) return;

    objectId = ++__objectId
    var pointer = canvas.getPointer(object.e);
    var circle = new fabric.Circle({
      left: pointer.x,
      top: pointer.y,
      radius: parseInt(DOMEls.radiusInput.value),
      fill: 'black',
      selectable: true,
      originX: 'center',
      originY: 'center'
    });
    pointer.objectId = circle.objectId = objectId;
    points.push(pointer); canvas.add(circle);
    renderPathByPoints();
  });

  canvas.on('delete:points', function (e) {
    if (!e.objects.length) return;

    for (var i = 0; i < e.objects.length; i++) {
      for (var j = 0; j < points.length; j++) {
        if (e.objects[i].objectId === points[j].objectId) {
          e.objects[i].remove();
          points.splice(j, 1);
          break;
        }
      }
    }
    renderPathByPoints();
  });

  canvas.on('object:moving', function(object) {
    for (var i = 0; i < points.length; i++) {
      if (points[i].objectId === object.target.objectId) {
        var pointer = canvas.getPointer(object.e);
        points[i].x = pointer.x;
        points[i].y = pointer.y;
      }
    }
    renderPathByPoints();
  });
}

function clear() {
  var note;
  if (!canvas) return;

  if (note = document.getElementById('note'))
    note.parentNode.removeChild(note);

  canvas.wrapperEl.parentNode.removeChild(canvas.wrapperEl);
  points = [];
  __objectId = 0;
  DOMEls.imageInput.value = '';
  var h2 = document.createElement('h2');
  h2.innerText = 'Please select image.';
  h2.id = 'canvas';
  DOMEls.canvasWrapper.appendChild(h2);
  createResult();
  canvas = void 0;
}

function createResult() {
  var coords = [];
  var minx; var miny;

  if (!canvas) return;

  for (var i = 0; i < points.length; i++) {
    if (!minx) minx = points[i].x.toFixed(0)*1;
    if (!miny) miny = points[i].y.toFixed(0)*1;

    coords.push([points[i].x.toFixed(0)*1, points[i].y.toFixed(0)*1]);
    minx = Math.min(minx, points[i].x.toFixed(0)*1);
    miny = Math.min(miny, points[i].y.toFixed(0)*1);
  }
  for (i = 0; i < coords.length; i++) {
    coords[i][0] -= minx; coords[i][1] -= miny;
  }
  if (coords.length) {
    DOMEls.resultBox.value = JSON.stringify(coords);
  } else {
    DOMEls.resultBox.value = 'No result.';
  }
}

DOMEls.imageInput.addEventListener('change', function (e) {
  var reader = new FileReader();
  reader.onload = function (event){
    var imgObj = new Image();
    imgObj.src = event.target.result;
    imgObj.onload = function () {
      var image = new fabric.Image(imgObj);
      image.set({angle: 0, selectable: false, opacity: .7});
      canvas = initializeFabricCanvas(imgObj.width+60, imgObj.height+60);
      canvas.centerObject(image); canvas.add(image); canvas.renderAll();
    }
  }
  reader.readAsDataURL(e.target.files[0]);
  clear();
});

DOMEls.btnGeneratePoligon.addEventListener('click', createResult);
DOMEls.btnClear.addEventListener('click', clear);
DOMEls.radiusInput.addEventListener('input', function (e) {});
deletePointEvent = setInterval(function _deletePointHandle() {
  var objects, activeObject;
  if (!pressedKeys.delete || !canvas) return;

  objects = [];
  if ((activeObject = canvas.getActiveObject()) && activeObject.objectId) {
    objects.push(activeObject);
  } else {
    var canvasObjects = canvas.getObjects();
    for (var i = 0; i < canvasObjects.length; i++)
      if (canvasObjects[i].objectId && canvasObjects[i].active)
        objects.push(canvasObjects[i]);
  }
  canvas.fire('delete:points', { objects: objects });
  clearInterval(deletePointEvent);
  var t = setTimeout(function () {
    deletePointEvent = setInterval(_deletePointHandle, 10);
    clearTimeout(t);
  }, 500);
}, 10);

// add key events
window.addEventListener('keydown', function (e) { if (e.which === 8 || e.which === 46) pressedKeys.delete = true; if (e.which === 17) pressedKeys.cntrl = true });
window.addEventListener('keyup', function (e) { pressedKeys.cntrl = false; pressedKeys.delete = false; });