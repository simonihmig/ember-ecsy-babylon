import Helper from '@ember/component/helper';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';

export default class TextureHelper extends Helper {
  texture?: Texture;

  compute(args: ConstructorParameters<typeof Texture>, textureOptions: Partial<Texture>) {
    if (this.texture) {
      this.texture.dispose();
    }

    this.texture = new Texture(...args);

    Object.assign(this.texture, textureOptions);
    return this.texture;
  }

  willDestroy() {
    if (this.texture) {
      this.texture.dispose();
    }

    super.willDestroy();
  }
}
