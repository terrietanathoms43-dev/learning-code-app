export type CoachMode = "hint" | "explain" | "example" | "ask";

type CoachFallback = {
  hint: string;
  explain: string;
  example: string;
};

type ExerciseContext = {
  type?: "choice" | "text" | "code" | "order" | "debug";
  prompt?: string;
};

const fallbacks: Record<string, CoachFallback> = {
  "fund-algorithms": { hint: "The concept matters more than the punctuation of any single programming language.", explain: "An algorithm is a clear, finite sequence of steps for solving a problem. Identify the input, decide which actions are needed, and specify the output. This logic can be translated into any programming language.", example: "INPUT first number\nINPUT second number\nADD the numbers\nDISPLAY the total" },
  "fund-programming": { hint: "The concept matters more than the punctuation of any single programming language.", explain: "Programming is creating precise instructions for a computer. A program can take input, process the input and produce output. Pseudocode is a readable planning tool, not code that depends on a particular platform.", example: "INPUT name\nDISPLAY name" },
  "fund-variables": { hint: "The concept matters more than the punctuation of any single programming language.", explain: "A variable gives a value a name so it can be used again. Values can change while an algorithm runs. We use SET name TO value as pseudocode; actual programming languages may use other syntax.", example: "SET score TO 5\nSET score TO score + 2\nDISPLAY score" },
  "fund-types": { hint: "The concept matters more than the punctuation of any single programming language.", explain: "Data types describe the kind of information in a value. Common types include string (text), integer (whole number), decimal number and Boolean (true or false). Languages can use different names and conventions for these types.", example: "SET name TO \"Amara\"\nSET age TO 15\nSET ready TO TRUE" },
  "fund-operators": { hint: "The concept matters more than the punctuation of any single programming language.", explain: "Operators perform actions such as addition, multiplication and comparison. Expressions combine operators and values to produce a result. Follow ordinary mathematical order of operations unless grouping changes it.", example: "SET total TO 8 + 4\nSET enough TO total >= 10\nDISPLAY enough" },
  "fund-conditions": { hint: "The concept matters more than the punctuation of any single programming language.", explain: "Conditions test whether a statement is true. IF follows one set of steps when the condition succeeds; ELSE handles the alternative. The exact punctuation differs across languages, but the decision logic stays the same.", example: "IF temperature > 28 THEN\n  DISPLAY \"Warm\"\nELSE\n  DISPLAY \"Cool\"\nEND IF" },
  "fund-loops": { hint: "The concept matters more than the punctuation of any single programming language.", explain: "A loop repeats work. Count-controlled loops repeat a known number of times; condition-controlled loops repeat while a test remains true. Every loop should have a sensible way to stop.", example: "REPEAT 3 TIMES\n  DISPLAY \"Hello\"\nEND REPEAT" },
  "fund-functions": { hint: "The concept matters more than the punctuation of any single programming language.", explain: "A function is a named, reusable group of steps. Functions can accept parameters as inputs and RETURN a result. The names and symbols vary, but the concept carries across programming languages.", example: "FUNCTION double(number)\n  RETURN number * 2\nEND FUNCTION\nDISPLAY double(4)" },
  "fund-lists": { hint: "The concept matters more than the punctuation of any single programming language.", explain: "An array or list stores a collection of items under one name. A loop can visit each item. Index positions are language-dependent, so this example uses FOR EACH rather than an indexing rule.", example: "SET colors TO [blue, gold, violet]\nFOR EACH color IN colors\n  DISPLAY color\nEND FOR" },
  "fund-mini-project": { hint: "You can translate this algorithm into a language after planning the logic.", explain: "Combine your new skills without relying on a particular language. Plan a score counter: start at zero, check each answer, add one for every correct answer, and display the final score.", example: "SET score TO 0\nFOR EACH answer IN answers\n  IF answer IS correct THEN\n    SET score TO score + 1\n  END IF\nEND FOR\nDISPLAY score" },

  "hello-world": {
    hint: "Look for Python's built-in function that displays text. It uses parentheses around what you want to show.",
    explain: "Python displays values with the print function. A function call uses its name followed by parentheses containing the value you want it to work with.",
    example: 'A similar example is: print("Welcome!")',
  },
  variables: {
    hint: "A variable stores a value using the pattern name = value.",
    explain: "A variable gives a value a reusable name. Python assigns the value on the right side of = to the name on the left.",
    example: "A similar example is: lives = 3",
  },
  "data-types": {
    hint: "Look at the form of the value: quoted text, a whole number, a decimal, or True/False.",
    explain: "Python values have data types. Common beginner types are strings for text, integers for whole numbers, floats for decimals, and booleans for True or False.",
    example: 'Examples: name = "Maya", age = 16, temperature = 24.5, ready = True',
  },
  operators: {
    hint: "Focus on the operator symbol and what it does to the values on each side.",
    explain: "Operators combine or compare values. Arithmetic operators calculate results, while comparison operators produce True or False.",
    example: "A similar example is: total = 4 + 2",
  },
  "checkpoint-1": {
    hint: "Break the question into the skill it is testing: output, variables, data types, or operators.",
    explain: "This checkpoint mixes the Python basics you already practiced. Identify the skill first, then apply the same pattern from that lesson.",
    example: 'A similar mixed example is: points = 5\nprint(points)',
  },
  conditions: {
    hint: "An if statement checks a condition, ends the condition line with a colon, and indents the code that should run.",
    explain: "Conditions let Python decide whether code should run. An if block runs when its comparison is True, and an else block can handle the other case.",
    example: 'A similar example is: if lives > 0:\n    print("Continue")',
  },
  loops: {
    hint: "Use a loop when the same action needs to repeat for several values.",
    explain: "Loops repeat code. A for loop visits values in a sequence, while a while loop repeats as long as its condition stays True.",
    example: "A similar example is: for i in range(2):\n    print(i)",
  },
  functions: {
    hint: "A function starts with def, can receive parameters, and can send a result back with return.",
    explain: "Functions package reusable logic under a name. Parameters bring values into the function, and return sends a result back to the caller.",
    example: "A similar example is: def double(number):\n    return number * 2",
  },
  "mini-project": {
    hint: "Solve one small part at a time: store the score, check an answer, repeat rounds, update the score, then print the result.",
    explain: "The mini project combines the earlier concepts into one flow: variables hold state, functions organize logic, conditions decide, and loops repeat work.",
    example: 'A similar pattern is: def is_ready(value):\n    return value == "yes"',
  },
  "web-html-basics": {
    hint: "Think about the HTML tag that matches the kind of content you are creating, then remember that most tags have an opening and closing form.",
    explain: "HTML gives a page structure. Elements use tags such as headings, paragraphs and buttons to describe what each piece of content means.",
    example: "A similar example is: <p>Welcome to my page</p>",
  },
  "web-css-basics": {
    hint: "CSS follows the pattern selector { property: value; }. Check each of those three parts.",
    explain: "CSS selects HTML elements and gives them visual rules. Inside braces, each declaration uses a property, a colon, a value and usually a semicolon.",
    example: "A similar example is: p { color: green; }",
  },
  "web-js-basics": {
    hint: "Look for the JavaScript pattern that creates a value first, then use console.log when you want to inspect it.",
    explain: "JavaScript adds behavior to web pages. Variables store values, and functions such as console.log() let you perform actions with those values.",
    example: 'A similar example is: const greeting = "Hi";\nconsole.log(greeting);',
  },
  "web-mini-project": {
    hint: "Separate the job by language: HTML creates the content, CSS styles it, and JavaScript adds behavior or logic.",
    explain: "A web page combines three layers: HTML for structure, CSS for appearance and JavaScript for behavior. Build and test one layer at a time.",
    example: "A similar tiny project could use <button>Go</button>, style button in CSS, then log a message with JavaScript.",
  },
};

function getExerciseNudge(context?: ExerciseContext) {
  if (!context) return "";

  const promptLead = context.prompt
    ? `For this challenge, focus on what the prompt is asking you to produce: "${context.prompt}"`
    : "Focus on the exact output or syntax the challenge is asking for.";

  switch (context.type) {
    case "choice":
      return `${promptLead} Eliminate options that use the wrong language syntax before comparing the remaining choices.`;
    case "text":
      return `${promptLead} Look at the code around the blank and decide whether the missing piece should be a keyword, name, method, tag, or operator.`;
    case "code":
      return `${promptLead} Build the answer in small pieces: identify the required name/value or structure first, then check punctuation and line order.`;
    case "order":
      return `${promptLead} Start with the line that opens the structure, then place each indented action directly under the line it belongs to.`;
    case "debug":
      return `${promptLead} Compare the buggy line with the language's normal syntax and inspect punctuation, indentation, brackets, and spelling one at a time.`;
    default:
      return promptLead;
  }
}

export function getCoachFallback(
  lessonSlug: string,
  mode: CoachMode,
  context?: ExerciseContext,
) {
  const lessonFallback =
    fallbacks[lessonSlug] ??
    ({
      hint: "Focus on the coding pattern this exercise is testing and compare it with the examples in the lesson.",
      explain: "Break the coding task into its smallest parts, then check the syntax and what each part is meant to do.",
      example: "Try a smaller example that uses the same coding idea without copying the exercise.",
    } satisfies CoachFallback);

  const nudge = getExerciseNudge(context);

  if (mode === "hint") {
    return [nudge, lessonFallback.hint].filter(Boolean).join(" ");
  }

  if (mode === "ask") {
    return [
      "The live AI tutor is unavailable right now, but here is the most useful built-in guidance I can give:",
      nudge,
      lessonFallback.explain,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return lessonFallback[mode];
}
