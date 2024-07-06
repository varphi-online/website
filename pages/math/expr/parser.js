//Top down recursive descent
//https://www.youtube.com/watch?v=SToUyjAsaFk
//https://www.engr.mun.ca/~theo/Misc/exp_parsing.htm

function scanner(string) {
  let lexemes = [""];
  // Regex expressions to match lexemes
  let numeric = /\d+(\.)?\d*/;
  let alphabetic = /([a-zA-Z])+(\_\w+)?/;
  let operational = /[\*\/\-\+\(\)\{\}\[\]\<\>\^]/;

  function stringType(string) {
    if (numeric.test(string)) {
      return 0;
    } else if (alphabetic.test(string)) {
      return 1;
    } else {
      return 3;
    }
  }

  function charType(string) {
    if (/[\.0-9]/.test(string)) {
      return 0;
    } else if (/[_a-zA-Z]/.test(string)) {
      return 1;
    } else if (operational.test(string)) {
      return 2;
    } else {
      console.error("Unrecognized character: " + string);
      return 3;
    }
  }

  // Consumes characters, either adding them to the existing previous
  // lexeme or making a new one of a different type.
  for (let i = 0; i < string.length; i++) {
    let currentIndex = lexemes.length > 0 ? lexemes.length - 1 : 0;
    let currentType = stringType(lexemes[currentIndex]);
    let characterType = charType(string[i]);
    if (
      currentType == characterType ||
      lexemes[currentIndex] === "" ||
      (lexemes[currentIndex].includes("_") && characterType == 0)
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
    } else if (/\d+(\.)?\d*/.test(lexemes[i])) {
      tokens.push(new Num(lexemes[i]));
    } else {
      tokens.push(new ID(lexemes[i]));
    }
  }
  // Second pass, apply rules like coefficient multiplication and - handling
  for (let i = 0; i < tokens.length; i++) {
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
