import * as moo from 'moo';

const lexer = moo.compile({
  whitespace: /[ \t]+/,
  newline: { match: /\n/, lineBreaks: true },
  number: /[0-9]+/,
  identifier: /[a-zA-Z_][a-zA-Z0-9_]*/,
  keyword: ['fun', 'val', 'var', 'if', 'else'],
  operator: /[+\-*/=]/,
  lparen: /\(/,
  rparen: /\)/,
  lbrace: /\{/,
  rbrace: /\}/,
  comma: /,/,
  semicolon: /;/,
});

export { lexer };
