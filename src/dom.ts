import { escapeControlCharacterRegex, escapeControlCharacter } from './utility';

export type CarryOverParams = {
  depth: number;
  isLastSibling: boolean;
};

export type CreateTreeNode = (
  node: Node,
  parent: Node,
  params: CarryOverParams
) => Node;

export type DomTreeOptions = {
  createTreeNode: CreateTreeNode;
};

export const createDetailsTreeNode: CreateTreeNode = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const str = (node.textContent || '').replace(
      escapeControlCharacterRegex,
      escapeControlCharacter
    );

    const text = document.createTextNode(str);
    const span = document.createElement('span');

    span.appendChild(text);

    return span;
  }

  const details = document.createElement('details');
  const summary = document.createElement('summary');

  summary.textContent = node.nodeName;
  details.appendChild(summary);

  return details;
};

export function createListTreeNodeClosure(): CreateTreeNode {
  // let previousDepth = NaN;

  return function createListTreeNode(node, _parent, _params) {
    // const { depth } = params;

    const ul = document.createElement('ul');
    const li = document.createElement('li');

    li.textContent = node.nodeName;
    ul.appendChild(li);

    return ul;
  };
}

export function domTree(
  node: Node,
  options: DomTreeOptions = {
    createTreeNode: createListTreeNodeClosure()
  },
  carryOverParams: CarryOverParams = {
    depth: 0,
    isLastSibling: false
  },
  parent: Node = document.createDocumentFragment()
): Node {
  const { createTreeNode } = options;
  const { depth } = carryOverParams;

  const item = createTreeNode(node, parent, { ...carryOverParams });

  parent.appendChild(item);

  for (let i = 0, len = node.childNodes.length; i < len; i += 1) {
    const childNode = node.childNodes[i];

    if (!childNode) {
      continue;
    }

    domTree(
      childNode,
      options,
      {
        depth: depth + 1,
        isLastSibling: i === len - 1
      },
      item
    );
  }

  return parent;
}
