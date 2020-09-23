import { ComponentConstructor } from 'ecsy';
import { Component as EcsyComponent } from 'ecsy/src/Component';
import { dasherize } from '@ember/string';

interface ComponentImport {
  [index: string]: ComponentConstructor<EcsyComponent<unknown>>;
}

export function mapComponentImports(components: ComponentImport): Map<string, ComponentConstructor<EcsyComponent<unknown>>> {
  return new Map(
    Object.entries(components)
      .filter(([key]) => key !== 'default')
      .filter(([, value]) => value?.isComponent)
      .map(([key, value]) => [dasherize(key).toLowerCase(), value])
  );
}
