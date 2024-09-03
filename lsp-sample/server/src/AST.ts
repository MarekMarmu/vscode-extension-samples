import * as fs from 'fs';
import * as path from 'path';
import * as nearley from 'nearley';
import { lexer } from './lexer';

// Load the grammar
const grammar = fs.readFileSync(path.resolve(__dirname, 'kotlinGrammar.ne'), 'utf8');

// Compile the grammar
const nearleyc = require('nearley/lib/nearleyc');
const compiledGrammar = nearleyc.compile(grammar, 'kotlinGrammar.ne');

// Save the compiled grammar to a file
fs.writeFileSync(path.resolve(__dirname, 'kotlinGrammar.js'), compiledGrammar);
