//Top down recursive descent
//https://www.youtube.com/watch?v=SToUyjAsaFk

const testExpression = "(3+6)*-5";

class Tree {}

class Num extends Tree {
  //Number
  constructor(value) {
    super();
    this.value = value;
  }

  toString() {
    return this.value.toString();
  }

  eval() {
    return this.value;
  }
}

class ID extends Tree {
  //Variable
  constructor(name) {
    super();
    this.name = name;
    this.value = null;
  }

  toString() {
    return this.name + "==>" + this.value.toString();
  }

  eval() {
    return this.value;
  }
}

class Add extends Tree {
  //Add
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  toString() {
    return "(" + this.left.toString() + "+" + this.right.toString() + ")";
  }

  eval() {
    return this.left.eval() + this.right.eval();
  }
}

class Sub extends Tree {
  //Subtract
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  toString() {
    return "(" + this.left.toString() + "-" + this.right.toString() + ")";
  }

  eval() {
    return this.left.eval() - this.right.eval();
  }
}

class Mult extends Tree {
  //Multiply
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  toString() {
    return "(" + this.left.toString() + "+" + this.right.toString() + ")";
  }

  eval() {
    return this.left.eval() * this.right.eval();
  }
}

class Div extends Tree {
  //Divide
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  toString() {
    return "(" + this.left.toString() + "+" + this.right.toString() + ")";
  }

  eval() {
    return this.left.eval() / this.right.eval();
  }
}

class Neg extends Tree {
  //Negate
  constructor(arg) {
    super();
    this.arg = arg;
  }

  toString() {
    return "(-" + this.arg.toString() + ")";
  }

  eval() {
    return -this.left.eval();
  }
}

function tokenize(string) {
  let tokens = [];
  let stringIndex = 0;
  for (let stringIndex = 0; stringIndex < string.length; stringIndex++) {
    // Working character from input string
    let currentChar = string[stringIndex];

    // Index [-1] of tokens
    let lastIndex = tokens.length - 1;

    // Non-terminal characters are pushed to the token array, otherwise do else
    if ("+-*/^()".includes(currentChar)) {
      tokens.push(currentChar);
    } else {
      // Push an empty string to token stream for mutation if current string is part of a terminal and preceding token is non-terminal
      if ("+-*/^()".includes(tokens[lastIndex])) {
        tokens.push("");
        lastIndex++;
      }

      // If current character is part of an <ID> token, it must be alphabetic
      if (currentChar.match(/[a-z]|[A-Z]/i)) {

        // If previous term was numeric, we want to make a new token entry into the stream
        if (parseFloat(tokens[lastIndex]) === NaN) {
          tokens.push("");
          lastIndex++;
          tokens[lastIndex] += currentChar;
        } else {
          tokens[lastIndex] += currentChar;
        }
      } 
      
      // Check if currentChar is an integer or a decimal point
      else if (currentChar.match(/[0-9]|\./i)) {
        tokens[lastIndex] += currentChar;
      }
      //All other cases 
      else {
        tokens[lastIndex] = null;
      }
    }
  }
  for (let i = 0; i < tokens.length; i++) {
    if (!"+-*/^()".includes(tokens[i])) {
      if (isNaN(tokens[i])) {
        tokens[i] = new ID(tokens[i]);
      } else {
        tokens[i] = new Num(tokens[i]);
      }
    }
  }
  return tokens;
}

function buildTree(expression) {
    
  expression = tokenize(expression);
  console.log(expression)
  let nextToken = expression[0];
  let currentToken = expression[-1];
  let index = -1;

  function scanToken() {
    currentToken = expression[index];
    nextToken = expression[index + 1];
    index++;
    console.log("Scanned to: ." + currentToken+". , "+nextToken)
  }

  function parseExpr() {
    console.log("Expr Parse: " + nextToken)
    let out = parseTerm();
    while (true) {
      if (out === null) {
        return null;
      }
      if (nextToken == "+") {
        scanToken();
        let second = parseTerm();
        out = new Add(out, second);
      } else if (nextToken == "-") {
        scanToken();
        let second = parseTerm();
        out = new Sub(out, second);
      } else {
        return out;
      }
    }
  }

  //Might have to do while loop here too idk

  function parseTerm() {
    console.log("Term Parse " + nextToken)
    let out = currentToken
    if (nextToken == "*") {
      scanToken();
      let second = parseTerm();
      out = new Mul(out, second);
      return out;
    } else if ((nextToken = "/")) {
      scanToken();
      let second = parseTerm();
      out = new Div(out, second);
      return out;
    } else {
      // Var or num
      out = expression[index]
      if (out === null) {
        return null;
      }
      return out;
    }
  }

  function parseFactor() {
    console.log("Factor Parse " + nextToken)
    if (typeof nextToken === ID || typeof nextToken === Num) {
      return nextToken;
    } else if (nextToken == "(") {
      scanToken();
      let out = parseExpr();
      if (out === null) {
        return null;
      }
      if (nextToken == ")") {
        return out;
      } else {
        return null;
      }
    } else if (nextToken == "-") {
      scanToken();
      return new Neg(parseFactor());
    } else {
      return null;
    }
  }

  return parseFactor(expression)
}

console.log(buildTree(testExpression))