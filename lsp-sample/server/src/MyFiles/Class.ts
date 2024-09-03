import { BasicInfo } from './BasicInfo';
import { Function } from './Function';
import { Trait } from './Trait';
import { Variable } from './Variable';

export class Class {

    private methods: Function[];
    private variables: Variable[];
    private parentClassName: string | null;
    private annotations: string[];
    private innerClasses: Class[];
    private modifiers: Modifiers[];
    private package: string;
    private startLine: number;
    private endLine: number;
    private className: string;

    constructor(
        methods: Function[], 
        modifiers: Modifiers[],
        variables: Variable[], 
        parentClassName: string | null, 
        annotations: string[], 
        innerClasses: Class[],
        pkg: string,            
        startLine: number,
        endLine: number,
        className: string
    ) {
        this.modifiers = modifiers;
        this.methods = methods;
        this.variables = variables;
        this.parentClassName = parentClassName;
        this.annotations = annotations;
        this.innerClasses = innerClasses;
        this.package = pkg;
        this.startLine = startLine;
        this.endLine = endLine;
        this.className = className;
    }
}
enum Modifiers {
    public = 'public',
    private = 'private',
    protected = 'protected',
    static = 'static',
}

