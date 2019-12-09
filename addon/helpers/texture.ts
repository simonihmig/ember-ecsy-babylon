import Helper from '@ember/component/helper';
import {Scene, Texture, ThinEngine} from '@babylonjs/core';
import { Nullable } from "@babylonjs/core/types";

type TextureParams = [
  Nullable<string>,
  Nullable<Scene | ThinEngine>,
  boolean,
  boolean,
  number,
  Nullable<() => void>,
  Nullable<() => void>,
  Nullable<string | ArrayBuffer | ArrayBufferView | HTMLImageElement | Blob | ImageBitmap>,
  boolean,
  number,
  string
];

export default class TextureHelper extends Helper {
  texture?: Texture;

  compute([url, sceneOrEngine, noMipmap, invertY, samplingMode, onLoad, deleteBuffer, format, mimeType]: TextureParams, textureOptions: Partial<Texture>) {
    if (this.texture) {
      this.texture.dispose();
    }

    this.texture = new Texture(url, sceneOrEngine, noMipmap, invertY, samplingMode, onLoad, deleteBuffer, format, mimeType);

    Object.assign(this.texture, textureOptions);
    return this.texture;
  }

  willDestroy() {
    if (this.texture) {
      this.texture.dispose();
      this.texture = undefined;
    }

    super.willDestroy();
  }
}
