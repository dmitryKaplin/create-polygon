/**
 * Easy creation of the polygons.
 *
 * @package create-polygon
 * @author Dmitry Kaplin <dmitry.kaplin@bigdropinc.com>
 */
import eventEmitter from "../events/emitter";

class ControlKey
{
  constructor()
  {
    this.keys = {
      cntrl: false,
      delete: false,
      back: false,
      up: false,
      down: false,
      left: false,
      right: false
    };

    window.addEventListener('keydown', (e) => {
      let keyCode = e.which;

      switch (keyCode) {
        case 8:
          this.keys.back = true;
          break;
        case 17:
          this.keys.cntrl = true;
          break;
        case 37:
          this.keys.left = true;
          break;
        case 38:
          this.keys.up = true;
          break;
        case 39:
          this.keys.right = true;
          break;
        case 40:
          this.keys.down = true;
          break;
        case 46:
          this.keys.delete = true;
          break;
      }

      for (let key in this.keys)
        if (this.keys[key])
          eventEmitter.emit('press-' + key);
    });

    window.addEventListener('keyup', () => {
      for (let key in this.keys)
        this.keys[key] = false;
    });
  }
}

let controlKey = new ControlKey();
export default controlKey;