'use strict';

function pascalCase(string) {
  return string
    .replace(/(-|_|\.|\s)+(.)?/g, (_match, _separator, chr) => (chr ? chr.toUpperCase() : ""))
    .replace(/(^|\/)([a-z])/g, (match /*, separator, chr */) => match.toUpperCase());
}

class EcsyModifierTransform {

  transform(ast) {
    const b = this.syntax.builders;

    // in order to debug in https://astexplorer.net/#/gist/85496faa66b4eea93ac890558477b954/c982a29ac733abe24d174815f3d41f925e93866e
    // **** copy from here ****
    function getValidAttr(k, v) {
      let value;

      switch (v.type) {
        case "SubExpression":
          value = b.mustache(v.path, v.params, v.hash);
          break;
        case "StringLiteral":
          value = v;
          break;
        default:
          value = b.mustache(v);
          break;
      }

      return b.attr(`@${k}`, value);
    }

    // TODO: somehow get the name of the block param that is used in the root component
    const visitor = {
      ElementNode(node) {
        const tagParts = node.tag.split(".");

        if (tagParts.length === 2 || ['Entity', 'LoadGltf', 'LoadGltfs'].includes(tagParts[1])) {
          node.selfClosing = false;
          node.blockParams = [...node.blockParams, "World"];
          node.attributes = [
            ...node.attributes,
            b.attr("@w", b.mustache("World")),
            b.attr("@parent", b.mustache("World.private.componentReference"))
          ];
        }

        if (tagParts.length !== 2 || tagParts[1] !== "Entity") {
          return;
        }

        const ecsyComponentHelpers = node.modifiers.map(modifier => {
          if (!modifier.params) {
            throw new Error("no params");
          }

          if (modifier.params.length > 1) {
            throw new Error("Only one positional param is allowed.");
          }

          const hashFromModifiers = modifier.hash.pairs.map(pair => getValidAttr(pair.key, pair.value));
          const hashFromParams = modifier.params.map(param => getValidAttr("value", param));

          return b.element(
            {
              name: "Ecsy::Component",
              selfClosing: true
            },
            [
              ...hashFromModifiers,
              b.attr("@parent", b.mustache("World.private.componentReference"), modifier.loc),
              b.attr("@name", b.text(pascalCase(modifier.path.original)), modifier.loc),
              ...hashFromParams
            ]
          );
        });

        node.children = [...node.children, ...ecsyComponentHelpers];
        node.modifiers = [];
      }
    };
    // **** copy to here ****

    this.syntax.traverse(ast, visitor);

    return ast;
  }
}

module.exports = EcsyModifierTransform;
