import { BasicInfo } from './BasicInfo';
import { Class } from './Class';

export class Variable {
	

    private parentClass: Class;
    private annotations: string[];
    private innerClasses: Class[];
	private modifiers: Modifiers[];
	private type: String;
	private package: string;
	private startLine: number;
	private endLine: number;
	private variableName : String;

	constructor($parentClass: Class, $annotations: string[], $innerClasses: Class[], $modifiers: Modifiers[], $type: String, $package: string, $startLine: number, $endLine: number, $variableName: String) {
		this.parentClass = $parentClass;
		this.annotations = $annotations;
		this.innerClasses = $innerClasses;
		this.modifiers = $modifiers;
		this.type = $type;
		this.package = $package;
		this.startLine = $startLine;
		this.endLine = $endLine;
		this.variableName = $variableName;
	}

	
}

enum Modifiers {
	public,
	protected,
	private,
	static,
	const,
	var

}