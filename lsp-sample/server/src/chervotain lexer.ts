
import * as chevrotain from 'chevrotain';
import { group } from 'console';

// Klíčová slova
export const tokens = {

  InternalKeyword: chevrotain.createToken({ name: "InternalKeyword", pattern: /internal/ }),
  IntKeyword: chevrotain.createToken({ name: "IntKeyword", pattern: /int/ }),
  LocalKeyword: chevrotain.createToken({ name: "LocalKeyword", pattern: /local/ }),
  EnsureKeyword: chevrotain.createToken({ name: "EnsureKeyword", pattern: /ensure/ }),
  AsKeyword: chevrotain.createToken({ name: "AsKeyword", pattern: /as/ }),
  IsKeyword: chevrotain.createToken({ name: "IsKeyword", pattern: /is/ }),
  BoolKeyword: chevrotain.createToken({ name: "BoolKeyword", pattern: /bool/ }),
  ImportKeyword: chevrotain.createToken({ name: "ImportKeyword", pattern: /import/ }),
  StaticKeyword: chevrotain.createToken({ name: "StaticKeyword", pattern: /static/ }),
  ElseKeyword: chevrotain.createToken({ name: "ElseKeyword", pattern: /else/ }),
  F64Keyword: chevrotain.createToken({ name: "F64Keyword", pattern: /f64/ }),
  F32Keyword: chevrotain.createToken({ name: "F32Keyword", pattern: /f32/ }),
  F16Keyword: chevrotain.createToken({ name: "F16Keyword", pattern: /f16/ }),
  Ui128Keyword: chevrotain.createToken({ name: "Ui128Keyword", pattern: /ui128/ }),
  Ui64Keyword: chevrotain.createToken({ name: "Ui64Keyword", pattern: /ui64/ }),
  Ui32Keyword: chevrotain.createToken({ name: "Ui32Keyword", pattern: /ui32/ }),
  Ui16Keyword: chevrotain.createToken({ name: "Ui16Keyword", pattern: /ui16/ }),
  Ui8Keyword: chevrotain.createToken({ name: "Ui8Keyword", pattern: /ui8/ }),
  I128Keyword: chevrotain.createToken({ name: "I128Keyword", pattern: /i128/ }),
  I64Keyword: chevrotain.createToken({ name: "I64Keyword", pattern: /i64/ }),
  I32Keyword: chevrotain.createToken({ name: "I32Keyword", pattern: /i32/ }),
  I16Keyword: chevrotain.createToken({ name: "I16Keyword", pattern: /i16/ }),
  I8Keyword: chevrotain.createToken({ name: "I8Keyword", pattern: /i8/ }),
  NewKeyword: chevrotain.createToken({ name: "NewKeyword", pattern: /new/ }),
  ClassKeyword: chevrotain.createToken({ name: "ClassKeyword", pattern: /class/ }),
  ConstKeyword: chevrotain.createToken({ name: "ConstKeyword", pattern: /const/ }),
  VarKeyword: chevrotain.createToken({ name: "VarKeyword", pattern: /var/ }),
  ProtectedKeyword: chevrotain.createToken({ name: "ProtectedKeyword", pattern: /protected/ }),
  PrivateKeyword: chevrotain.createToken({ name: "PrivateKeyword", pattern: /private/ }),
  PublicKeyword: chevrotain.createToken({ name: "PublicKeyword", pattern: /public/ }),
  IfKeyword: chevrotain.createToken({ name: "IfKeyword", pattern: /if/ }),
  WhileKeyword: chevrotain.createToken({ name: "WhileKeyword", pattern: /while/ }),
  ForKeyword: chevrotain.createToken({ name: "ForKeyword", pattern: /for/ }),
  ReturnKeyword: chevrotain.createToken({ name: "ReturnKeyword", pattern: /return/ }),
  BreakKeyword: chevrotain.createToken({ name: "BreakKeyword", pattern: /break/ }),
  ContinueKeyword: chevrotain.createToken({ name: "ContinueKeyword", pattern: /continue/ }),
  SwitchKeyword: chevrotain.createToken({ name: "SwitchKeyword", pattern: /switch/ }),
  CaseKeyword: chevrotain.createToken({ name: "CaseKeyword", pattern: /case/ }),
  FunctionKeyword: chevrotain.createToken({ name: "FunctionKeyword", pattern: /fun/ }),
 
  StringKeyword: chevrotain.createToken({ name: "StringKeyword", pattern: /string/ }),
  LongKeyword: chevrotain.createToken({ name: "LongKeyword", pattern: /long/ }),
  EnumKeyword: chevrotain.createToken({ name: "EnumKeyword", pattern: /enum/ }),

  // Ostatní tokeny
  LParen: chevrotain.createToken({ name: "LParen", pattern: /\(/ }),
  RParen: chevrotain.createToken({ name: "RParen", pattern: /\)/ }),
  LCurly: chevrotain.createToken({ name: "LCurly", pattern: /\{/ }),
  RCurly: chevrotain.createToken({ name: "RCurly", pattern: /\}/ }),
  String: chevrotain.createToken({ name: "String", pattern: /"[\s\S]*?"/}, ),
  Colon: chevrotain.createToken({ name: "Colon", pattern: /:/ }),
  Semicolon: chevrotain.createToken({ name: "Semicolon", pattern: /;/ }),
  Assign: chevrotain.createToken({ name: "Assign", pattern: /=/ }),
  Pipe: chevrotain.createToken({ name: "Pipe", pattern: /\|/ }),
  Comma: chevrotain.createToken({ name: "Comma", pattern: /,/ }),
  Identifier: chevrotain.createToken({ name: "Identifier", pattern: /[a-zA-Z_]\w*/ }),
  WhiteSpace: chevrotain.createToken({ name: "WhiteSpace", pattern: /\s+/, group: chevrotain.Lexer.SKIPPED }),
   LineComment: chevrotain.createToken({ name: "LineComment",pattern: /\/\/[^\n]*/,group: chevrotain.Lexer.SKIPPED}),
  BlockComment: chevrotain.createToken({ name: "BlockComment", pattern: /\/\*[\s\S]*?\*\//, group: chevrotain.Lexer.SKIPPED }) ,
  NumberLiteral: chevrotain.createToken({ name: "NumberLiteral", pattern: /[0-9]+/ }),
};
// Všechny tokeny včetně klíčových slov
export const allTokens = [
 tokens.InternalKeyword, tokens.Assign, tokens.Pipe, tokens.String, tokens.NumberLiteral,
  tokens.WhiteSpace, tokens.FunctionKeyword, tokens.ReturnKeyword, tokens.IfKeyword, tokens.ElseKeyword,
  tokens.ForKeyword, tokens.WhileKeyword, tokens.SwitchKeyword, tokens.CaseKeyword, tokens.BreakKeyword,
  tokens.ContinueKeyword, tokens.PublicKeyword, tokens.PrivateKeyword, tokens.ProtectedKeyword, tokens.StaticKeyword,
  tokens.ConstKeyword, tokens.VarKeyword, tokens.NewKeyword, tokens.ClassKeyword, tokens.EnumKeyword,
  tokens.IntKeyword, tokens.StringKeyword, tokens.LongKeyword, tokens.F64Keyword,
  tokens.F32Keyword, tokens.F16Keyword, tokens.Ui128Keyword, tokens.Ui64Keyword, tokens.Ui32Keyword,
  tokens.Ui16Keyword, tokens.Ui8Keyword, tokens.I128Keyword, tokens.I64Keyword, tokens.I32Keyword,
  tokens.I16Keyword, tokens.I8Keyword,  tokens.LocalKeyword, tokens.EnsureKeyword,
  tokens.AsKeyword, tokens.IsKeyword, tokens.BoolKeyword, tokens.ImportKeyword,
  tokens.LParen, tokens.RParen, tokens.LCurly, tokens.RCurly, tokens.Colon, tokens.Semicolon, tokens.Comma,
  tokens.Identifier, tokens.BlockComment, tokens.LineComment
];


