//Top down recursive descent
//https://www.youtube.com/watch?v=SToUyjAsaFk

const testExpression = "(x+6)*-a";

class Tree {}

class Num extends Tree {
  //Number
  constructor(value) {
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
  constructor(name, value) {
    this.name = name;
    this.value = value;
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
    this.arg = arg;
  }

  toString() {
    return "(-" + this.arg.toString() + ")";
  }

  eval() {
    return -this.left.eval();
  }
}

function buildTree(expression) {
  expression;
  let nextToken = expression[0];
  let index = -1;

  function scanToken() {
    nextToken = expression[index + 1];
    index++;
  }

  function parseExpr() {
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
    let out = parseTerm();
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
      out = expression[index];
      if (out === null) {
        return null;
      }
      if (isNaN(nextToken) || nextToken != ".") {
        if (nextToken.match(/[a-z]/i)) {
          scanToken();
          out += parseTerm();
        } else {
          if (isNaN(out)) {
            return new ID(out);
          } else {
            return new Num(out);
          }
        }
      } else {
        scanToken();
        out += parseTerm();
      }
    }
  }

  function parseFactor() {
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