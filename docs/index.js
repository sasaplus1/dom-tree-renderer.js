(function(){
  'use strict';

  var domTreeRenderer = window.domTreeRenderer;

  //----------------------------------------------------------------------------

  var textInput = document.getElementById('js-text-input');
  var textOutput = document.getElementById('js-text-output');
  var textShape = document.getElementById('js-text-shape');

  textInput.value = document.documentElement.outerHTML;

  updateTextTree();

  function updateTextTree() {
    var domParser = new DOMParser();
    var dom = domParser.parseFromString(textInput.value, 'text/html');

    var options = Object.assign({}, domTreeRenderer.defaultOptions, {
      shapes: textShape.value === 'unicode' ? domTreeRenderer.unicodeShapes : domTreeRenderer.asciiShapes
    });

    var tree = domTreeRenderer.textTree(dom.documentElement, options).join('\n')

    textOutput.textContent = '';
    textOutput.append(tree);
  }

  textInput.addEventListener('input', updateTextTree, false);
  textShape.addEventListener('change', updateTextTree, false)
}());
