import { match } from 'assert';
import { Function, FunctionModifiers } from './MyFiles/Function';
import { documents } from './server';
import { getPackageFromUri } from './Hierarchy';

const classPattern = /(public|proctected|static|private|\s)*class\s+\w+\s*:?(\w|\s|,)*\{/g;
const variablePattern = /f/;
const parseFunctionPattern = /(\s|\w)* fun\s+(\w+)\(([^\}])*\)\s*:?\s*(\w*)\s*\{([^])*\}/gm;

const functionPattern = /(?:private|public|protected)?\s*(?:static|const)?\s*fun\s+\w+\s*\([^)]*\)\s*:?\s*\w*\s*\{/g;

interface TempStructData {
    uri: string;
    structHeadAndBody: string;
    className: string | null;
}

export function extractFunctions(code: string, documentURI: string) {
    const functions: TempStructData[] = [];
    let className: string | null = null;
    let openBrackets = 0;

    for (let i = 0; i < code.length; i++) {
        if (code[i] === '{') {
            openBrackets++;
        } else if (code[i] === '}') {
            openBrackets--;
            if (openBrackets === 0) {
                className = null;
            }
        }

        // Hledání třídy
        const classMatch = classPattern.exec(code.slice(i));
        if (classMatch) {
            className = classMatch[0].match(/class\s+(\w+)/)?.[1] ?? null;
            i += classMatch.index + classMatch[0].length;
            openBrackets = 1;
            continue;
        }

        // Hledání funkce
        const functionMatch = functionPattern.exec(code.slice(i));
        if (functionMatch) {
            let start = i + functionMatch.index;
            let functionOpenBrackets = 1;
            let end = start + functionMatch[0].length;

            while (functionOpenBrackets > 0 && end < code.length) {
                if (code[end] === '{') {
                    functionOpenBrackets++;
                } else if (code[end] === '}') {
                    functionOpenBrackets--;
                }
                end++;
            }

            let tempFunData: TempStructData = {
                uri: getPackageFromUri(documentURI),
                structHeadAndBody: code.slice(start, end),
                className: className 
            };

            functions.push(tempFunData);
            i = end; 
        }
    }

    return functions;
}

function parseFunction(givenFunctions: TempStructData): Function {
    let match;

    const functionString = givenFunctions.structHeadAndBody;
    const className = givenFunctions.className;
    const methodPackage = givenFunctions.uri;
    const lines = functionString.split('\n');
    const startLine = 0;
    const endLine = lines.length - 1;
    let parsedFunction: Function | null = null;

    while ((match = parseFunctionPattern.exec(functionString)) !== null) {
        const methodName = match[2];
        const args = match[3].split(',').map(arg => arg.trim());
        const returnType = match[4];
        const body = match[5];

        const modifiers = [];
        if (match[1]) {
            const modifier = FunctionModifiers[match[1] as keyof typeof FunctionModifiers];
            modifiers.push(modifier);
        }

        parsedFunction = new Function(
            methodName,
            modifiers,
            returnType,
            methodPackage,
            startLine,
            endLine,
            args,
            className
        );
    }

    return parsedFunction as Function;
}





function name(params:string) {
        return "";
    }

  