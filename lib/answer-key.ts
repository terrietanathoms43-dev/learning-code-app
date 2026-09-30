type AnswerRule = {
  accepted: string[];
  correctFeedback: string;
  incorrectFeedback: string;
};

const rules: Record<string, AnswerRule> = {
  "hello-print-choice": {
    accepted: ['print("Hello, coder!")'],
    correctFeedback: "Exactly. print() is Python's standard way to display a value.",
    incorrectFeedback: "Look for Python's built-in function that prints text to the screen.",
  },
  "hello-fill-print": {
    accepted: ["print"],
    correctFeedback: "Correct — print is the function name.",
    incorrectFeedback: "You used this function in the previous question. It starts with p.",
  },
  "hello-output": {
    accepted: ["Python is fun"],
    correctFeedback: "Right. The quotation marks define the string; they are not printed.",
    incorrectFeedback: "Python displays the text inside the quotation marks.",
  },
  "variable-create": {
    accepted: ["score = 10"],
    correctFeedback: "Yes. The name goes on the left and the stored value goes on the right.",
    incorrectFeedback: "Remember: variable_name = value.",
  },
  "variable-name": {
    accepted: ["lives"],
    correctFeedback: "Perfect. lives now labels the value 7.",
    incorrectFeedback: "The prompt asks for the variable name only.",
  },
  "variable-output": {
    accepted: ["7"],
    correctFeedback: "Correct. points starts at 4, then 3 is added and stored back into points.",
    incorrectFeedback: "Follow the variable one line at a time: start at 4, then add 3.",
  },
  "variable-code": {
    accepted: ['language="Python"', "language='Python'"],
    correctFeedback: "Nice. You created a variable and stored a string in it.",
    incorrectFeedback: 'Use the pattern name = "text" and keep the variable name language.',
  },
};

function normalize(value: string) {
  return value.trim().replace(/\s+/g, "").replace(/;$/, "");
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
