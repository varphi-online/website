//Top down recursive descent
//https://www.youtube.com/watch?v=SToUyjAsaFk

class Tree {
    constructor() {

    }
}
class TreeNode extends Tree {
    constructor() {
        super();
        this.parent = null;
    }
}

class Num extends TreeNode {
    //Number
    constructor(value = "none") {
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

class ID extends TreeNode {
    //Variable
    constructor(name = "none") {
        super();
        this.name = name;
        this.value = "none";
    }

    toString() {
        return this.name + "==>" + this.value.toString();
    }

    eval() {
        return this.value;
    }
}

class Add extends TreeNode {
    //Add
    constructor(left = "none", right = "none") {
        super();
        this.left = left;
        this.right = right;
    }

    toString() {
        if (this.left)
            return "(" + this.left.toString() + "+" + this.right.toString() + ")";
    }

    eval() {
        return this.left.eval() + this.right.eval();
    }
}

class Sub extends TreeNode {
    //Subtract
    constructor(left = "none", right = "none") {
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

class Mult extends TreeNode {
    //Multiply
    constructor(left = "none", right = "none") {
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

class Div extends TreeNode {
    //Divide
    constructor(left = "none", right = "none") {
        super();
        this.left = left;
        this.right = right;
    }

    toString() {
        return "(" + this.left.toString() + "/" + this.right.toString() + ")";
    }

    eval() {
        return this.left.eval() / this.right.eval();
    }
}

class Neg extends TreeNode {
    //Negate
    constructor(arg = "none") {
        super();
        this.arg = arg;
    }

    toString() {
        return "(-" + this.arg.toString() + ")";
    }

    eval() {
        return -this.arg.eval();
    }
}

class Sqrt extends TreeNode {
    //Negate
    constructor(arg = "none") {
        super();
        this.arg = arg;
    }

    toString() {
        return "(√" + this.arg.toString() + ")";
    }

    eval() {
        return Math.sqrt(this.arg.eval());
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

    // Grouping characters
    let groupingChars = '(){}[]';
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

const testExpression = "(sqrt[1/x]/3.14159varphi)-4";

console.log(tokenize(testExpression));

/*
function buildTree(expression) {
    expression = tokenize(expression);
    let resultTree = new Tree();
    let nextToken = expression[0];
    let index = -1;

    function scanToken() {
        nextToken = expression[index + 1];
        index++;
        console.log("Scanned to: ." + nextToken)
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
        }  else {
          return null;
        }
      }

      function parseExpr() {
        console.log("Expr Parse: " + nextToken)
        let out = parseTerm();
        while (true) {
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

      function parseTerm() {
        console.log("Term Parse " + nextToken)
        let out = parseFactor();
        while (true) {
        if (nextToken == "*") {
          scanToken();
          let second = parseTerm();
          out = new Mul(out, second);
        } else if (nextToken == "/") {
          scanToken();
          let second = parseTerm();
          out = new Div(out, second);
        } else {
            return out;
        }
      }
    }

    while (nextToken != "EOE") {
        resultTree = parseFactor();
    }

    return resultTree;
}

console.log(buildTree(testExpression))
*/