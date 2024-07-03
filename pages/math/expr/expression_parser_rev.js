//Top down recursive descent
//https://www.youtube.com/watch?v=SToUyjAsaFk
//https://www.engr.mun.ca/~theo/Misc/exp_parsing.htm

class Tree {
  constructor() {}
}

class TreeNode extends Tree {
  constructor() {
    super();
    this.opType = "binary";
    this.parent = null;
    this.symbol = null;
    this.values = [];
    // Lower number is higher precedence, 0 is reserved for parentheses
    this.precedence = 0;
  }
  toString() {
    if (this.symbol === "") {
      return this.values.toString();
    } else if ("()END".includes(this.symbol)) {
      return this.symbol;
    } else {
      return this.symbol + "(" + this.values.toString() + ")";
    }
  }
}

class sentinel extends TreeNode {
  constructor() {
    super();
    this.opType = "nullary";
    this.symbol = "SENTINEL";
    this.precedence = 0;
  }
}

class end extends TreeNode {
  constructor() {
    super();
    this.opType = "nullary";
    this.symbol = "END";
    this.precedence = 9999;
  }
}

class openPar extends TreeNode {
  constructor() {
    super();
    this.opType = "nullary";
    this.symbol = "(";
    this.precedence = 0;
  }
}

class closePar extends TreeNode {
  constructor() {
    super();
    this.opType = "nullary";
    this.symbol = ")";
    this.precedence = 0;
  }
}

class Num extends TreeNode {
  //Number
  constructor(value = "none") {
    super();
    this.opType = "nullary";
    this.symbol = "";
    this.values[0] = value;
  }
  eval() {
    return +this.values[0];
  }
}
const constants = {
  pi: [3.14159265, "π"],
  e: [2.718281828459, "e"],
  phi: [1.6180339887, "φ"],
};
class ID extends TreeNode {
  //Variable
  constructor(name = "none") {
    super();
    this.opType = "nullary";
    if (name in constants) {
      this.symbol = constants[name][1];
      this.values[0] = constants[name][0];
    } else {
      this.symbol = name;
      this.values[0] = 0;
    }
  }
  eval() {
    return +this.values[0];
  }
}

class Add extends TreeNode {
  //Add
  constructor(left = "none", right = "none") {
    super();
    this.values[0] = left;
    this.values[1] = right;
    this.symbol = "+";
    this.precedence = 4;
  }
  eval() {
    return this.values[0].eval() + this.values[1].eval();
  }
}

class Sub extends TreeNode {
  //Subtract
  constructor(left = "none", right = "none") {
    super();
    this.values[0] = left;
    this.values[1] = right;
    this.symbol = "-";
    this.precedence = 4;
  }
  eval() {
    return this.values[0].eval() - this.values[1].eval();
  }
}

class Mult extends TreeNode {
  //Multiply
  constructor(left = "none", right = "none") {
    super();
    this.values[0] = left;
    this.values[1] = right;
    this.symbol = "*";
    this.precedence = 2;
  }
  eval() {
    return this.values[0].eval() * this.values[1].eval();
  }
}

class Div extends TreeNode {
  //Divide
  constructor(left = "none", right = "none") {
    super();
    this.values[0] = left;
    this.values[1] = right;
    this.symbol = "/";
    this.precedence = 2;
  }
  eval() {
    return this.values[0].eval() / this.values[1].eval();
  }
}

class Neg extends TreeNode {
  //Negate
  constructor(arg = "none") {
    super();
    this.opType = "unary";
    this.values[0] = arg;
    this.symbol = "-";
    this.precedence = 3;
  }
  eval() {
    return -this.values[0].eval();
  }
}

class Exp extends TreeNode {
  //Divide
  constructor(left = "none", right = "none") {
    super();
    this.values[0] = left;
    this.values[1] = right;
    this.symbol = "^";
    this.precedence = 1;
  }

  eval() {
    return this.values[0].eval() ** this.values[1].eval();
  }
}

class Sqrt extends TreeNode {
  //Negate
  constructor(arg = "none") {
    super();
    this.opType = "unary";
    this.values[0] = arg;
    this.symbol = "√";
    this.precedence = 1;
  }
  eval() {
    return this.values[0].eval() ** 0.5;
  }
}

function tokenize(string) {
  // Map key strings to token types
  let multiCharNTerminal = new Map();

  multiCharNTerminal.set("sqrt", Sqrt);
  multiCharNTerminal.set("-", Neg);
  multiCharNTerminal.set("+", Add);
  multiCharNTerminal.set("*", Mult);
  multiCharNTerminal.set("/", Div);
  multiCharNTerminal.set("^", Exp);
  multiCharNTerminal.set("(", openPar);
  multiCharNTerminal.set(")", closePar);

  // Grouping characters
  let groupingChars = "{}[]";
  let tokens = [];
  let stringIndex = 0;
  for (let stringIndex = 0; stringIndex < string.length; stringIndex++) {
    // Working character from input string
    let currentChar = string[stringIndex];

    // Index [-1] of tokens
    let lastIndex = tokens.length > 0 ? tokens.length - 1 : 0;

    // Non-terminal characters are pushed to the token array, otherwise do else
    if (
      multiCharNTerminal.has(currentChar) ||
      groupingChars.includes(currentChar)
    ) {
      if (multiCharNTerminal.has(currentChar)) {
        tokens.push(new (multiCharNTerminal.get(currentChar))());
      } else {
        tokens.push(currentChar);
      }
    } else {
      // Push an empty string to token stream for mutation if current string is part of a terminal and preceding token is non-terminal
      if (
        groupingChars.includes(tokens[lastIndex]) ||
        (typeof tokens[lastIndex] == "object" &&
          Array.from(multiCharNTerminal.values())
            .join("")
            .includes(tokens[lastIndex].constructor.name))
      ) {
        tokens.push("");
        lastIndex++;
      } else if (tokens.length == 0) {
        tokens.push("");
      }

      // If current character is part of an <ID> token, it must be alphabetic
      if (currentChar.match(/[a-z]|[A-Z]/i)) {
        // If previous term was numeric, we want to make a new token entry into the stream
        if (tokens[lastIndex].length >= 1 && !isNaN(tokens[lastIndex])) {
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
    if (multiCharNTerminal.has(tokens[i])) {
      tokens[i] = new (multiCharNTerminal.get(tokens[i]))();
    } else if (
      typeof tokens[i] != "object" &&
      !groupingChars.includes(tokens[i])
    ) {
      if (isNaN(tokens[i])) {
        tokens[i] = new ID(tokens[i]);
      } else {
        tokens[i] = new Num(tokens[i]);
      }
    }
  }
  // End of expression
  tokens.push(new end());
  return tokens;
}

// Not done, need to figure out how to distinguish unary and binary - operator
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
      console.log("openPar");
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
