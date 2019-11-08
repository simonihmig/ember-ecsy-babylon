// Types for compiled templates
declare module '@kaliber5/ember-ecsy-babylon/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
