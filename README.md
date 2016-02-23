# markdown-it-mdrenderer

Render [markdown-it](https://github.com/markdown-it/markdown-it) tokens back to markdown. It can be used for anotating some markdown.

```js
var MarkdownIt = require('markdown-it');
var rules = require('markdown-it-mdrenderer');
var Renderer = require('markdown-it/lib/renderer');

var md = new MarkdownIt();

// Parse markdown
var tokens = md.parse('Some markdown', {});

// Do some annotations on "tokens"

// Render back to markdown
var renderer = new Renderer();
renderer.rules = _.extend(renderer.rules, rules);

var markdown = renderer.render(tokens, md.options, {});
```

