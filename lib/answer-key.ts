type AnswerRule = {
  accepted: string[];
  correctFeedback: string;
  incorrectFeedback: string;
};

const rules: Record<string, AnswerRule> = {
  "hello-print-choice": { accepted: ['print("Hello, coder!")'], correctFeedback: "Exactly. print() is Python's standard way to display a value.", incorrectFeedback: "Look for Python's built-in function that prints text to the screen." },
  "hello-fill-print": { accepted: ["print"], correctFeedback: "Correct — print is the function name.", incorrectFeedback: "You used this function in the previous question. It starts with p." },
  "hello-output": { accepted: ["Python is fun"], correctFeedback: "Right. The quotation marks define the string; they are not printed.", incorrectFeedback: "Python displays the text inside the quotation marks." },
  "variable-create": { accepted: ["score = 10"], correctFeedback: "Yes. The name goes on the left and the stored value goes on the right.", incorrectFeedback: "Remember: variable_name = value." },
  "variable-name": { accepted: ["lives"], correctFeedback: "Perfect. lives now labels the value 7.", incorrectFeedback: "The prompt asks for the variable name only." },
  "variable-output": { accepted: ["7"], correctFeedback: "Correct. points starts at 4, then 3 is added and stored back into points.", incorrectFeedback: "Follow the variable one line at a time: start at 4, then add 3." },
  "variable-code": { accepted: ['language="Python"', "language='Python'"], correctFeedback: "Nice. You created a variable and stored a string in it.", incorrectFeedback: 'Use the pattern name = "text" and keep the variable name language.' },
  "type-string": { accepted: ["String"], correctFeedback: "Correct. Text inside quotation marks is a string.", incorrectFeedback: "Look at the quotation marks around the value." },
  "type-integer": { accepted: ["Integer"], correctFeedback: "Right. 16 is a whole number, so Python treats it as an integer.", incorrectFeedback: "This value is a whole number with no decimal point." },
  "type-boolean": { accepted: ["True"], correctFeedback: "Correct. Python booleans are written True and False with capital first letters.", incorrectFeedback: "Use Python's yes-like boolean value with a capital first letter." },
  "type-float-code": { accepted: ["temperature=24.5"], correctFeedback: "Great. A decimal number like 24.5 is a float.", incorrectFeedback: "Use temperature = followed by the decimal number 24.5." },
  "operator-add": { accepted: ["8"], correctFeedback: "Correct. The + operator adds 5 and 3.", incorrectFeedback: "Treat + as normal addition here." },
  "operator-compare": { accepted: ["True"], correctFeedback: "Correct. 7 really is greater than 4.", incorrectFeedback: "Ask whether the number on the left is greater than the number on the right." },
  "operator-multiply": { accepted: ["*"], correctFeedback: "Correct. Python uses * for multiplication.", incorrectFeedback: "Python uses an asterisk for multiplication." },
  "operator-code": { accepted: ["total=6*4"], correctFeedback: "Nice. You combined assignment and multiplication correctly.", incorrectFeedback: "Use the variable name total, = for assignment and * for multiplication." },
  "checkpoint-print": { accepted: ['print("Ready")'], correctFeedback: "Checkpoint point earned — print() displays the string.", incorrectFeedback: "Choose Python's built-in output function." },
  "checkpoint-variable": { accepted: ["score = 12"], correctFeedback: "Correct. That assignment stores 12 in score.", incorrectFeedback: "Remember the pattern variable_name = value." },
  "checkpoint-type": { accepted: ["Float"], correctFeedback: "Correct. A decimal numeric value is a float.", incorrectFeedback: "The decimal point is the clue." },
  "checkpoint-operator": { accepted: ["7"], correctFeedback: "Correct. 10 minus 3 is 7.", incorrectFeedback: "Evaluate the subtraction normally." },
  "checkpoint-code": { accepted: ["score=12\nprint(score)"], correctFeedback: "Checkpoint cleared. You assigned a value and then used it.", incorrectFeedback: "Use two lines: first assign 12 to score, then print(score)." },
};

function normalize(value: string) {
  return value.trim().replace(/\r\n/g, "\n").replace(/[ \t]+/g, "").replace(/;$/, "");
}

export function checkAnswer(exerciseId: string, rawAnswer: string) {
  const rule = rules[exerciseId];
  if (!rule) return null;

  const normalized = normalize(rawAnswer);
  const correct = rule.accepted.some((answer) => normalize(answer) === normalized);

  return {
    correct,
    feedback: correct ? rule.correctFeedback : rule.incorrectFeedback,
  };
}
