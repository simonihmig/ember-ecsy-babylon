import { Entity, System } from 'ecsy';
import EntityComponent from 'ember-babylon/ecsy/components/entity';
import { Position, Rotation, TransformNode } from '../components';
import { TransformNode as BabylonTransformNode } from '@babylonjs/core';
import { guidFor } from '@ember/object/internals';

export default class TransformSystem extends System {
  execute() {
    this.queries.entity.added.forEach((e: Entity) => this.setup(e));

    this.queries.position.added.forEach((e: Entity) => this.position(e));
    this.queries.position.changed.forEach((e: Entity) => this.position(e));
    this.queries.rotation.added.forEach((e: Entity) => this.rotation(e));
    this.queries.rotation.changed.forEach((e: Entity) => this.rotation(e));
    // TODO: implement removed for the above

    this.queries.entity.removed.forEach((e: Entity) => this.remove(e));
  }

  setup (entity: Entity) {
    const entityComponent = entity.getComponent(EntityComponent);
    const parentEntity = entityComponent.parent;
    const transformNode = new BabylonTransformNode(`${guidFor(entity)}__TransformNode`);

    if (parentEntity) {
      const parentTransformNode = parentEntity.getComponent(TransformNode);

      if (!parentTransformNode.value) {
        throw new Error('Parent Entity does not have a valid TransformNode');
      }

      transformNode.parent = parentTransformNode.value;
    }

    entity.addComponent(TransformNode, { value: transformNode });
  }

  remove (entity: Entity) {
    const transformNodeComponent = entity.getComponent(TransformNode);

    if (!transformNodeComponent.value) {
      throw new Error('TransformNode Component does not have a valid TransformNode instance.');
    }

    transformNodeComponent.value.dispose();
    entity.removeComponent(TransformNode);
  }

  getTransformNode (entity: Entity) {
    const transformNodeComponent = entity.getComponent(TransformNode);

    if(!transformNodeComponent.value){
      throw new Error('No valid Mesh found on this entity.');
    }

    return transformNodeComponent.value;
  }

  position (entity: Entity) {
    const tn = this.getTransformNode(entity);
    const positionComponent = entity.getComponent(Position);
    tn.position = positionComponent.value;
  }

  rotation (entity: Entity) {
    const tn = this.getTransformNode(entity);
    const rotationComponent = entity.getComponent(Rotation);

    let {
      x,
      y,
      z
    } = rotationComponent.value;

    x = x * Math.PI / 180;
    y = y * Math.PI / 180;
    z = z * Math.PI / 180;

    Object.assign(tn.rotation, { x, y, z});
  }
}

TransformSystem.queries = {
  entity: {
    components: [EntityComponent],
    listen: {
      added: true,
      removed: true
    }
  },
  position: {
    components: [TransformNode, Position],
    listen: {
      added: true,
      changed: true,
      removed: true
    }
  },
  rotation: {
    components: [TransformNode, Rotation],
    listen: {
      added: true,
      changed: true,
      removed: true
    }
  }
};
