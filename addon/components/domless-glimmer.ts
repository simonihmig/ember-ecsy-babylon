// @ts-ignore
import { setComponentManager } from '@ember/component';
import ApplicationInstance from '@ember/application/instance';
import DomlessGlimmerComponentManager from 'ember-ecsy-babylon/component-managers/domless-glimmer';
import { setOwner } from '@ember/application';
import { DEBUG } from '@glimmer/env';

const WILL_DESTROY = Symbol('will_destroy');
const DESTROYING = Symbol('destroying');
const DESTROYED = Symbol('destroyed');

export { DESTROYING, DESTROYED };

export interface DomlessGlimmerArgs<C> {
  parent?: DomlessGlimmerComponent<C, DomlessGlimmerArgs<C>>;
}

export default class DomlessGlimmerComponent<C = object, T extends DomlessGlimmerArgs<C> = object> {
  constructor(owner: unknown, args: T) {
    if (DEBUG && !(owner !== null && typeof owner === 'object' && args !== null && typeof args === 'object')) {
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
  children: Set<DomlessGlimmerComponent<C>>;
  _context?: C;

  [WILL_DESTROY] = false;
  [DESTROYING] = false;
  [DESTROYED] = false;

  get isDestroying() {
    return this[DESTROYING];
  }

  get isDestroyed() {
    return this[DESTROYED];
  }

  get context(): C | undefined {
    return this._context !== undefined ? this._context : (this.args.parent && this.args.parent.context);
  }
  set context(context: C | undefined) {
    this._context = context;
  }

  /**
   * Called whenever arguments are updated
   */
  didUpdate(_changedArgs: Partial<T>) {}

  /**
   * Called before the component has been removed from the DOM.
   */
  willDestroy() {
    Array.from(this.children).reverse().forEach(c => {
      if (!c[WILL_DESTROY]) {
        c[WILL_DESTROY] = true;
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

    if (!this[WILL_DESTROY]) {
      this[WILL_DESTROY] = true;
      this.willDestroy();
    }
  }

  registerChild(child: DomlessGlimmerComponent<C>) {
    this.children.add(child);
  }

  unregisterChild(child: DomlessGlimmerComponent<C>) {
    this.children.delete(child);
  }
}

setComponentManager((owner: ApplicationInstance) => {
  return new DomlessGlimmerComponentManager(owner);
}, DomlessGlimmerComponent);
