let output0 = document.getElementById("out0");
let output = document.getElementById("out");
let output2 = document.getElementById("out2");
let output3 = document.getElementById("out3");

function inpUpdate(input) {
  output0.innerHTML = lexize(input)
  parsed = shuntingYard(tokenize(input));
  output.innerText = tokenize(input);
  output2.innerText = parsed;
  output3.innerText = parsed.eval();
}
