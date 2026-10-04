type AnswerRule = {
  accepted: string[];
  correctFeedback: string;
  incorrectFeedback: string;
  indentPattern?: number[];
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
  "condition-syntax": {
    accepted: ["if score > 10:"],
    correctFeedback: "Correct. Python conditions end the if line with a colon.",
    incorrectFeedback: "Look for Python's if keyword and the colon at the end.",
  },
  "condition-output": {
    accepted: ["Warm"],
    correctFeedback: "Correct. 30 is greater than 25, so the indented print line runs.",
    incorrectFeedback: "Check whether 30 makes the condition temperature > 25 true.",
  },
  "condition-else": {
    accepted: ["else"],
    correctFeedback: "Right. else handles the case where the if condition is false.",
    incorrectFeedback: "Use the keyword that means otherwise.",
  },
  "condition-code": {
    accepted: ['if score >= 10:\nprint("Ready")', "if score >= 10:\nprint('Ready')"],
    indentPattern: [0, 1],
    correctFeedback: "Nice. Your condition includes the comparison, colon and indented action.",
    incorrectFeedback: "Use if score >= 10: on the first line, then print Ready on the next line.",
  },
  "condition-order": {
    accepted: [
      'if score >= 10:\nprint("Ready")\nelse:\nprint("Keep trying")',
      "if score >= 10:\nprint('Ready')\nelse:\nprint('Keep trying')",
    ],
    indentPattern: [0, 1, 0, 1],
    correctFeedback: "Perfect. The if block comes first, followed by the else block, with both actions indented.",
    incorrectFeedback: "Start with the if line, place its indented action next, then else and its indented action.",
  },
  "loop-range-output": {
    accepted: ["0, 1, 2"],
    correctFeedback: "Correct. range(3) starts at 0 and stops before 3.",
    incorrectFeedback: "Remember that range(3) produces 0, 1 and 2.",
  },
  "loop-for-keyword": {
    accepted: ["for"],
    correctFeedback: "Correct. for repeats once for each item in the collection.",
    incorrectFeedback: "Use Python's loop keyword for visiting each item.",
  },
  "loop-while-syntax": {
    accepted: ["while lives > 0:"],
    correctFeedback: "Correct. A while loop also ends its condition line with a colon.",
    incorrectFeedback: "Look for the while keyword and a colon after the condition.",
  },
  "loop-code": {
    accepted: ["for number in range(1, 4):\nprint(number)"],
    indentPattern: [0, 1],
    correctFeedback: "Great. range(1, 4) produces 1, 2 and 3.",
    incorrectFeedback: "Use range(1, 4), then print the loop variable on the next line.",
  },
  "loop-debug": {
    accepted: ["for number in range(1, 4):\nprint(number)"],
    indentPattern: [0, 1],
    correctFeedback: "Bug fixed. The loop line has its colon and the repeated action is indented.",
    incorrectFeedback: "Check two things: the for line needs a colon, and print(number) must be indented inside the loop.",
  },
  "function-def": {
    accepted: ["def greet():"],
    correctFeedback: "Correct. Python uses def, parentheses and a colon to define a function.",
    incorrectFeedback: "Python function definitions begin with def and end the first line with a colon.",
  },
  "function-parameter-output": {
    accepted: ["Maya"],
    correctFeedback: "Correct. Maya is passed into the name parameter and then printed.",
    incorrectFeedback: "Follow the value passed into greet and see what name becomes.",
  },
  "function-return": {
    accepted: ["return"],
    correctFeedback: "Correct. return sends a value back to the code that called the function.",
    incorrectFeedback: "Use the keyword that gives a result back to the caller.",
  },
  "function-code": {
    accepted: ["def square(number):\nreturn number * number"],
    indentPattern: [0, 1],
    correctFeedback: "Excellent. The function accepts a number and returns its square.",
    incorrectFeedback: "Define square(number), then return number * number on the next line.",
  },
  "project-score-start": {
    accepted: ["score = 0"],
    correctFeedback: "Correct. The project now has a score counter starting at zero.",
    incorrectFeedback: "Use a normal variable assignment with score on the left and 0 on the right.",
  },
  "project-check-function": {
    accepted: [
      'def check_answer(answer):\nif answer == "Python":\nreturn True\nreturn False',
      "def check_answer(answer):\nif answer == 'Python':\nreturn True\nreturn False",
    ],
    indentPattern: [0, 1, 2, 1],
    correctFeedback: "Great. Your function checks the answer and returns a boolean result.",
    incorrectFeedback: "Define check_answer(answer), test whether answer equals Python, then return True or False with correct indentation.",
  },
  "project-rounds": {
    accepted: ["1, 2, 3"],
    correctFeedback: "Correct. range(1, 4) includes 1, 2 and 3 but stops before 4.",
    incorrectFeedback: "Remember that the end value in range is not included.",
  },
  "project-score-update": {
    accepted: [
      'if check_answer("Python"):\nscore = score + 1',
      "if check_answer('Python'):\nscore = score + 1",
    ],
    indentPattern: [0, 1],
    correctFeedback: "Nice. A correct answer now increases the score by one.",
    incorrectFeedback: "Check the function result with if, then indent score = score + 1.",
  },
  "project-final-output": {
    accepted: ["print(score)"],
    correctFeedback: "Project finished. The final score is displayed with print().",
    incorrectFeedback: "Print the score variable directly.",
  },
  "web-html-heading": {
    accepted: ["<h1>Hello</h1>"],
    correctFeedback: "Correct. h1 is the page's main heading level.",
    incorrectFeedback: "Look for the heading tag with the largest heading level.",
  },
  "web-html-paragraph": {
    accepted: ["p"],
    correctFeedback: "Correct. The p tag creates a paragraph.",
    incorrectFeedback: "HTML uses a one-letter tag name for a paragraph.",
  },
  "web-html-code": {
    accepted: ["<h2>Welcome</h2>"],
    correctFeedback: "Nice. You opened and closed an h2 around the heading text.",
    incorrectFeedback: "Use an opening h2 tag, the word Welcome, then a closing h2 tag.",
  },
  "web-css-color": {
    accepted: ["color"],
    correctFeedback: "Correct. The color property changes text color.",
    incorrectFeedback: "Choose the property specifically used for foreground text color.",
  },
  "web-css-selector": {
    accepted: ["h1"],
    correctFeedback: "Correct. The h1 selector targets every h1 element.",
    incorrectFeedback: "Use the element name itself as the selector.",
  },
  "web-css-debug": {
    accepted: ["h1 {\ncolor: blue;\n}", "h1 {\ncolor: blue\n}"],
    correctFeedback: "Bug fixed. CSS properties use a colon between the property and value.",
    incorrectFeedback: "Keep the h1 rule, then write color: blue inside the braces.",
  },
  "web-js-variable": {
    accepted: ["let score = 5;"],
    correctFeedback: "Correct. let creates a JavaScript variable and = assigns its value.",
    incorrectFeedback: "Look for let followed by the variable name and an assignment.",
  },
  "web-js-console": {
    accepted: ["log"],
    correctFeedback: "Correct. console.log() writes a value to the developer console.",
    incorrectFeedback: "The method name is the same word used when developers say they log a value.",
  },
  "web-js-code": {
    accepted: [
      'const name = "Ada";\nconsole.log(name)',
      "const name = 'Ada';\nconsole.log(name)",
      'const name = "Ada"\nconsole.log(name)',
      "const name = 'Ada'\nconsole.log(name)",
    ],
    correctFeedback: "Great. You created a constant and logged its stored value.",
    incorrectFeedback: "Create const name with the text Ada, then call console.log(name) on the next line.",
  },
  "web-project-html": {
    accepted: ["<button>Start</button>"],
    correctFeedback: "Great. Your page now has a button with visible text.",
    incorrectFeedback: "Wrap the word Start between opening and closing button tags.",
  },
  "web-project-css": {
    accepted: [
      "button {\nbackground: blue;\n}",
      "button {\nbackground: blue\n}",
      "button {\nbackground-color: blue;\n}",
      "button {\nbackground-color: blue\n}",
    ],
    correctFeedback: "Nice. The button now has a blue background rule.",
    incorrectFeedback: "Target button, then set its background or background-color to blue inside braces.",
  },
  "web-project-js": {
    accepted: [
      'const message = "Ready";\nconsole.log(message)',
      "const message = 'Ready';\nconsole.log(message)",
      'const message = "Ready"\nconsole.log(message)',
      "const message = 'Ready'\nconsole.log(message)",
    ],
    correctFeedback: "Project logic complete. You stored Ready and logged the variable.",
    incorrectFeedback: "Create const message with Ready, then log message on the next line.",
  },
};

const punctuation = new Set(["(", ")", "[", "]", "{", "}", ":", ",", "=", ">", "<", "+", "-", "*", "/", "%"]);

function normalizeCodeLine(line: string) {
  const input = line.trim();
  let result = "";
  let quote: "'" | '"' | null = null;
  let escaped = false;
  let pendingSpace = false;

  for (const character of input) {
    if (quote) {
      result += character;

      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }

      continue;
    }

    if (character === "'" || character === '"') {
      if (pendingSpace && result && !punctuation.has(result.at(-1) ?? "")) {
        result += " ";
      }
      pendingSpace = false;
      quote = character;
      result += character;
      continue;
    }

    if (/\s/.test(character)) {
      pendingSpace = true;
      continue;
    }

    if (punctuation.has(character)) {
      result = result.trimEnd();
      result += character;
      pendingSpace = false;
      continue;
    }

    if (pendingSpace && result && !punctuation.has(result.at(-1) ?? "")) {
      result += " ";
    }

    pendingSpace = false;
    result += character;
  }

  return result.trim();
}

function normalize(value: string) {
  const normalized = value.trim().replace(/\r\n?/g, "\n").replace(/;$/, "");
  return normalized
    .split("\n")
    .map((line) => normalizeCodeLine(line))
    .join("\n");
}

function indentationWidth(line: string) {
  const indentation = line.match(/^[ \t]*/)?.[0] ?? "";
  return [...indentation].reduce(
    (width, character) => width + (character === "\t" ? 4 : 1),
    0,
  );
}

function hasValidIndentPattern(value: string, pattern: number[] = []) {
  if (!pattern.length) return true;

  const lines = value.replace(/\r\n/g, "\n").trim().split("\n");
  if (lines.length < pattern.length) return false;

  const widthsByLevel = new Map<number, number>();

  for (let index = 0; index < pattern.length; index += 1) {
    const level = pattern[index];
    const width = indentationWidth(lines[index] ?? "");

    if (level === 0) {
      if (width !== 0) return false;
      widthsByLevel.set(0, 0);
      continue;
    }

    const existingWidth = widthsByLevel.get(level);
    if (existingWidth !== undefined) {
      if (width !== existingWidth) return false;
      continue;
    }

    const parentWidth = widthsByLevel.get(level - 1);
    if (parentWidth === undefined || width <= parentWidth) return false;

    widthsByLevel.set(level, width);
  }

  return true;
}

export function checkAnswer(exerciseId: string, rawAnswer: string) {
  const rule = rules[exerciseId];
  if (!rule) return null;

  const normalized = normalize(rawAnswer);
  const matchesAccepted = rule.accepted.some((answer) => normalize(answer) === normalized);
  const correct =
    matchesAccepted && hasValidIndentPattern(rawAnswer, rule.indentPattern);

  return {
    correct,
    feedback: correct ? rule.correctFeedback : rule.incorrectFeedback,
  };
}
