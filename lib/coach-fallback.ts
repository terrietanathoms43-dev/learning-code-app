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
