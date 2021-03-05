import 'ember-concurrency-async';
import 'ember-concurrency-ts/async';

// Types for compiled templates
declare module 'ember-ecsy-babylon/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
