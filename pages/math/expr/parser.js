//Top down recursive descent
//https://www.youtube.com/watch?v=SToUyjAsaFk
//https://www.engr.mun.ca/~theo/Misc/exp_parsing.htm

let numeric = /[0-9]+(\.)?[0-9]*$/yg;
let alphabetic = /([a-zA-Z]+)(_({(\w*(})?)?)?)?$/yg;
let operational = /[\*\/\-\+\(\)\[\]\<\>\^\|]$/yg;

function scanner(string) {
  let lexemes = [""];
  // Regex expressions to match lexemes

  function stringType(string) {
    let out = 0;
    if (string.match(numeric)==string) {
      out += 4;
    }
    if (string.match(alphabetic)==string) {
      out += 2;
    }
    return out != 0 ? out : 8;
  }

  // Character matching flags are in big-endian representation (like base 10)
  // bit 1 for numeric, bit 2 for alphabetic, and bit 3 for operational
  function charType(string) {
    let out = 0;
    if (/[\.\d]/.test(string)) {
      out += 4;
    }
    if (/[\w\{\}\_]/.test(string)) {
      out += 2;
    }
    if (operational.test(string)) {
      out += 1;
    }
    return out;
  }

  // Consumes characters, either adding them to the existing previous
  // lexeme or making a new one of a different type.
  for (let i = 0; i < string.length; i++) {
    let currentIndex = lexemes.length > 0 ? lexemes.length - 1 : 0;
    let characterType = charType(string[i]);
    let combinedType = stringType(lexemes[currentIndex]+string[i]);
    //console.log(lexemes[currentIndex]+string[i]+":"+combinedType.toString(2) + " | " +string[i]+":"+ characterType.toString(2));
    if (
      (combinedType & characterType) == combinedType ||
      lexemes[currentIndex] === ""
    ) {
      lexemes[currentIndex] += string[i];
    } else {
      lexemes.push(string[i]);
    }
  }
  return lexemes;
}

function evaluator(lexemes) {
  let tokens = [];
  // First pass, tokenize
  for (let i = 0; i < lexemes.length; i++) {
    if (nonTerminals.has(lexemes[i])) {
      tokens.push(new (nonTerminals.get(lexemes[i]))());
    } else if (lexemes[i].match(numeric)==lexemes[i]) {
      tokens.push(new Num(lexemes[i]));
    } else {
      tokens.push(new ID(lexemes[i]));
    }
  }
  // Second pass, apply rules like coefficient multiplication and - handling
  let typeFlag = null;
  for (let i = 0; i < tokens.length; i++) {
    if (typeFlag && tokens[i] instanceof typeFlag){
      typeFlag = null;
      tokens.splice(i,1, new closePar());
      continue;
    }
    // Unary vs Binary -
    if (
      tokens[i] instanceof Sub &&
      !(tokens[i - 1] instanceof ID || tokens[i - 1] instanceof Num)
    ) {
      let splice = [new Num(0)];
      if (
        tokens[i - 1] instanceof openPar &&
        tokens[i + 2] instanceof closePar
      ) {
        tokens.splice(i, 0, new Num(0));
        i += 1;
      } else {
        tokens.splice(i + 2, 0, new closePar());
        i += 1;
        tokens.splice(i - 1, 0, new openPar(), new Num(0));
        i += 2;
      }
    }
    // Coefficients
    if (
      (tokens[i] instanceof Num || tokens[i] instanceof closePar) &&
      (tokens[i + 1] instanceof ID || tokens[i + 1] instanceof openPar)
    ) {
      tokens.splice(i + 1, 0, new Mult());
      i += 1;
    }
    if (tokens[i] instanceof Abs){
      typeFlag = Abs;
      tokens.splice(i + 1, 0, new openPar());
    }
  }
  tokens.push(new end());
  return tokens;
}

function shuntingYard(tokenStream) {
  let operands = [];
  let operators = [];
  let next = tokenStream[0];

  function consume() {
    next = tokenStream[1];
    tokenStream.shift();
  }

  function expect(type) {
    if (next instanceof type) {
      consume();
    } else {
      //console.error("Unexpected token, expected: " + type + "\n\nGot:");
      //console.error(next);
      //console.error("which is of type: " + typeof next);
    }
  }

  const sent = new sentinel();
  operators.push(sent);
  E();
  expect(end);
  return operands[operands.length - 1];

  function E() {
    //console.log(tokenStream + "|" + operands + "|" + operators);
    P();
    while (!(next instanceof end) && next.opType == "binary") {
      pushOperator(next);
      consume();
      P();
    }
    while (!(operators[operators.length - 1] instanceof sentinel)) {
      popOperator();
    }
  }

  function P() {
    //console.log(tokenStream + "|" + operands + "|" + operators);
    if (next instanceof ID || next instanceof Num) {
      operands.push(next);
      consume();
    } else if (next instanceof openPar) {
      consume();
      operators.push(sent);
      E();
      expect(closePar);
      operators.pop();
    } else if (next.opType == "unary") {
      pushOperator(next);
      consume();
      P();
    } else {
      //console.error("Not defined in grammar");
    }
  }

  function popOperator() {
    if (operators[operators.length - 1].opType == "binary") {
      const t1 = operands.pop();
      const t2 = operands.pop();
      let toadd = operators.pop();
      toadd.values[1] = t1;
      toadd.values[0] = t2;
      operands.push(toadd);
    } else {
      let toadd = operators.pop();
      toadd.values[0] = operands.pop();
      operands.push(toadd);
    }
  }

  function pushOperator(operator) {
    while (
      !(operators[operators.length - 1] instanceof sentinel) &&
      operators[operators.length - 1].precedence < operator.precedence
    ) {
      popOperator();
    }
    operators.push(operator);
  }
}
