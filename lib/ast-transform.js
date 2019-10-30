'use strict';

function pascalCase(string) {
  return string
    .replace(/(\-|\_|\.|\s)+(.)?/g, (_match, _separator, chr) => (chr ? chr.toUpperCase() : ""))
    .replace(/(^|\/)([a-z])/g, (match /*, separator, chr */) => match.toUpperCase());
}

class EcsyModifierTransform {

  transform(ast) {
    let b = this.syntax.builders;

    // in order to debug in https://astexplorer.net/#/gist/85496faa66b4eea93ac890558477b954/c982a29ac733abe24d174815f3d41f925e93866e
    // **** copy from here ****

    let visitor = {
      ElementNode(node) {
        if (node.modifiers.length) {
          let tagParts = node.tag.split(".");
          if (tagParts.length !== 2 || tagParts[1] !== "Entity") {
            return;
          }

          node.selfClosing = false;
          node.blockParams = ["E"];

          let ecsyComponentHelpers = node.modifiers.map(modifier => {
            if (modifier.params.length > 1) {
              throw new Error("Only one positional param is allowed.");
            }

            let hashFromParams = modifier.params.map(param => b.pair("value", param));

            return b.mustache(
              b.path("ecsy/component"),
              [],
              b.hash([
                ...modifier.hash.pairs,
                b.pair("E", b.path("E"), modifier.loc),
                b.pair("name", b.string(pascalCase(modifier.path.original)), modifier.loc),
                ...hashFromParams
              ]),
              false,
              modifier.loc
            );
          });

          node.children = [...node.children, ...ecsyComponentHelpers];
          node.modifiers = [];
        }
      }
    };
    // **** copy to here ****

    this.syntax.traverse(ast, visitor);

    return ast;
  }
}

module.exports = EcsyModifierTransform;
