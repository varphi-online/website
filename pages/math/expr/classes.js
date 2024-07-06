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
      if (this.values.every((val) => val == "none")) {
        return this.symbol + "( )";
      } else {
        return this.symbol + "(" + this.values.toString() + ")";
      }
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
      this.values[0] = 1;
    }
  }

  setValue(val) {
    this.values[0] = val;
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

let nonTerminals = new Map();

nonTerminals.set("sqrt", Sqrt);
nonTerminals.set("-", Sub);
nonTerminals.set("+", Add);
nonTerminals.set("*", Mult);
nonTerminals.set("/", Div);
nonTerminals.set("^", Exp);
nonTerminals.set("(", openPar);
nonTerminals.set(")", closePar);
