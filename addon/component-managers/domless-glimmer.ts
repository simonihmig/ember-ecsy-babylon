import { getOwner, setOwner } from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import { capabilities } from '@ember/component';
import DomlessGlimmerComponent from 'ember-ecsy-babylon/components/domless-glimmer';
import { destroy, registerDestructor } from '@ember/destroyable';

// Skipped importing the original types for now, see https://github.com/glimmerjs/glimmer-vm/issues/1294
// import {
//   ComponentCapabilities, ComponentCapabilitiesVersions,
//   ComponentManagerWithAsyncLifeCycleCallbacks,
//   ComponentManagerWithAsyncUpdateHook,
//   ComponentManagerWithDestructors
// } from '@glimmer/interfaces';
interface ComponentCapabilitiesVersions {
  '3.4': {
    asyncLifecycleCallbacks?: boolean;
    destructor?: boolean;
  };

  '3.13': {
    asyncLifecycleCallbacks?: boolean;
    destructor?: boolean;
    updateHook?: boolean;
  };
}

interface ComponentCapabilities {
  asyncLifeCycleCallbacks: boolean;
  destructor: boolean;
  updateHook: boolean;
}

export interface ComponentManagerArgs {
  named: {
    [index: string]: unknown;
  };
  positional: unknown[];
}

export interface Constructor<T> {
  new (owner: unknown, args: {}): T;
}


interface DomlessGlimmerStateBucket {
  instance: DomlessGlimmerComponent;
  previousArgs: ComponentManagerArgs['named'];
}

const CAPABILITIES = capabilities('3.13', {
  destructor: true,
  asyncLifecycleCallbacks: false,
  updateHook: true
});

function snapshot<T>(object: T): T {
  return Object.freeze({...object});
}

export default class DomlessGlimmerComponentManager
  /*implements ComponentManagerWithAsyncLifeCycleCallbacks<DomlessGlimmerStateBucket>, ComponentManagerWithDestructors<DomlessGlimmerStateBucket>, ComponentManagerWithAsyncUpdateHook<DomlessGlimmerStateBucket>*/ {
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
    const instance = new ComponentClass(getOwner(this), args.named);
    registerDestructor(instance, (component) => component._willDestroy());

    return {
      previousArgs: snapshot(args.named),
      instance,
    };
  }

  updateComponent(bucket: DomlessGlimmerStateBucket, args: ComponentManagerArgs) {
    const newArgs = snapshot(args.named);
    const { instance: component, previousArgs } = bucket;

    if (newArgs === undefined) {
      return;
    }

    const argsDiff = Object.keys(newArgs)
      .filter((key) => newArgs[key] !== previousArgs[key])
      .reduce((result, key) => ({...result, [key]: newArgs[key]}), {});

    if (Object.keys(argsDiff).length > 0) {
      component.didUpdate(argsDiff);
    }

    bucket.previousArgs = newArgs;
  }

  destroyComponent(bucket: DomlessGlimmerStateBucket): void {
    const { instance: component } = bucket;
    destroy(component);
  }

  getContext(bucket: DomlessGlimmerStateBucket): DomlessGlimmerComponent {
    return bucket.instance;
  }
}

declare module '@ember/component' {
  export function capabilities(
    version: '3.13' | '3.4',
    capabilities: Partial<ComponentCapabilitiesVersions['3.13']>
  ): ComponentCapabilities;
}
