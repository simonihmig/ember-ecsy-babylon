import { getOwner, setOwner } from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import { capabilities } from '@ember/component';
import DomlessGlimmerComponent, { DESTROYING, DESTROYED, ARGS_SET } from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer/component';
import Ember from 'ember';
import { schedule } from '@ember/runloop';
import { DEBUG } from '@glimmer/env';



export interface ComponentManagerArgs {
  named: {
    [index: string]: any;
  };
  positional: any[];
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

const CAPABILITIES = capabilities('3.4', {
  destructor: true,
  asyncLifecycleCallbacks: true,
});

function snapshot(object: object): object {
  return Object.freeze({...object});
}

export default class GlimmerComponentManager {
  static create(attrs: any) {
    const owner = getOwner(attrs);
    return new this(owner);
  }
  capabilities: any;
  constructor(owner: ApplicationInstance) {
    setOwner(this, owner);
    this.capabilities = CAPABILITIES;
  }

  createComponent(
    ComponentClass: Constructor<DomlessGlimmerComponent>,
    args: ComponentManagerArgs
  ): DomlessGlimmerStateBucket {
    if (DEBUG) {
      ARGS_SET.add(args.named);
    }

    return {
      args: snapshot(args.named),
      instance: new ComponentClass(getOwner(this), args.named),
    };
  }

  updateComponent(bucket: DomlessGlimmerStateBucket, args: ComponentManagerArgs) {
    bucket.newArgs = snapshot(args.named);
  }

  destroyComponent(bucket: DomlessGlimmerStateBucket) {
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

  scheduledDestroyComponent(component: DomlessGlimmerComponent, meta: EmberMeta) {
    if (component.isDestroyed) {
      return;
    }

    Ember.destroy(component);

    meta.setSourceDestroyed();
    component[DESTROYED] = true;
  }

  didCreateComponent() {}

  didUpdateComponent(bucket: DomlessGlimmerStateBucket) {
    const { instance: component, args, newArgs } = bucket;

    if (newArgs === undefined) {
      throw new Error('Updated DomlessGlimmerComponent arguments are undefined. This should never happen'); // please TS
    }

    const argsDiff = Object.keys(newArgs)
      .filter((key) => newArgs[key] !== args[key])
      .reduce((result, key) => ({...result, [key]: newArgs[key]}), {});

    component.args = newArgs;
    component.didUpdate(argsDiff);

    bucket.args = newArgs;
  }

  getContext(bucket: DomlessGlimmerStateBucket) {
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
