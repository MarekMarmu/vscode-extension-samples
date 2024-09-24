import * as chevrotain from 'chevrotain';
import { tokens, allTokens } from './chervotain lexer.js';

export class MyParser extends chevrotain.CstParser {
  

    constructor() {
        super(allTokens);
        this.performSelfAnalysis();
    }

    

    // Pravidlo pro celý program - může obsahovat jak třídy, tak funkce
    public file = this.RULE("file", () => {
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.classDeclaration) },  // Třída
                { ALT: () => this.SUBRULE(this.functionDeclaration) },
                { ALT: () => this.SUBRULE(this.variableDeclaration) } // Funkce
            ]);
        });
    });
    
    private type = this.RULE("type", () => {
        this.OR([
            { ALT: () => this.CONSUME(tokens.IntKeyword) },        // "int"
            { ALT: () => this.CONSUME(tokens.StringKeyword) },     // "string"
            { ALT: () => {
                this.CONSUME(tokens.Identifier); // jiný typ (např. "MyType")
                this.OPTION(() => {
                    this.CONSUME(tokens.Pipe);  // "|"
                    this.SUBRULE(this.type);    // Další typ (pro unie)
                });
            }}
        ]);
    });

    // Pravidlo pro výraz (např. "20", "myVariable", atd.)
    private expression = this.RULE("expression", () => {
        this.OR([
            { ALT: () => this.CONSUME(tokens.NumberLiteral) }, // Například "20"
            { ALT: () => this.CONSUME(tokens.Identifier) }, 
            {ALT: () => this.CONSUME(tokens.String) }    // Například "myVariable"
            // Můžeš přidat další možnosti pro výrazy zde
        ]);
    });


    private variableDeclaration = this.RULE("variableDeclaration", () => {
        this.CONSUME(tokens.VarKeyword); // "var"
        this.CONSUME(tokens.Identifier);  // Název proměnné

        // Volitelná část pro typ (např. ": int | string")
        this.OPTION(() => {
            this.CONSUME(tokens.Colon); // Dvojtečka
            this.SUBRULE(this.type);      // Typ proměnné
        });

        // Volitelná část pro přiřazení (např. "= 20")
        this.OPTION1(() => {
            this.CONSUME(tokens.Assign);  // "="
            this.SUBRULE(this.expression); // Výraz pro přiřazení
        });

        // Pokud typ není definován, musí být přiřazena hodnota
    
            this.CONSUME(tokens.Semicolon); // ";"
    
    });

    // Pravidlo pro deklaraci třídy (může obsahovat další třídy a funkce)
    public classDeclaration = this.RULE("classDeclaration", () => {
        this.CONSUME(tokens.ClassKeyword);  // "class"
        this.CONSUME(tokens.Identifier);    // název třídy
        this.CONSUME(tokens.LCurly);        // "{"
    
        // Samostatné pravidlo pro tělo třídy
        this.SUBRULE(this.classBody);
    
        this.CONSUME(tokens.RCurly);        // "}"
    });
    
    // Nové pravidlo pro classBody
    public classBody = this.RULE("classBody", () => {
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.accessBlock) },  // Přístupový blok
                { ALT: () => this.SUBRULE(this.functionDeclaration) },  // Funkce uvnitř třídy
                { ALT: () => this.SUBRULE(this.classDeclaration) }, // Vnořená třída
                { ALT: () => this.SUBRULE(this.variableDeclaration) } // Deklarace proměnné
            ]);
        });
    });
    

    // Přístupový blok pro private:, public:, atd.
    public accessBlock = this.RULE("accessBlock", () => {
        this.SUBRULE(this.accessModifier);  // Např. "private:"
        this.CONSUME(tokens.Colon);         // Dvojtečka po modifikátoru
        
        this.SUBRULE(this.accesssBlockBody);
    });

    private accesssBlockBody = this.RULE("accessBlockBody", () => {
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.functionDeclaration) },  // Funkce uvnitř třídy
                { ALT: () => this.SUBRULE(this.classDeclaration) }, // Vnořená třída
                { ALT: () => this.SUBRULE(this.variableDeclaration) } // Deklarace proměnné
            ]);
        });
    });

    // Přístupové modifikátory (volitelně)
    public accessModifier = this.RULE("accessModifier", () => {
        this.OR([
            { ALT: () => this.CONSUME(tokens.PublicKeyword) },    // "public"
            { ALT: () => this.CONSUME(tokens.PrivateKeyword) },   // "private"
            { ALT: () => this.CONSUME(tokens.ProtectedKeyword) }  // "protected"
        ]);
    });

    // Pravidlo pro deklaraci funkce (může obsahovat další funkce nebo třídy)
    public functionDeclaration = this.RULE("functionDeclaration", () => {
        this.CONSUME(tokens.FunctionKeyword);  // "fun"
        this.CONSUME(tokens.Identifier);       // název funkce
        this.CONSUME(tokens.LParen);           // "("
        this.OPTION(() => {
            this.SUBRULE(this.parameterList);  // parametry funkce
        });
        this.CONSUME(tokens.RParen);           // ")"
        this.CONSUME(tokens.LCurly);           // "{"

        
        this.MANY(() => {
            this.OR([
                { ALT: () => this.SUBRULE(this.functionDeclaration) },  // Vnořená funkce
                { ALT: () => this.SUBRULE(this.classDeclaration) },
                { ALT: () => this.SUBRULE(this.variableDeclaration) }           // Vnořená třída
            ]);
        });

        this.CONSUME(tokens.RCurly);           // "}"
    });

   // private ReturnStatement = this.RULE("ReturnStamenent", () => {

  //  });


    // Pravidlo pro seznam parametrů funkce
    private parameterList = this.RULE("parameterList", () => {
        this.MANY_SEP({
            SEP: tokens.Comma,
            DEF: () => {
                this.SUBRULE(this.parameter);
            }
        });
    });

    // Pravidlo pro jeden parametr (název a typ)
    private parameter = this.RULE("parameter", () => {
        this.CONSUME(tokens.Identifier);   // Název parametru
        this.CONSUME(tokens.Colon);        // Dvojtečka
        this.CONSUME1(tokens.Identifier);  // Typ parametru
    });
}

export default MyParser;
