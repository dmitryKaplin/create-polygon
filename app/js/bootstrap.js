/**
 * Easy creation of the polygons.
 *
 * @package create-polygon
 * @author Dmitry Kaplin <dmitry.kaplin@bigdropinc.com>
 */
import {fabric as fabric} from "fabric";
import elements from "elements";
import eventEmitter from "events/emitter";
import {
  default as handles,
  eventEmitterHandles
} from "events/handles";

export default class Bootstrap
{
  constructor()
  {
    this.canvas = void 0;
  }

  /**
   * Run application
   *
   * @return {Bootstrap}
   */
  run()
  {
    // disable object controls
    fabric.Object.prototype.setControlsVisibility({mt: false,mb: false,mr: false,ml: false,bl: false,br: false,tl: false,tr : false,mtr: false});

    // bind all events handles
    for (let elId in elements) {
      let elData = elements[elId];
      if (!(elData instanceof HTMLElement) && elData.events !== void 0)
        for (let eventName in elData.events)
          for (let handleIndex = 0; handleIndex < elData.events[eventName].length; handleIndex++)
            if (elData.el instanceof HTMLElement && handles[elData.events[eventName][handleIndex]] !== void 0)
              elData.el.addEventListener(eventName, handles[elData.events[eventName][handleIndex]]);
    }

    for (let eventName in eventEmitterHandles)
      if ('function' === typeof eventEmitterHandles[eventName])
        eventEmitter.on(eventName, eventEmitterHandles[eventName]);

    return this;
  }
}