import { Entity, System } from 'ecsy';
import { Mesh, Position, Rotation, Transformable } from '../components';

export default class MeshSystem extends System {
  execute() {
    this.queries.position.added.forEach((e: Entity) => this.position(e));
    this.queries.position.changed.forEach((e: Entity) => this.position(e));
    this.queries.rotation.added.forEach((e: Entity) => this.rotation(e));
    this.queries.rotation.changed.forEach((e: Entity) => this.rotation(e));
  }

  getMesh(entity: Entity) {
    const meshComponent = entity.getComponent(Mesh);

    if(!meshComponent.value){
      throw new Error('No valid Mesh found on this entity.');
    }

    return meshComponent.value;
  }

  position (entity: Entity) {
    const mesh = this.getMesh(entity);
    const positionComponent = entity.getComponent(Position);
    mesh.position = positionComponent.value;
  }

  rotation (entity: Entity) {
    const mesh = this.getMesh(entity);
    const rotationComponent = entity.getComponent(Rotation);

    let {
      x,
      y,
      z
    } = rotationComponent.value;

    x = x * Math.PI / 180;
    y = y * Math.PI / 180;
    z = z * Math.PI / 180;

    Object.assign(mesh.rotation, { x, y, z});
  }
}

MeshSystem.queries = {
  position: {
    components: [Transformable, Position],
    listen: {
      added: true,
      changed: true,
      removed: true
    }
  },
  rotation: {
    components: [Transformable, Rotation],
    listen: {
      added: true,
      changed: true,
      removed: true
    }
  }
};
