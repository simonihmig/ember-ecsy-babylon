import DomlessGlimmerComponent, { DomlessGlimmerArgs } from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';
import '@babylonjs/loaders/glTF';
import { Entity } from 'ecsy';

interface EcsyBabylonLoadGltfArgs extends DomlessGlimmerArgs {
  e: Entity; // core entity instance
  fileUrl: string;
}

export default class EcsyBabylonLoadGltf extends DomlessGlimmerComponent<EcsyBabylonLoadGltfArgs> {

}
