var assert = require('assert');
var _ = require('lodash');

var MarkdownIt = require('markdown-it');
var Renderer = require('markdown-it/lib/renderer');

var rules = require('../');

var md = new MarkdownIt();
md.use(require('markdown-it-footnote'));

function renderToMd(src) {
    var tokens = md.parse(src, {});
    var renderer = new Renderer();
    renderer.rules = _.extend(renderer.rules, rules);

    return renderer.render(tokens, md.options, {});
}

function renderToHtml(src) {
    return md.render(src);
}

function assertMd(src, debug) {
    var nsrc = renderToMd(src);
    if (debug) console.log(nsrc);
    assert.equal(
        renderToHtml(nsrc),
        renderToHtml(src),
        'expected '+JSON.stringify(nsrc)+' to equal '+JSON.stringify(src)
    );
}


describe('Renderer', function() {
    it('should render inline code', function() {
        assertMd('this is a ```test```');
    });

    it('should render code blocks', function() {
        assertMd('this is a\n\n```js\ntest\n```\n');
    });

    it('should render bold', function() {
        assertMd('here are some **bold text**');
    });

    it('should render em', function() {
        assertMd('here are some *bold text*');
    });

    it('should render strikethrough', function() {
        assertMd('here are some ~~Strikethrough~~');
    });

    it('should render images', function() {
        assertMd('here are an ![image](test.png)');
    });

    it('should render links', function() {
        assertMd('here are an [image](test.png)');
    });

    it('should render links + images', function() {
        assertMd('here are an [![image](test.png)](test.png)');
    });

    it('should render headings', function() {
        assertMd('# Hello\n## World\n');
    });

    it('should render headings + link', function() {
        assertMd('# Hello [image](test.png)\n## World\n');
    });

    it('should render hr', function() {
        assertMd('Hello\n\n---\n\nWorld\n\n');
    });

    it('should render blockquote', function() {
        assertMd('> Hello World');
    });

    it('should render blockquote + blockquote', function() {
        assertMd('> Hello World\n>> Hello 2\n>>> Hello 3\n');
    });

    it('should render ul', function() {
        assertMd('* hello\n    * World\n* awesome\n');
    });

    it('should render ol', function() {
        assertMd('1. hello\n    1. World\n2. awesome\n');
    });

    it('should render footnotes', function() {
        assertMd('Footnote 1 link[^first].\nCool!');
    });
});
