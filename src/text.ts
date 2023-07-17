import { escapeControlCharacterRegex, escapeControlCharacter } from './utility';

/** tree shapes */
export type TreeShape = {
  Empty: string;
  I: string;
  L: string;
  T: string;
};

export type RenderNode = (node: Node) => string;

/** treeText() options */
export type TextTreeOptions = {
  renderNode: RenderNode;
  shapes: TreeShape;
};

type CarryOverParams = {
  depth: number;
  isLastSibling: boolean;
  prefix: string;
};

/**
 * default renderNode function
 *
 * @param node - DOM node
 * @returns rendered node text
 */
export const defaultRenderNode: RenderNode = (node) => {
  return node.nodeType === Node.TEXT_NODE
    ? (node.textContent || '').replace(
        escapeControlCharacterRegex,
        escapeControlCharacter
      )
    : node.nodeName.toLowerCase();
};

/** shape texts by ASCII */
export const asciiShapes = {
  Empty: '   ',
  I: '|  ',
  L: '|- ',
  T: '|- '
} as const satisfies TreeShape;

/** shape texts by Unicode */
export const unicodeShapes = {
  Empty: '   ',
  I: '│  ',
  L: '└─ ',
  T: '├─ '
} as const satisfies TreeShape;

/** textTree() default options */
export const defaultOptions: TextTreeOptions = {
  renderNode: defaultRenderNode,
  shapes: { ...asciiShapes }
};

/**
 * render DOM tree to text
 *
 * @param node - DOM node
 * @param options - options
 * @param carryOverParams - carry over params, not for user
 * @param result - result, not for user
 * @returns DOM tree array
 * @example
 * ```js
 * textTree(document.body).join('\n');
 * ```
 * ```js
 * textTree(document.documentElement, {
 *   renderNode(node) {
 *     return `<${node.nodeName.toLowerCase()}>`;
 *   },
 *   shapes: {
 *     Empty: '   ',
 *     I: '|  ',
 *     L: '+─ ',
 *     T: '*- '
 *   }
 * }).join('<br>');
 * ```
 */
export function textTree(
  node: Node,
  options: TextTreeOptions = {
    ...defaultOptions
  },
  carryOverParams: CarryOverParams = {
    depth: 0,
    isLastSibling: false,
    prefix: ''
  },
  result: string[] = []
): string[] {
  const { renderNode, shapes } = options;
  const { Empty: emptyShape, I: iShape, L: lShape, T: tShape } = shapes;

  const { depth, isLastSibling, prefix } = carryOverParams;

  const isRoot = depth === 0;
  const treeText = isRoot ? '' : isLastSibling ? lShape : tShape;

  result.push(prefix + treeText + renderNode(node));

  for (let i = 0, len = node.childNodes.length; i < len; i += 1) {
    const childNode = node.childNodes[i];

    if (!childNode) {
      continue;
    }

    const childTreeText = isRoot ? '' : isLastSibling ? emptyShape : iShape;

    textTree(
      childNode,
      options,
      {
        depth: depth + 1,
        isLastSibling: i === len - 1,
        prefix: prefix + childTreeText
      },
      result
    );
  }

  return result;
}
