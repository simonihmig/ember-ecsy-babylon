import { getOwner, setOwner } from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import { capabilities } from '@ember/component';
import DomlessGlimmerComponent, { DESTROYING, DESTROYED } from 'ember-ecsy-babylon/components/domless-glimmer';
import Ember from 'ember';
import { schedule } from '@ember/runloop';
import { destroy } from '@ember/destroyable';

export interface ComponentManagerArgs {
  named: {
    [index: string]: unknown;
  };
  positional: unknown[];
}

export interface Constructor<T> {
  new (owner: unknown, args: {}): T;
}

interface EmberMeta {
  setSourceDestroying(): void;
  setSourceDestroyed(): void;
}

interface DomlessGlimmerStateBucket {
  instance: DomlessGlimmerComponent;
  args: ComponentManagerArgs['named'];
  newArgs?:  ComponentManagerArgs['named'];
}

const CAPABILITIES = capabilities('3.13', {
  destructor: true,
  asyncLifecycleCallbacks: true,
  updateHook: true
});

function snapshot<T>(object: T): T {
  return Object.freeze({...object});
}

export default class DomlessGlimmerComponentManager {
  static create(attrs: unknown): DomlessGlimmerComponentManager {
    const owner = getOwner(attrs);
    return new this(owner);
  }
  capabilities = CAPABILITIES;
  constructor(owner: ApplicationInstance) {
    setOwner(this, owner);
  }

  createComponent(
    ComponentClass: Constructor<DomlessGlimmerComponent>,
    args: ComponentManagerArgs
  ): DomlessGlimmerStateBucket {
    return {
      args: snapshot(args.named),
      instance: new ComponentClass(getOwner(this), args.named),
    };
  }

  updateComponent(bucket: DomlessGlimmerStateBucket, args: ComponentManagerArgs) {
    bucket.newArgs = snapshot(args.named);
  }

  destroyComponent(bucket: DomlessGlimmerStateBucket): void {
    const { instance: component } = bucket;
    if (component.isDestroying) {
      return;
    }

    const meta = Ember.meta(component);

    meta.setSourceDestroying();
    component[DESTROYING] = true;

    schedule('actions', component, component._willDestroy);
    schedule('destroy', this, this.scheduledDestroyComponent, component, meta);
  }

  scheduledDestroyComponent(component: DomlessGlimmerComponent, meta: EmberMeta): void {
    if (component.isDestroyed) {
      return;
    }

    destroy(component);

    meta.setSourceDestroyed();
    component[DESTROYED] = true;
  }

  didCreateComponent(): void {}

  didUpdateComponent(bucket: DomlessGlimmerStateBucket): void {
    const { instance: component, args, newArgs } = bucket;

    if (newArgs === undefined) {
      return;
    }

    const argsDiff = Object.keys(newArgs)
      .filter((key) => newArgs[key] !== args[key])
      .reduce((result, key) => ({...result, [key]: newArgs[key]}), {});

    component.didUpdate(argsDiff);

    bucket.args = newArgs;
  }

  getContext(bucket: DomlessGlimmerStateBucket): DomlessGlimmerComponent {
    return bucket.instance;
  }
}

interface EmberMeta {
  setSourceDestroying(): void;
  setSourceDestroyed(): void;
}

declare module 'ember' {

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Ember {
    function destroy(obj: {}): void;
    function meta(obj: {}): EmberMeta;
  }
}

interface CustomComponentCapabilities {
  asyncLifecycleCallbacks: boolean;
  destructor: boolean;
  updateHook: boolean;
}

declare module '@ember/component' {
  export function capabilities(
    version: '3.13' | '3.4',
    capabilities: Partial<CustomComponentCapabilities>
  ): CustomComponentCapabilities;
}
