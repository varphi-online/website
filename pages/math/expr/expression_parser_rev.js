//Top down recursive descent
//https://www.youtube.com/watch?v=SToUyjAsaFk
//https://www.engr.mun.ca/~theo/Misc/exp_parsing.htm

class Tree {
  constructor() {}
}
class TreeNode extends Tree {
  constructor() {
    super();
    this.parent = null;
    this.symbol = "";
    this.values = [];
    // Lower number is higher precedence, 0 is reserved for parentheses
    this.precedence = 0;
  }
  toString() {
    console.log(this);
    return this.symbol + "(" + this.values.toString() + ")";
  }
}

class Num extends TreeNode {
  //Number
  constructor(value = "none") {
    super();
    this.symbol = "";
    this.values[0] = value;
  }
}

class ID extends TreeNode {
  //Variable
  constructor(name = "none") {
    super();
    this.symbol = name;
    this.values[0] = "none";
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
}

class Neg extends TreeNode {
  //Negate
  constructor(arg = "none") {
    super();
    this.values[0] = arg;
    this.symbol = "-";
    this.precedence = 3;
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
}

class Sqrt extends TreeNode {
  //Negate
  constructor(arg = "none") {
    super();
    this.values[0] = arg;
    this.symbol = "√";
    this.precedence = 1;
  }
}

function tokenize(string) {
  // Map key strings to token types
  let multiCharNTerminal = new Map();

  multiCharNTerminal.set("sqrt", Sqrt);
  multiCharNTerminal.set("-", Sub);
  multiCharNTerminal.set("+", Add);
  multiCharNTerminal.set("*", Mult);
  multiCharNTerminal.set("/", Div);
  multiCharNTerminal.set("^", Exp);

  // Grouping characters
  let groupingChars = "(){}[]";
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
  tokens.push("EOE");
  return tokens;
}

// Not done
function shuntingYard(tokenStream) {
  let operands = [];
  let operators = [new TreeNode()];
  let currentToken = null;

  function consume() {
    currentToken = tokenStream[0];
    tokenStream.shift();
  }

  while (tokenStream[0] != "EOE" && operators[0].prescedence != 0) {
    consume();
    if (currentToken instanceof ID || currentToken instanceof Num) {
      operands.push(currentToken);
    } else {
      if (currentToken == ")") {
        while (operators[operators.length - 1] != "(") {
          operators.pop();
        }
        operators.pop();
        operators[operators.length - 1].values[0] = operands.pop();
        operators[operators.length - 1].values[1] = operands.pop();
        operands.push(currentToken);
      }
    }
  }
}
