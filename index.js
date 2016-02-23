
// ---- Utilities ----

function N(i, s) {
    return Array(i + 1).join(s);
}

function selfClosing(tokens, idx) {
    var token = tokens[idx];
    return [token.markup, token.content, token.markup].join('');
}

function inlineOpen(tokens, idx) {
    var token = tokens[idx];
    return token.markup + token.content;
}

function inlineClose(tokens, idx) {
    var token = tokens[idx];
    return token.markup;
}

// Render a block
function block(s) {
    return s + '\n\n';
}


// ----- List utilities

function listOpen(tokens, idx, options, env, slf) {
    slf._listNested = (slf._listNested || 0) + 1;
    return '';
}

function listClose(tokens, idx, options, env, slf) {
    slf._listNested = slf._listNested - 1;
    return '';
}

// ----- Table utilities

function tableColumnDelimiter(tokens, idx, options, env, slf) {
    var token = tokens[idx];
    if (token.type == 'th_open') {
        var attrIndex = token.attrIndex('style');
        var style = attrIndex >= 0? token.attrs[attrIndex][1] : '';

        slf._tableColumnStyles.push(style == 'text-align:right'? ':' : ' ')
    }


    slf._tableColumn += 1;
    return slf._tableColumn == 1? '| ' : ' | ';
}


module.exports = {
    // ----- Code blocks
    code_inline: selfClosing,
    code_block: selfClosing,

    // For markdown-it, fence are always blocks
    fence: function(tokens, idx, options, env, slf) {
        var token = tokens[idx];
        var lang = token.info;

        return block('```' + lang + '\n' + token.content + '```');
    },


    // ----- Paragraph / Blocks

    paragraph_open: function() {
        return '';
    },
    paragraph_close: function(tokens, idx, options, env, slf) {
        var token = tokens[idx];
        return token.level > 0? '\n' : block('');
    },

    hr: function(tokens, idx, options, env, slf) {
        var token = tokens[idx];
        return block(token.markup);
    },

    // ----- Links / Images

    link_open: function(tokens, idx, options, env, slf) {
        var token = tokens[idx];

        var href = token.attrs[token.attrIndex('href')][1];

        this._links = this._links || [];
        this._links.push(href);

        return '[';
    },

    link_close: function(tokens, idx, options, env, slf) {
        var token = tokens[idx];

        this._links = this._links || [];
        var href = this._links.pop(href);

        return '](' + href + ')';
    },

    image: function(tokens, idx, options, env, slf) {
        var token = tokens[idx];

        var src = token.attrs[token.attrIndex('src')][1]
        var alt = slf.renderInlineAsText(token.children, options, env);

        return '![' + alt + '](' + src + ')';
    },

    // ----- Inline

    strong_open: inlineOpen,
    strong_close: inlineClose,

    em_open: inlineOpen,
    em_close: inlineClose,

    s_open: inlineOpen,
    s_close: inlineOpen,

    // ------ Headings

    heading_open: function(tokens, idx, options, env, slf) {
        var token = tokens[idx];
        return token.markup + ' ';
    },
    heading_close: function() {
        return block('');
    },

    blockquote_open: function(tokens, idx, options, env, slf) {
        var token = tokens[idx];

        slf._blockquoteNested = (slf._blockquoteNested || 0) + 1;
        return N(slf._blockquoteNested, token.markup) + ' ';
    },
    blockquote_close: function(tokens, idx, options, env, slf) {
        slf._blockquoteNested = slf._blockquoteNested - 1;
        return '';
    },


    // ------ Lists

    bullet_list_open: listOpen,
    bullet_list_close: listClose,

    ordered_list_open: listOpen,
    ordered_list_close: listClose,

    list_item_open: function(tokens, idx, options, env, slf) {
        var token = tokens[idx];
        var markup = token.markup;
        if (markup == '.') markup = '1'+markup;

        return N((slf._listNested - 1) * 4, ' ') + markup + ' ';
    },
    list_item_close: function() {
        return '';
    },


    // ------- Tables

    table_open: function() {
        return '';
    },
    table_close: function() {
        return '';
    },

    thead_open: function(tokens, idx, options, env, slf) {
        slf._tableColumnStyles = [];
        return '';
    },
    thead_close: function(tokens, idx, options, env, slf) {
        var s = '';

        for (var i = 0; i < slf._tableLastRowColumns; i++) {
            s += '| -----'+slf._tableColumnStyles[i];
        }
        s += '|\n';

        return s;
    },

    tbody_open: function() {
        return '';
    },
    tbody_close: function() {
        return '';
    },

    tr_open: function(tokens, idx, options, env, slf) {
        slf._tableColumn = 0;
        return '';
    },
    tr_close: function(tokens, idx, options, env, slf) {
        slf._tableLastRowColumns = slf._tableColumn;
        return ' |\n';
    },

    th_open: tableColumnDelimiter,
    th_close: function() {
        return '';
    },

    td_open: tableColumnDelimiter,
    td_close: function() {
        return '';
    },
};

