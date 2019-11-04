import { getOwner, setOwner } from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import { capabilities } from '@ember/component';
import DomlessGlimmerComponent, { DESTROYING, DESTROYED, ARGS_SET } from 'ember-babylon/components/domless-glimmer/component';
import Ember from 'ember';
import { schedule } from '@ember/runloop';
import { DEBUG } from '@glimmer/env';

export interface ComponentManagerArgs {
  named: object;
  positional: any[];
}

export interface Constructor<T> {
  new (owner: unknown, args: {}): T;
}

interface EmberMeta {
  setSourceDestroying(): void;
  setSourceDestroyed(): void;
}

const CAPABILITIES = capabilities('3.4', {
  destructor: true,
  asyncLifecycleCallbacks: true,
});

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
  ): DomlessGlimmerComponent {
    if (DEBUG) {
      ARGS_SET.add(args.named);
    }

    return new ComponentClass(getOwner(this), args.named);
  }

  updateComponent(component: DomlessGlimmerComponent, args: ComponentManagerArgs) {
    component.args = args.named;
  }

  destroyComponent(component: DomlessGlimmerComponent) {
    if (component.isDestroying) {
      return;
    }

    const meta = Ember.meta(component);

    meta.setSourceDestroying();
    component[DESTROYING] = true;

    schedule('actions', component, component.willDestroy);
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

  didUpdateComponent(component: DomlessGlimmerComponent) {
    component.didUpdate();
  }

  getContext(component: DomlessGlimmerComponent) {
    return component;
  }
}
