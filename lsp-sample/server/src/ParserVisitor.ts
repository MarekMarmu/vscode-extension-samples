import { tokenMatcher } from 'chevrotain';
import MyParser from './chevrotain parser';


const parser = new MyParser();
const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export default class CahaVisitor extends BaseCstVisitor {

    files = {};
    classes = {};
    
    constructor() {
        super();
        this.validateVisitor();
    }

    // Návštěvník pro pravidlo `program`
    file(ctx: any) {
        return ctx.classDeclaration?.map((classNode: chevrotain.CstNode) => this.visit(classNode))
            .concat(ctx.functionDeclaration?.map((funcNode: chevrotain.CstNode) => this.visit(funcNode)))
            .concat(ctx.variableDeclaration?.map((varNode: chevrotain.CstNode) => this.visit(varNode))) || [];
    }

    // Návštěvník pro `classDeclaration`
    classDeclaration(ctx: any) {
        const className = ctx.Identifier[0].image;
        const classBody = ctx.children.map((bodyNode: chevrotain.CstNode) => this.visit(bodyNode)) || [];
        return { type: 'ClassDeclaration', name: className, body: classBody };
    }

    // Návštěvník pro `accessBlock`
    accessBlock(ctx: any) {
        const modifier = this.visit(ctx.accessModifier);
        const blockBody = ctx.classBody?.map((bodyNode:chevrotain.CstNode) => this.visit(bodyNode)) || [];
        return { type: 'AccessBlock', modifier, body: blockBody };
    }

    // Návštěvník pro `accessModifier`
    accessModifier(ctx: any) {
        if (ctx.PublicKeyword) return "public";
        if (ctx.PrivateKeyword) return "private";
        if (ctx.ProtectedKeyword) return "protected";
    }

    // Návštěvník pro `functionDeclaration`
    functionDeclaration(ctx: any) {
        const functionName = ctx.Identifier[0].image;
        const params = this.visit(ctx.parameterList);
        const body = ctx.functionBody?.map((bodyNode: chevrotain.CstNode) => this.visit(bodyNode)) || [];
        return { type: 'FunctionDeclaration', name: functionName, parameters: params, body };
    }

    // Návštěvník pro `parameterList`
    parameterList(ctx: any) {
        return ctx.parameter?.map((paramNode: chevrotain.CstNode) => this.visit(paramNode)) || [];
    }

    // Návštěvník pro `parameter`
    parameter(ctx: any) {
        const paramName = ctx.Identifier[0].image;
        const paramType = ctx.Identifier[1].image;
        return { name: paramName, type: paramType };
    }

    // Návštěvník pro `variableDeclaration`
    variableDeclaration(ctx: any) {
        const varName = ctx.Identifier[0].image;
        const varType = ctx.type ? this.visit(ctx.type) : null;
        const varValue = ctx.expression ? this.visit(ctx.expression) : null;
        return { type: 'VariableDeclaration', name: varName, varType, value: varValue };
    }

    // Návštěvník pro `type`
    type(ctx: any) {
        if (ctx.IntKeyword) return "int";
        if (ctx.StringKeyword) return "string";
        if (ctx.Identifier) {
            const baseType = ctx.Identifier[0].image;
            const unionType = ctx.type ? this.visit(ctx.type) : null;
            return unionType ? `${baseType} | ${unionType}` : baseType;
        }
    }

    // Návštěvník pro `expression`
    expression(ctx: any) {
        if (ctx.NumberLiteral) return ctx.NumberLiteral[0].image;
        if (ctx.Identifier) return ctx.Identifier[0].image;
        if (ctx.String) return ctx.String[0].image;
    }

    // Přidání dalších pravidel podle potřeby...
}