import { Entity } from 'ecsy';
import { Action, BabylonCore, Mesh } from '../components';
import { ActionManager, ExecuteCodeAction } from '@babylonjs/core';
import SystemWithCore from '@kaliber5/ember-ecsy-babylon/ecsy-babylon/SystemWithCore';

const TRIGGER = {
  pick: ActionManager.OnPickTrigger,
  doublePick: ActionManager.OnDoublePickTrigger,
  centerPick: ActionManager.OnCenterPickTrigger,
  everyFrame: ActionManager.OnEveryFrameTrigger,
  intersectionEnter: ActionManager.OnIntersectionEnterTrigger,
  intersectionExit: ActionManager.OnIntersectionExitTrigger,
  keyDown: ActionManager.OnKeyDownTrigger,
  keyUp: ActionManager.OnKeyUpTrigger,
  leftPick: ActionManager.OnLeftPickTrigger,
  longPress: ActionManager.OnLongPressTrigger,
  pickDown: ActionManager.OnPickDownTrigger,
  pickOut: ActionManager.OnPickOutTrigger,
  pickUp: ActionManager.OnPickUpTrigger,
  pointerOut: ActionManager.OnPointerOutTrigger,
  pointerOver: ActionManager.OnPointerOverTrigger,
  rightPick: ActionManager.OnRightPickTrigger,
};

export default class ActionSystem extends SystemWithCore {
  execute() {
    super.execute();

    this.queries.action.added.forEach((e: Entity) => this.setup(e));
    this.queries.action.removed.forEach((e: Entity) => this.remove(e));

    super.afterExecute();
  }

  setup(entity: Entity) {
    const action = entity.getMutableComponent(Action);

    const meshComponent = entity.getComponent(Mesh);
    if (!meshComponent || !meshComponent.instance) {
      throw new Error('Action component can only be applied to Entities with a mesh');
    }

    const mesh = meshComponent.instance;
    mesh.actionManager = mesh.actionManager || new ActionManager(this.core.scene);

    Object.keys(TRIGGER).forEach((triggerName) => {
      // @todo handle updates properly, i.e. not registering actions twice, unregistering actions
      const fn = action[triggerName];
      if (!fn) {
        return;
      }
      const trigger = TRIGGER[triggerName];
      mesh.actionManager!.registerAction(
        new ExecuteCodeAction(
          trigger,
          () => {
            fn()
          }
        )
      );
    });
  }

  remove(entity: Entity) {
    const meshComponent = entity.getComponent(Mesh);
    if (meshComponent && meshComponent.instance && meshComponent.instance.actionManager) {
      meshComponent.instance.actionManager.dispose();
      meshComponent.instance.actionManager = null;
    }
  }
}

ActionSystem.queries = {
  core: {
    components: [BabylonCore],
    listen: {
      added: true,
      removed: true
    }
  },
  action: {
    components: [Action, Mesh],
    listen: {
      added: true,
      removed: true
    }
  }
};
