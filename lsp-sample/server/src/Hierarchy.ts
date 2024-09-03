import * as lsp from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import { connection, documents } from './server';
import { publicDecrypt } from 'crypto';



export function getPackageFromUri(uri: string): string  {
    
    const decodedUri = decodeURI(uri);
    
    const parts = decodedUri.split('/');

    return  parts[parts.length - 2] ;
}


  
  export function areInTheSamePackage(uri1: TextDocument, uri2: TextDocument): boolean {
	const package1 = getPackageFromUri(uri1.uri);
	const package2 = getPackageFromUri(uri2.uri);

	const returnBoolean = package1 !== null && package2 !== null && package1 === package2;
	return returnBoolean;
  }

  export function isFunctionInPrivateScope(text: string, functionStartIndex: number, matcher: string): boolean {
    const textBeforeFunction = text.substring(0, functionStartIndex);
    const privateScopeRegex = /^private:\s*(\s{4,}fun\s+\w+\([^)]*\)\s*\{[^}]*\}\s*\n)+/gm;

    let match;

    // Procházení všech shod v textu
    while ((match = privateScopeRegex.exec(text)) !== null) {
        const pico = match[0];
        const regex = new RegExp(matcher.trim(), 'i');

        if (regex.test(pico)) {
            return true;
        }

    }
    // Pokud nebyla žádná shoda nalezena nebo se matcher neshoduje, kontrolujeme text před funkcí
    return false;
}


  
 export function isFunctionInPublicScope(text: string, functionStartIndex: number, matcher : string): boolean {
	const textBeforeFunction = text.substring(0, functionStartIndex);
    const privateScopeRegex = /^public:\s*(\s{4,}fun\s+\w+\([^)]*\)\s*\{[^}]*\}\s*\n)+/gm;

    let match;

    // Procházení všech shod v textu
    while ((match = privateScopeRegex.exec(text)) !== null) {
        const pico = match[0];
        const regex = new RegExp(matcher.trim(), 'i');

        if (regex.test(pico)) {
            return true;
        }
    }

    return false;
}

export function isVariableInPublicScope(text: string, functionStartIndex: number, matcher : string): boolean {
	const textBeforeFunction = text.substring(0, functionStartIndex);
    const privateScopeRegex = /^public:\s*\n(\s*(var|const)\s+(\w)+;\s*)+/gm;

    let match;

    // Procházení všech shod v textu
    while ((match = privateScopeRegex.exec(text)) !== null) {
        const pico = match[0];
        const regex = new RegExp(matcher.trim(), 'i');

        if (regex.test(pico)) {
            return true;
        }
    }

    return false;
}

export function isVariableInPrivateScope(text: string, functionStartIndex: number, matcher : string): boolean {
	const textBeforeFunction = text.substring(0, functionStartIndex);
    const privateScopeRegex = /^private:\s*\n(\s*(var|const)\s+(\w)+;\s*)+/gm;

    let match;

    // Procházení všech shod v textu
    while ((match = privateScopeRegex.exec(text)) !== null) {
        const pico = match[0];
        const regex = new RegExp(matcher.trim(), 'i');

        if (regex.test(pico)) {
            return true;
        }
    }

    return false;
}

  export function importGeneration(structureName : string, textDocument : TextDocument) {
	
  }

  export function isVariableInFunctionScope() {
	const functionScopeRegex = /fun\s+\w+\([^)]+\)\s*\{([^}]+)\}/gm;
  }