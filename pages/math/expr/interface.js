let output0 = document.getElementById("out0");
let output = document.getElementById("out");
let output2 = document.getElementById("out2");
let output3 = document.getElementById("out3");

function inpUpdate(input) {
  output0.innerHTML = "Lexemes: " + scanner(input).join(" , ");
  output.innerText = "Tokens: " + evaluator(scanner(input)).join(" , ");
  parsed = shuntingYard(evaluator(scanner(input)));
  output2.innerText = "Abstract Syntax Tree: " + parsed;
  output3.innerText = "Evaluated expression: " + parsed.eval();
}
