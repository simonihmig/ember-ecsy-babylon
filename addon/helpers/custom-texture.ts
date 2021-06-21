import Helper from '@ember/component/helper';
import { BaseTexture } from '@babylonjs/core/Materials/Textures/baseTexture';

interface TextureConstructor<T> {
  new (...args: unknown[]): T;
}

export default class CustomTextureHelper<T extends BaseTexture> extends Helper {
  texture?: T;

  compute([ clazz, ...args ]: [TextureConstructor<T>, ConstructorParameters<TextureConstructor<T>>], textureOptions: Partial<T>): T {
    if (this.texture) {
      this.texture.dispose();
    }

    this.texture = new clazz(...args);

    Object.assign(this.texture, textureOptions);
    return this.texture;
  }

  willDestroy(): void {
    if (this.texture) {
      this.texture.dispose();
    }

    super.willDestroy();
  }
}
