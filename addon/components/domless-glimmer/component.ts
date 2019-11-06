// @ts-ignore
import { setComponentManager } from '@ember/component';
import ApplicationInstance from '@ember/application/instance';
import DomlessGlimmerComponentManager from 'ember-babylon/component-managers/domless-glimmer';
import { setOwner } from '@ember/application';
import { DEBUG } from '@glimmer/env';

const ECSY_DESTROYING = Symbol('ecsy_destroying');
const DESTROYING = Symbol('destroying');
const DESTROYED = Symbol('destroyed');

let ARGS_SET: WeakSet<any>;

if (DEBUG) {
  ARGS_SET = new WeakSet();
}

export { DESTROYING, DESTROYED, ARGS_SET };

export default class DomlessGlimmerComponent<T = object> {
  constructor(owner: unknown, args: T) {
    if (DEBUG && !(owner !== null && typeof owner === 'object' && ARGS_SET.has(args))) {
      throw new Error(
        `You must pass both the owner and args to super() in your component: ${
          this.constructor.name
        }. You can pass them directly, or use ...arguments to pass all arguments through.`
      );
    }

    this.args = args;
    this.children = new Set();
    setOwner(this, owner as any);

    if (this.args.parent) {
      this.args.parent.registerChild(this);
    }
  }

  args: Readonly<T>;
  children: Set<DomlessGlimmerComponent>;

  [ECSY_DESTROYING] = false;
  [DESTROYING] = false;
  [DESTROYED] = false;

  get isDestroying() {
    return this[DESTROYING];
  }

  get isDestroyed() {
    return this[DESTROYED];
  }

  /**
   * Called whenever arguments are updated
   */
  didUpdate() {}

  /**
   * Called before the component has been removed from the DOM.
   */
  willDestroy() {
    Array.from(this.children).reverse().forEach(c => {
      if (!c[ECSY_DESTROYING]) {
        c[ECSY_DESTROYING] = true;
        c.willDestroy();
      }
    });
  }

  /**
   * Called by the component manager when the component will be destroyed.
   * @private
   */
  _willDestroy() {
    if (this.args.parent) {
      this.args.parent.unregisterChild(this);
    }

    if (!this[ECSY_DESTROYING]) {
      this[ECSY_DESTROYING] = true;
      this.willDestroy();
    }
  }

  registerChild(child: DomlessGlimmerComponent) {
    this.children.add(child);
  }

  unregisterChild(child: DomlessGlimmerComponent) {
    this.children.delete(child);
  }
}

setComponentManager((owner: ApplicationInstance) => {
  return new DomlessGlimmerComponentManager(owner);
}, DomlessGlimmerComponent);
