import { Class } from './Class';
import { Variable } from './Variable';

export class Function {
	
	
	methodName: string;

    modifiers: FunctionModifiers[];
	returnType: string;
	package: string;
	startLine: number;
	endLine: number;
	arguments: string[];
	parentClassName: string | null;


	constructor( 
		$methodName: string,
		 $modifiers: FunctionModifiers[], 
		 $returnType: string, 
		 $package: string, 
		 $startLine: number,
		  $endLine: number, 
		  $arguments: string[], 
		  $parentClassName : string | null
		) {
		this.parentClassName = $parentClassName;
		this.methodName = $methodName;
		this.modifiers = $modifiers;
		this.returnType = $returnType;
		this.package = $package;
		this.startLine = $startLine;
		this.endLine = $endLine;
		this.arguments = $arguments;

	}


}

export enum FunctionModifiers {
	private,
	protected,
	public,
	static,
	internal,
	local
	
}