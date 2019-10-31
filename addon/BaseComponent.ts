import Component from '@ember/component';

export default class BaseComponent<T> extends Component {
  // no wrapper by default
  tagName = '';

  // args polyfill
  args!: T;

  init() {
    super.init();

    // @ts-ignore
    // eslint-disable-next-line ember/no-attrs-in-components
    this.set('args', this.getProperties(Object.keys(this.attrs)));
  }

  didUpdateAttrs() {
    super.didUpdateAttrs();

    // @ts-ignore
    // eslint-disable-next-line ember/no-attrs-in-components
    this.set('args', this.getProperties(Object.keys(this.attrs)));
  }
}
