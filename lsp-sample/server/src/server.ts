/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	Range,
	WorkspaceChange,
	Position,
	Location,
	LocationLink,
	DeclarationParams,
	Declaration,
	WorkspaceSymbolParams,
	SymbolInformation,
	SymbolKind,
    InsertTextFormat,
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	DocumentDiagnosticReportKind,
	type DocumentDiagnosticReport,
	TextDocumentContentChangeEvent
} from 'vscode-languageserver/node.js';
import { allTokens } from './chervotain lexer.js';


import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import * as packages from './Hierarchy.js';

import * as chevrotain from 'chevrotain';
import MyParser from './chevrotain parser.js';
import { loadavg } from 'os';
import { json } from 'stream/consumers';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
 const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
export { connection, documents };
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true
			},
			diagnosticProvider: {
				interFileDependencies: false,
				workspaceDiagnostics: false
			}
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// The example settings
interface ExampleSettings {
	maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}
	// Refresh the diagnostics since the `maxNumberOfProblems` could have changed.
	// We could optimize things here and re-fetch the setting first can compare it
	// to the existing setting, but this is out of scope for this example.
	connection.languages.diagnostics.refresh();
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'languageServerExample'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});




connection.languages.diagnostics.on(async (params) => {
	const document = documents.get(params.textDocument.uri);
	if (document !== undefined) {
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: await validateTextDocument(document)
		} satisfies DocumentDiagnosticReport;
	} else {
		// We don't know the document. We can either try to read it from disk
		// or we don't report problems for it.
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: []
		
		} satisfies DocumentDiagnosticReport;
	}
});

const inputText = `

// prdelka

fun kakani() {}

class prdelnicka {

    class praseeee {}
    var analnikac : prdl;

	public:
	var prdelnka : ro;

	private:
	fun anal(param : ina) {
	}
	fun prdelnicka() {
		var analnica = "20";
	}
	protected:
	fun prdel(prase : prdel) {
	}
}
`;
let visitResult: any;

connection.onDeclaration((params: DeclarationParams) => {
    return null;
});

let parserResult : chevrotain.CstNode;

documents.onDidChangeContent(change => {
	const lexer = new chevrotain.Lexer(allTokens);

// Představme si, že máte vstupní řetězec, který chcete analyzovat


// Spustíme lexer pro získání tokenů z textu
const tokens = lexer.tokenize(inputText);

// Zkontrolujeme, zda lexer nevygeneroval chyby
if ( tokens.errors.length > 0) {
    console.error("Lexer errors detected",  tokens.errors);
} else {
     const parserInstance = new MyParser();
    
    parserInstance.input =  tokens.tokens;
    const parseResult = parserInstance.file(); 

    if (parserInstance.errors.length > 0) {
        console.error("Parser errors detected", parserInstance.errors);
    } else {
        parserResult = parseResult;

        class CahaVisitor extends parserInstance.getBaseCstVisitorConstructor() {

            currentModifier: null = null;  // Globální proměnná pro sledování modifikátoru
        
            constructor() {
                super();
                this.validateVisitor();
            }
        
            file(ctx: any) {
                const classDeclarations = ctx.classDeclaration ? ctx.classDeclaration.map((classNode: chevrotain.CstNode) => this.visit(classNode)) : [];
                const functionDeclarations = ctx.functionDeclaration ? ctx.functionDeclaration.map((funcNode: chevrotain.CstNode) => this.visit(funcNode)) : [];
                const variableDeclarations = ctx.variableDeclaration ? ctx.variableDeclaration.map((varNode: chevrotain.CstNode) => this.visit(varNode)) : [];
              
                return [...classDeclarations, ...functionDeclarations, ...variableDeclarations];
            }
        
            classBody(ctx: any) {
                // Kromě modifikátorů zahrnujeme deklarace tříd, funkcí a proměnných do jednotlivých polí
                const classDeclarations = ctx.classDeclaration ? ctx.classDeclaration.map((node: any) => this.visit(node)) : [];
                const functionDeclarations = ctx.functionDeclaration ? ctx.functionDeclaration.map((node: any) => this.visit(node)) : [];
                const variableDeclarations = ctx.variableDeclaration ? ctx.variableDeclaration.map((node: any) => this.visit(node)) : [];
                const accessBlockDeclarations = ctx.accessBlock ? ctx.accessBlock.map((node: any) => this.visit(node)) : [];
                return {
                    classes: classDeclarations,
                    functions: functionDeclarations,
                    variables: variableDeclarations,
                    accessBlocks: accessBlockDeclarations
                };
            }
        
            classDeclaration(ctx: any) {
                const className = ctx.Identifier ? ctx.Identifier[0].image : null;
                const classBody = this.visit(ctx.classBody);  // Tělo třídy bude nyní vráceno jako strukturovaný objekt
                
                return {
                    type: 'ClassDeclaration',
                    name: className,
                    variables: classBody.variables,  // Proměnné
                    functions: classBody.functions,  // Funkce
                    classes: classBody.classes,      // Podřízené třídy
                    modifier: this.currentModifier,
                    accessBlocks: classBody.accessBlocks
                };
            }
        
            accessBlock(ctx: any) {
                const previousModifier = this.currentModifier;  // Uložíme předchozí modifikátor
                
                const modifier = ctx.accessModifier ? this.visit(ctx.accessModifier) : 'public';  // Získáme modifikátor nebo nastavíme defaultní 'public'
                this.currentModifier = modifier;  // Nastavíme aktuální modifikátor
                
                const blockBody = ctx.accessBlockBody ? ctx.accessBlockBody.map((bodyNode: chevrotain.CstNode) => this.visit(bodyNode)) : [];
        
                this.currentModifier = previousModifier;  // Obnovíme předchozí modifikátor
                
                return { type: 'AccessBlock', modifier, body: blockBody,  variables: blockBody.variables,  // Proměnné
                    functions: blockBody.functions,  // Funkce
                    classes: blockBody.classes,   };
            }
             
            accessBlockBody(ctx: any) {
                const classDeclarations = ctx.classDeclaration ? ctx.classDeclaration.map((node: any) => this.visit(node)) : [];
                const functionDeclarations = ctx.functionDeclaration ? ctx.functionDeclaration.map((node: any) => this.visit(node)) : [];
                const variableDeclarations = ctx.variableDeclaration ? ctx.variableDeclaration.map((node: any) => this.visit(node)) : [];
        
                return {
                    classes: classDeclarations,
                    functions: functionDeclarations,
                    variables: variableDeclarations,
                };
            }
        
            accessModifier(ctx: any) {
                if (ctx.PublicKeyword) return "public";
                if (ctx.PrivateKeyword) return "private";
                if (ctx.ProtectedKeyword) return "protected";
            }
        
            functionDeclaration(ctx: any) {
                const functionName = ctx.Identifier[0].image;
                const params = this.visit(ctx.parameterList);
                const functionBody = ctx.accessBlockBody ? ctx.accessBlockBody.map((bodyNode: chevrotain.CstNode) => this.visit(bodyNode)) : [];
                return {
                    type: 'FunctionDeclaration',
                    name: functionName,
                    parameters: params,
                    body: functionBody,
                    modifier: this.currentModifier,
                };
            }
        
            parameterList(ctx: any) {
                return ctx.parameter ? ctx.parameter.map((paramNode: chevrotain.CstNode) => this.visit(paramNode)) : [];
            }
        
            parameter(ctx: any) {
                const paramName = ctx.Identifier[0].image;
                const paramType = ctx.Identifier[1].image;
                return { name: paramName, type: paramType };
            }
        
            variableDeclaration(ctx: any) {
                const varName = ctx.Identifier[0].image;
                const varType = ctx.type ? this.visit(ctx.type) : null;
                const varValue = ctx.expression ? this.visit(ctx.expression) : null;
                return {
                    type: 'VariableDeclaration',
                    name: varName,
                    varType,
                    value: varValue,
                    modifier: this.currentModifier,
                };
            }
        
            type(ctx: any) {
                if (ctx.IntKeyword) return "int";
                if (ctx.StringKeyword) return "string";
                if (ctx.Identifier) {
                    const baseType = ctx.Identifier[0].image;
                    const unionType = ctx.type ? this.visit(ctx.type) : null;
                    return unionType ? `${baseType} | ${unionType}` : baseType;
                }
            }
        
            expression(ctx: any) {
                if (ctx.NumberLiteral) return ctx.NumberLiteral[0].image;
                if (ctx.Identifier) return ctx.Identifier[0].image;
                if (ctx.String) return ctx.String[0].image;
            }
        }
        
        
    const visitor  = new CahaVisitor();
    visitResult = visitor.visit(parseResult);
        
        console.log("Parse successful:", parseResult.children);
    
        console.log("Visit Successful" + JSON.stringify(visitResult, null, 2));

 
    
    }
}
	validateTextDocument(change.document);

});


async function validateTextDocument(textDocument: TextDocument): Promise<Diagnostic[]> {



	packages.areInTheSamePackage(textDocument, textDocument) ;

	

    const settings = await getDocumentSettings(textDocument.uri);
    const text = textDocument.getText();
    const diagnostics: Diagnostic[] = [];

    const semicolonPattern = /CahaJeNej/g;
    const methodPattern = /fun\s+(\w+)\s*\([\w\s,:]*\)\s*:\s*(\w+)\s*\{/g;


    const bracketPatterns = [
        { type: '()', pattern: /[()]/g },
        { type: '[]', pattern: /[[]]/g },
        { type: '{}', pattern: /[{}]/g }
    ];

    
    validatePattern(semicolonPattern, 'dobrá zmínka o cahovi', DiagnosticSeverity.Error);

    // 2. Kontrola neuzavřených závorek s ignorováním závorek ve stringu
    bracketPatterns.forEach(({ type, pattern }) => checkUnclosedBrackets(type, pattern));

    // 3. Kontrola metod s návratovým typem (ne void), jestli obsahují return
    checkMissingReturnInMethods();

    return diagnostics;

    function validatePattern(pattern: RegExp, message: string, severity: DiagnosticSeverity) {
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(text)) && diagnostics.length < settings.maxNumberOfProblems) {
            diagnostics.push({
                severity,
                range: {
                    start: textDocument.positionAt(match.index),
                    end: textDocument.positionAt(match.index + match[0].length)
                },
                message: `${message}: ${match[0]}`,
                source: 'ex'
            });
        }
    }

    function checkUnclosedBrackets(type: string, pattern: RegExp) {
        const stack: number[] = [];
        let inString = false;
        let stringChar = ''; 

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            // Detekce začátku a konce stringu
            if ((char === '"' || char === '\'') && !inString) {
                inString = true;
                stringChar = char;
            } else if (char === stringChar && text[i - 1] !== '\\') {
                inString = false;
            }

            if (!inString) {
                if (char === type[0]) {
                    stack.push(i);
                } else if (char === type[1]) {
                    if (stack.length === 0) {
                        addBracketDiagnostic(i, `Missing opening ${type[0]}`);
                    } else {
                        stack.pop();
                    }
                }
            }
        }

        while (stack.length > 0) {
            addBracketDiagnostic(stack.pop()!, `Missing closing ${type[1]}`);
        }
    }



    // Funkce pro kontrolu metod s návratovým typem (ne void) na chybějící return
    function checkMissingReturnInMethods() {
        let match: RegExpExecArray | null;

        while ((match = methodPattern.exec(text)) !== null) {
            const methodName = match[1];
            const returnType = match[2];

            // Pokud návratový typ není void, zkontrolujeme obsah metody na return
            if (returnType !== 'void') {
                const methodBody = extractMethodBody(match.index + match[0].length);

                if (!/return\s+/.test(methodBody)) {
                    diagnostics.push({
                        severity: DiagnosticSeverity.Error,
                        range: {
                            start: textDocument.positionAt(match.index),
                            end: textDocument.positionAt(match.index + match[0].length)
                        },
                        message: `Method '${methodName}' Has defined return type '${returnType}', but return is not present`,
                        source: 'ex'
                    });
                }
            }
        }
    }


	// Example function to index symbols in the document



    // Pomocná funkce pro extrakci těla metody
    function extractMethodBody(startIndex: number): string {
        let depth = 1;
        let body = '';

        for (let i = startIndex; i < text.length; i++) {
            if (text[i] === '{') {
                depth++;
            } else if (text[i] === '}') {
                depth--;
            }

            if (depth === 0) break;
            body += text[i];
        }
		
        return body;
    }

    // Pomocná funkce pro přidání diagnostiky závorek
    function addBracketDiagnostic(index: number, message: string) {
        diagnostics.push({
            severity: DiagnosticSeverity.Error,
            range: {
                start: textDocument.positionAt(index),
                end: textDocument.positionAt(index + 1)
            },
            message,
            source: 'ex'
        });
    }
}


connection.onDidChangeWatchedFiles(_change => {

	connection.console.log('We received a file change event');
});

function getWordAtPosition(document: TextDocument,  line: number, character: number ): string[] {
    const linea = document.getText({ start: { line: line, character: 0 }, end: { line:line, character: document.getText().length } });
    const words = linea.split(/[^\S\n.]/); 
    for (const word of words) {
        const start = linea.indexOf(word);
        const end = start + word.length;
        if (character >= start && character <= end) {
            return word.split(".");
        }
    }
    return [];
}

const keywords = [
	'readonly', 'f64 ', 'f32 ', 'f16 ', 'ui128 ', 'ui64 ', 'ui32 ', 'ui16 ', 'ui8 ', 
	'i128 ', 'i64 ', 'i32 ', 'i16 ', 'i8 ', 'new ', 'class ', 'const ', 'var ', 
	'protected ', 'private ', 'public ', 'for ', 
	'return ', 'break ', 'continue ', 'fun ', 'int ', 
	'string ',  'int32 ', 'enum ', 'case ', 'static', 'import', 'match',
];

connection.onCompletion(
    (_textDocumentPosition: TextDocumentPositionParams, changeEvent): CompletionItem[] => {
        
        connection.console.log(inputText.toString());
    
		const currentDocument = documents.get(_textDocumentPosition.textDocument.uri);
        const definitonOfNodeOnPosition = getWordAtPosition( currentDocument as TextDocument,_textDocumentPosition.position.line, _textDocumentPosition.position.character);
        const isChild = definitonOfNodeOnPosition.length > 1 ? true : false;
        console.log("definitonOf node at position" + definitonOfNodeOnPosition);

        const completionItems: CompletionItem[] = keywords.map((keyword, index) => ({
            label: keyword,
            kind: CompletionItemKind.Keyword,
            data: index + 1
        }));

        const whisperedClasses = visitResult.filter((node: any) => 
            node.type == "ClassDeclaration" 
             );
        

        
        if  (!isChild) {
            const whisperedFunctions = visitResult.filter((node: any) => 
                node.type == "FunctionDeclaration" 
                 );
            const whisperedVariables = visitResult.filter((node: any) => 
                    node.type == "VariableDeclaration" 
                     );
        
        console.log("definitonOfNodeAtPostion:",definitonOfNodeOnPosition);
        
        whisperedClasses.forEach((node: any) => {
           
            completionItems.push({
                label: node.name ,
                kind: CompletionItemKind.Snippet,
                insertText: node.name,
                insertTextFormat: InsertTextFormat.Snippet,
                documentation: ''

            });
        });

        whisperedFunctions.forEach((node: any) => {
           
            completionItems.push({
                label: node.name,
                kind: CompletionItemKind.Snippet,
                insertText: node.name + "()",
                insertTextFormat: InsertTextFormat.Snippet,
                documentation: ''

            });
        });

        whisperedVariables.forEach((node: any) => {
            completionItems.push({
                label: node.name,
                kind: CompletionItemKind.Snippet,
                insertText: node.name,
                insertTextFormat: InsertTextFormat.Snippet,
                documentation: ''

            });
        });

        
        }
        
        else {
            definitonOfNodeOnPosition[-2];
        }
            
    
		documents.all().forEach(textDocument => {
			_textDocumentPosition.position.line;
		
		});
        
        completionItems.push({
            label: 'fori',
            kind: CompletionItemKind.Snippet,
            insertText: 'for (var ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++) {\n\t$0\n}',
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: 'Generates a for loop iteration'
        });

		completionItems.push({
            label: 'while',
            kind: CompletionItemKind.Snippet,
            insertText: 'while (${1}) {\n\t$0\n}',
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: 'Generates a while loop iteration'
        });

		completionItems.push({
            label: 'foreach',
            kind: CompletionItemKind.Snippet,
            insertText: 'for (var ${1} : ) {\n\t$0\n}',
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: 'Generates a foreach loop iteration'
        });

		completionItems.push({
            label: 'switch',
            kind: CompletionItemKind.Snippet,
            insertText: 'switch (${1}) {\n\t$0\n}',
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: 'Generates a foreach loop iteration'
        }, 
		{
		label: 'if',
		kind: CompletionItemKind.Snippet,
		insertText: 'if (${1}) {\n\t$0\n}',
		insertTextFormat: InsertTextFormat.Snippet,
		documentation: 'Generates a if statement iteration'
		},
		
		{
			label: 'else',
			kind: CompletionItemKind.Snippet,
			insertText: 'else  {\n\t${1}\n}',
			insertTextFormat: InsertTextFormat.Snippet,
			documentation: 'Generates a else statement iteration'
			},
			{
				label: 'function',
				kind: CompletionItemKind.Snippet,
				insertText: 'fun ${1}()  {\n\t$0\n}',
				insertTextFormat: InsertTextFormat.Snippet,
				documentation: 'Generates a else statement iteration'
				}
	);
	


        return completionItems;
    }
);


// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
