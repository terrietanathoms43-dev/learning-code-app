export type Exercise = {
  id: string;
  type: "choice" | "text" | "code" | "order" | "debug";
  eyebrow: string;
  prompt: string;
  code?: string;
  options?: string[];
  placeholder?: string;
};

export type Lesson = {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  xp: number;
  duration: string;
  exercises: Exercise[];
  overview?: string;
  example?: string;
  takeaway?: string;
};

export type PathNode = {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  kind: "lesson" | "checkpoint" | "project";
  status: "completed" | "current" | "locked";
  xp: number;
};

export const pythonPath: PathNode[] = [
  { slug: "hello-world", title: "Hello, Python!", subtitle: "Meet your first line of code", icon: "👋", kind: "lesson", status: "current", xp: 20 },
  { slug: "variables", title: "Variables", subtitle: "Give your data a name", icon: "📦", kind: "lesson", status: "locked", xp: 25 },
  { slug: "data-types", title: "Data Types", subtitle: "Strings, numbers and booleans", icon: "🧩", kind: "lesson", status: "locked", xp: 25 },
  { slug: "operators", title: "Operators", subtitle: "Make values work together", icon: "➕", kind: "lesson", status: "locked", xp: 30 },
  { slug: "checkpoint-1", title: "Trail Checkpoint", subtitle: "Prove what you remember", icon: "⭐", kind: "checkpoint", status: "locked", xp: 50 },
  { slug: "conditions", title: "Conditions", subtitle: "Teach code how to decide", icon: "🔀", kind: "lesson", status: "locked", xp: 30 },
  { slug: "loops", title: "Loops", subtitle: "Repeat without repeating yourself", icon: "🔁", kind: "lesson", status: "locked", xp: 35 },
  { slug: "functions", title: "Functions", subtitle: "Build reusable blocks", icon: "🛠️", kind: "lesson", status: "locked", xp: 40 },
  { slug: "mini-project", title: "Mini Project", subtitle: "Build a tiny quiz game", icon: "🚀", kind: "project", status: "locked", xp: 100 },
];

export const webPath: PathNode[] = [
  { slug: "web-html-basics", title: "HTML Basics", subtitle: "Build the structure of a page", icon: "🏗️", kind: "lesson", status: "current", xp: 25 },
  { slug: "web-css-basics", title: "CSS Basics", subtitle: "Style what you built", icon: "🎨", kind: "lesson", status: "locked", xp: 30 },
  { slug: "web-js-basics", title: "JavaScript Basics", subtitle: "Make pages react", icon: "⚡", kind: "lesson", status: "locked", xp: 35 },
  { slug: "web-mini-project", title: "Mini Web Project", subtitle: "Put HTML, CSS and JS together", icon: "🌐", kind: "project", status: "locked", xp: 80 },
];

export const javascriptPath: PathNode[] = [
  { slug: "js-variables", title: "Values & Variables", subtitle: "Store values and print them", icon: "⚡", kind: "lesson", status: "current", xp: 25 },
  { slug: "js-types", title: "Types & Operators", subtitle: "Work with values safely", icon: "🔢", kind: "lesson", status: "locked", xp: 30 },
  { slug: "js-conditions", title: "Decisions", subtitle: "Make code choose a path", icon: "🔀", kind: "lesson", status: "locked", xp: 35 },
  { slug: "js-arrays-loops", title: "Arrays & Loops", subtitle: "Store lists and repeat work", icon: "🔁", kind: "lesson", status: "locked", xp: 40 },
  { slug: "js-functions", title: "Functions", subtitle: "Create reusable JavaScript", icon: "🧰", kind: "lesson", status: "locked", xp: 45 },
  { slug: "js-mini-project", title: "Score Tracker", subtitle: "Build a tiny score calculator", icon: "🚀", kind: "project", status: "locked", xp: 90 },
];

export const fundamentalsPath: PathNode[] = [
  {
    "slug": "fund-algorithms",
    "title": "Algorithmic Thinking",
    "subtitle": "Solve problems with clear steps",
    "icon": "🧭",
    "kind": "lesson",
    "status": "current",
    "xp": 30
  },
  {
    "slug": "fund-programming",
    "title": "Introduction to Programming",
    "subtitle": "Discover input, processing and output",
    "icon": "💡",
    "kind": "lesson",
    "status": "locked",
    "xp": 30
  },
  {
    "slug": "fund-variables",
    "title": "Variables",
    "subtitle": "Store and update named values",
    "icon": "📦",
    "kind": "lesson",
    "status": "locked",
    "xp": 30
  },
  {
    "slug": "fund-types",
    "title": "Data Types",
    "subtitle": "Distinguish text, numbers and booleans",
    "icon": "🧩",
    "kind": "lesson",
    "status": "locked",
    "xp": 30
  },
  {
    "slug": "fund-operators",
    "title": "Operators & Expressions",
    "subtitle": "Calculate and compare",
    "icon": "➕",
    "kind": "lesson",
    "status": "locked",
    "xp": 30
  },
  {
    "slug": "fund-conditions",
    "title": "Conditional Decisions",
    "subtitle": "Choose between IF and ELSE",
    "icon": "🔀",
    "kind": "lesson",
    "status": "locked",
    "xp": 35
  },
  {
    "slug": "fund-loops",
    "title": "Loops & Repetition",
    "subtitle": "Repeat instructions safely",
    "icon": "🔁",
    "kind": "lesson",
    "status": "locked",
    "xp": 35
  },
  {
    "slug": "fund-functions",
    "title": "Functions",
    "subtitle": "Reuse a set of instructions",
    "icon": "🛠️",
    "kind": "lesson",
    "status": "locked",
    "xp": 40
  },
  {
    "slug": "fund-lists",
    "title": "Arrays & Lists",
    "subtitle": "Store and process collections",
    "icon": "🗂️",
    "kind": "lesson",
    "status": "locked",
    "xp": 40
  },
  {
    "slug": "fund-mini-project",
    "title": "Final Logic Challenge",
    "subtitle": "Design a score counter in pseudocode",
    "icon": "🚀",
    "kind": "project",
    "status": "locked",
    "xp": 90
  }
];
export const fundamentalsLessonSlugs = fundamentalsPath.map((node) => node.slug);

export const pythonLessonSlugs = pythonPath.map((node) => node.slug);
export const webLessonSlugs = webPath.map((node) => node.slug);
export const javascriptLessonSlugs = javascriptPath.map((node) => node.slug);
export const guestAccessibleLessonSlugs = [
  fundamentalsLessonSlugs[0],
  pythonLessonSlugs[0],
  webLessonSlugs[0],
  javascriptLessonSlugs[0],
];

export const lessons: Record<string, Lesson> = {
  "hello-world": {
    slug: "hello-world", title: "Hello, Python!", subtitle: "Learn how Python displays information.", icon: "👋", xp: 20, duration: "4 min",
    exercises: [
      { id: "hello-print-choice", type: "choice", eyebrow: "Pick the code", prompt: "Which line tells Python to display Hello, coder!?", options: ['print("Hello, coder!")','show("Hello, coder!")','say("Hello, coder!")','output = "Hello, coder!"'] },
      { id: "hello-fill-print", type: "text", eyebrow: "Fill the blank", prompt: "Complete the function name.", code: '____("I can code!")', placeholder: "Type the missing word" },
      { id: "hello-output", type: "choice", eyebrow: "Predict the output", prompt: "What does this code display?", code: 'print("Python is fun")', options: ["Python is fun", '"Python is fun"', "print", "Nothing"] },
    ],
  },
  variables: {
    slug: "variables", title: "Variables", subtitle: "Store information and give it a useful name.", icon: "📦", xp: 25, duration: "6 min",
    exercises: [
      { id: "variable-create", type: "choice", eyebrow: "Choose the variable", prompt: "Which line creates a variable named score with the value 10?", options: ["score = 10", "10 = score", "score == 10", 'score = "ten"'] },
      { id: "variable-name", type: "text", eyebrow: "Fill the blank", prompt: "Create a variable named lives with the value 7. Type only the missing name.", code: "_____ = 7", placeholder: "Variable name" },
      { id: "variable-output", type: "choice", eyebrow: "Predict the output", prompt: "What will Python display?", code: "points = 4\npoints = points + 3\nprint(points)", options: ["4", "7", "43", "points"] },
      { id: "variable-code", type: "code", eyebrow: "Write code", prompt: "Create a variable named language and store the text Python in it.", placeholder: 'language = "Python"' },
    ],
  },
  "data-types": {
    slug: "data-types", title: "Data Types", subtitle: "Recognize strings, integers, floats and booleans.", icon: "🧩", xp: 25, duration: "6 min",
    exercises: [
      { id: "type-string", type: "choice", eyebrow: "Name the type", prompt: "What data type is the value stored in name?", code: 'name = "Ada"', options: ["String", "Integer", "Boolean", "Float"] },
      { id: "type-integer", type: "choice", eyebrow: "Name the type", prompt: "What data type is 16 in this code?", code: "age = 16", options: ["Integer", "String", "Float", "Boolean"] },
      { id: "type-boolean", type: "text", eyebrow: "Fill the blank", prompt: "Complete the boolean value so is_ready means yes.", code: "is_ready = _____", placeholder: "Boolean value" },
      { id: "type-float-code", type: "code", eyebrow: "Write code", prompt: "Create a variable named temperature and store the decimal number 24.5.", placeholder: "temperature = 24.5" },
    ],
  },
  operators: {
    slug: "operators", title: "Operators", subtitle: "Use arithmetic and comparison operators.", icon: "➕", xp: 30, duration: "7 min",
    exercises: [
      { id: "operator-add", type: "choice", eyebrow: "Predict the result", prompt: "What value is stored in total?", code: "total = 5 + 3", options: ["8", "53", "2", "15"] },
      { id: "operator-compare", type: "choice", eyebrow: "True or false", prompt: "What does this comparison produce?", code: "7 > 4", options: ["True", "False", "7", "4"] },
      { id: "operator-multiply", type: "text", eyebrow: "Fill the operator", prompt: "Which Python operator multiplies two numbers?", code: "6 ___ 4", placeholder: "Operator" },
      { id: "operator-code", type: "code", eyebrow: "Write code", prompt: "Create a variable named total that stores 6 multiplied by 4.", placeholder: "total = 6 * 4" },
    ],
  },
  "checkpoint-1": {
    slug: "checkpoint-1", title: "Trail Checkpoint", subtitle: "Mix the skills you have learned so far.", icon: "⭐", xp: 50, duration: "8 min",
    exercises: [
      { id: "checkpoint-print", type: "choice", eyebrow: "Checkpoint", prompt: "Which line correctly displays the word Ready?", options: ['print("Ready")','display("Ready")','Ready = print','print = "Ready"'] },
      { id: "checkpoint-variable", type: "choice", eyebrow: "Checkpoint", prompt: "Which line stores 12 in a variable named score?", options: ["score = 12", "12 = score", "score == 12", 'score = "12 points"'] },
      { id: "checkpoint-type", type: "choice", eyebrow: "Checkpoint", prompt: "What type of value is 3.5?", options: ["Float", "Integer", "String", "Boolean"] },
      { id: "checkpoint-operator", type: "choice", eyebrow: "Checkpoint", prompt: "What does this expression evaluate to?", code: "10 - 3", options: ["7", "13", "103", "30"] },
      { id: "checkpoint-code", type: "code", eyebrow: "Final challenge", prompt: "Create score with the value 12, then print score on the next line.", placeholder: "score = 12\nprint(score)" },
    ],
  },
  conditions: {
    slug: "conditions",
    title: "Conditions",
    subtitle: "Teach your program how to make decisions.",
    icon: "🔀",
    xp: 30,
    duration: "7 min",
    exercises: [
      {
        id: "condition-syntax",
        type: "choice",
        eyebrow: "Choose the syntax",
        prompt: "Which line starts a valid Python condition?",
        options: ["if score > 10:", "if score > 10", "when score > 10:", "if (score > 10) then"],
      },
      {
        id: "condition-output",
        type: "choice",
        eyebrow: "Predict the output",
        prompt: "What will this code display?",
        code: "temperature = 30\nif temperature > 25:\n    print(\"Warm\")",
        options: ["Warm", "30", "True", "Nothing"],
      },
      {
        id: "condition-else",
        type: "text",
        eyebrow: "Fill the keyword",
        prompt: "Which keyword handles the other case?",
        code: "if lives > 0:\n    print(\"Keep going\")\n____:\n    print(\"Game over\")",
        placeholder: "Python keyword",
      },
      {
        id: "condition-code",
        type: "code",
        eyebrow: "Write code",
        prompt: "Write an if statement that prints Ready when score is at least 10.",
        placeholder: "if score >= 10:\n    print(\"Ready\")",
      },
      {
        id: "condition-order",
        type: "order",
        eyebrow: "Order the code",
        prompt: "Put these lines in the correct order to handle both outcomes.",
        options: [
          '    print("Keep trying")',
          "else:",
          "if score >= 10:",
          '    print("Ready")',
        ],
      },
    ],
  },
  loops: {
    slug: "loops",
    title: "Loops",
    subtitle: "Repeat useful work without copying code.",
    icon: "🔁",
    xp: 35,
    duration: "8 min",
    exercises: [
      {
        id: "loop-range-output",
        type: "choice",
        eyebrow: "Predict the output",
        prompt: "Which sequence is printed?",
        code: "for i in range(3):\n    print(i)",
        options: ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "3, 3, 3"],
      },
      {
        id: "loop-for-keyword",
        type: "text",
        eyebrow: "Fill the keyword",
        prompt: "Complete the loop keyword.",
        code: "____ item in items:\n    print(item)",
        placeholder: "Loop keyword",
      },
      {
        id: "loop-while-syntax",
        type: "choice",
        eyebrow: "Choose the loop",
        prompt: "Which line starts a valid while loop?",
        options: ["while lives > 0:", "while lives > 0", "loop lives > 0:", "while (lives > 0) then"],
      },
      {
        id: "loop-code",
        type: "code",
        eyebrow: "Write code",
        prompt: "Write a loop that prints the numbers 1, 2 and 3 using range.",
        placeholder: "for number in range(1, 4):\n    print(number)",
      },
      {
        id: "loop-debug",
        type: "debug",
        eyebrow: "Fix the bug",
        prompt: "Repair this loop so it runs correctly.",
        code: "for number in range(1, 4)\nprint(number)",
        placeholder: "Rewrite the corrected loop",
      },
    ],
  },
  functions: {
    slug: "functions",
    title: "Functions",
    subtitle: "Package code into reusable building blocks.",
    icon: "🛠️",
    xp: 40,
    duration: "9 min",
    exercises: [
      {
        id: "function-def",
        type: "choice",
        eyebrow: "Choose the function",
        prompt: "Which line correctly defines a function named greet?",
        options: ["def greet():", "function greet():", "def greet", "greet = function()"],
      },
      {
        id: "function-parameter-output",
        type: "choice",
        eyebrow: "Predict the output",
        prompt: "What will this display?",
        code: "def greet(name):\n    print(name)\n\ngreet(\"Maya\")",
        options: ["Maya", "name", "greet", "Nothing"],
      },
      {
        id: "function-return",
        type: "text",
        eyebrow: "Fill the keyword",
        prompt: "Which keyword sends a value back from a function?",
        code: "def double(number):\n    ____ number * 2",
        placeholder: "Python keyword",
      },
      {
        id: "function-code",
        type: "code",
        eyebrow: "Write code",
        prompt: "Write a function named square that returns number multiplied by itself.",
        placeholder: "def square(number):\n    return number * number",
      },
    ],
  },
  "mini-project": {
    slug: "mini-project",
    title: "Mini Project",
    subtitle: "Build the logic for a tiny Python quiz checker.",
    icon: "🚀",
    xp: 100,
    duration: "12 min",
    exercises: [
      {
        id: "project-score-start",
        type: "choice",
        eyebrow: "Project setup",
        prompt: "Which line correctly starts the player's score at zero?",
        options: ["score = 0", "0 = score", "score == 0", 'score = "zero"'],
      },
      {
        id: "project-check-function",
        type: "code",
        eyebrow: "Build the checker",
        prompt: "Write a function named check_answer that returns True when answer equals Python, otherwise False.",
        placeholder:
          'def check_answer(answer):\n    if answer == "Python":\n        return True\n    return False',
      },
      {
        id: "project-rounds",
        type: "choice",
        eyebrow: "Add rounds",
        prompt: "Which values will this loop display?",
        code: "for round_number in range(1, 4):\n    print(round_number)",
        options: ["1, 2, 3", "0, 1, 2", "1, 2, 3, 4", "4"],
      },
      {
        id: "project-score-update",
        type: "code",
        eyebrow: "Update the score",
        prompt: "If check_answer returns True, add 1 to score.",
        placeholder:
          'if check_answer("Python"):\n    score = score + 1',
      },
      {
        id: "project-final-output",
        type: "code",
        eyebrow: "Finish the project",
        prompt: "Print the final score using the score variable.",
        placeholder: "print(score)",
      },
    ],
  },
  "web-html-basics": {
    slug: "web-html-basics",
    title: "HTML Basics",
    subtitle: "Learn the tags that give a web page its structure.",
    icon: "🏗️",
    xp: 25,
    duration: "6 min",
    exercises: [
      {
        id: "web-html-heading",
        type: "choice",
        eyebrow: "Choose the tag",
        prompt: "Which HTML creates a main heading that says Hello?",
        options: ["<h1>Hello</h1>", "<p>Hello</p>", "<title>Hello</title>", "<heading>Hello</heading>"],
      },
      {
        id: "web-html-paragraph",
        type: "text",
        eyebrow: "Fill the tag",
        prompt: "Which tag name creates a paragraph? Type only the tag name.",
        code: "<____>Welcome to my page</____>",
        placeholder: "Tag name",
      },
      {
        id: "web-html-code",
        type: "code",
        eyebrow: "Write HTML",
        prompt: "Create an h2 heading containing the text Welcome.",
        placeholder: "<h2>Welcome</h2>",
      },
    ],
  },
  "web-css-basics": {
    slug: "web-css-basics",
    title: "CSS Basics",
    subtitle: "Use selectors and properties to style a page.",
    icon: "🎨",
    xp: 30,
    duration: "7 min",
    exercises: [
      {
        id: "web-css-color",
        type: "choice",
        eyebrow: "Choose the property",
        prompt: "Which CSS property changes text color?",
        options: ["color", "background", "font-style", "text-value"],
      },
      {
        id: "web-css-selector",
        type: "text",
        eyebrow: "Name the selector",
        prompt: "Which selector targets every h1 element? Type only the selector.",
        code: "____ {\n  color: blue;\n}",
        placeholder: "Selector",
      },
      {
        id: "web-css-debug",
        type: "debug",
        eyebrow: "Fix the CSS",
        prompt: "Repair this rule so the heading becomes blue.",
        code: "h1 {\n  color blue\n}",
        placeholder: "h1 {\n  color: blue;\n}",
      },
    ],
  },
  "web-js-basics": {
    slug: "web-js-basics",
    title: "JavaScript Basics",
    subtitle: "Store values and send output from the browser language.",
    icon: "⚡",
    xp: 35,
    duration: "7 min",
    exercises: [
      {
        id: "web-js-variable",
        type: "choice",
        eyebrow: "Choose the variable",
        prompt: "Which line creates a JavaScript variable named score with the value 5?",
        options: ["let score = 5;", "score == 5;", "5 = score;", "variable score = 5;"],
      },
      {
        id: "web-js-console",
        type: "text",
        eyebrow: "Fill the method",
        prompt: "Complete the browser-console output method.",
        code: "console.____(\"Hello\");",
        placeholder: "Method name",
      },
      {
        id: "web-js-code",
        type: "code",
        eyebrow: "Write JavaScript",
        prompt: "Create a constant named name with the text Ada, then log name.",
        placeholder: "const name = \"Ada\";\nconsole.log(name);",
      },
    ],
  },
  "web-mini-project": {
    slug: "web-mini-project",
    title: "Mini Web Project",
    subtitle: "Combine the three web languages into a tiny page.",
    icon: "🌐",
    xp: 80,
    duration: "10 min",
    exercises: [
      {
        id: "web-project-html",
        type: "code",
        eyebrow: "Build the content",
        prompt: "Create a button whose visible text is Start.",
        placeholder: "<button>Start</button>",
      },
      {
        id: "web-project-css",
        type: "code",
        eyebrow: "Style the button",
        prompt: "Write a CSS rule that gives button elements a blue background.",
        placeholder: "button {\n  background: blue;\n}",
      },
      {
        id: "web-project-js",
        type: "code",
        eyebrow: "Add JavaScript",
        prompt: "Create a constant named message containing Ready, then log it.",
        placeholder: "const message = \"Ready\";\nconsole.log(message);",
      },
    ],
  },
  "js-variables": {
    slug: "js-variables",
    title: "Values & Variables",
    subtitle: "Create JavaScript values, variables and console output.",
    icon: "⚡",
    xp: 25,
    duration: "6 min",
    exercises: [
      {
        id: "js-variable-console",
        type: "text",
        eyebrow: "Fill the method",
        prompt: "Complete the JavaScript method that prints to the console.",
        code: "console.____(\"Hello\");",
        placeholder: "Method name",
      },
      {
        id: "js-variable-let",
        type: "choice",
        eyebrow: "Choose the variable",
        prompt: "Which line creates a changeable variable named score with the value 5?",
        options: ["let score = 5;", "score == 5;", "5 = score;", "variable score = 5;"],
      },
      {
        id: "js-variable-code",
        type: "code",
        eyebrow: "Write JavaScript",
        prompt: "Create a constant named language containing JavaScript, then log language.",
        placeholder: "const language = \"JavaScript\";\nconsole.log(language);",
      },
    ],
  },
  "js-types": {
    slug: "js-types",
    title: "Types & Operators",
    subtitle: "Recognize JavaScript values and compare them safely.",
    icon: "🔢",
    xp: 30,
    duration: "7 min",
    exercises: [
      {
        id: "js-type-boolean",
        type: "choice",
        eyebrow: "Name the type",
        prompt: "What kind of value is stored in ready?",
        code: "const ready = true;",
        options: ["Boolean", "String", "Number", "Array"],
      },
      {
        id: "js-strict-equality",
        type: "choice",
        eyebrow: "Predict the result",
        prompt: "What does this strict comparison produce?",
        code: "5 === \"5\"",
        options: ["false", "true", "5", "\"5\""],
      },
      {
        id: "js-operator-code",
        type: "code",
        eyebrow: "Update a value",
        prompt: "Create let score with 8, then add 2 and store the result back in score.",
        placeholder: "let score = 8;\nscore = score + 2;",
      },
    ],
  },
  "js-conditions": {
    slug: "js-conditions",
    title: "Decisions",
    subtitle: "Use if statements to make JavaScript choose what happens.",
    icon: "🔀",
    xp: 35,
    duration: "8 min",
    exercises: [
      {
        id: "js-condition-syntax",
        type: "choice",
        eyebrow: "Choose the syntax",
        prompt: "Which line correctly starts a JavaScript if statement?",
        options: ["if (score >= 10) {", "if score >= 10:", "when (score >= 10) {", "if score >= 10 then"],
      },
      {
        id: "js-condition-output",
        type: "choice",
        eyebrow: "Predict the output",
        prompt: "What will this code log?",
        code: "const age = 16;\nif (age >= 13) {\n  console.log(\"Ready\");\n}",
        options: ["Ready", "16", "true", "Nothing"],
      },
      {
        id: "js-condition-code",
        type: "code",
        eyebrow: "Write a decision",
        prompt: "Log Level up when score is at least 10.",
        placeholder: "if (score >= 10) {\n  console.log(\"Level up\");\n}",
      },
    ],
  },
  "js-arrays-loops": {
    slug: "js-arrays-loops",
    title: "Arrays & Loops",
    subtitle: "Keep lists of values and repeat code over them.",
    icon: "🔁",
    xp: 40,
    duration: "9 min",
    exercises: [
      {
        id: "js-array-index",
        type: "choice",
        eyebrow: "Read the array",
        prompt: "What does this code log?",
        code: "const colors = [\"blue\", \"gold\"];\nconsole.log(colors[0]);",
        options: ["blue", "gold", "0", "colors"],
      },
      {
        id: "js-loop-output",
        type: "choice",
        eyebrow: "Predict the loop",
        prompt: "Which sequence is logged?",
        code: "for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}",
        options: ["1, 2, 3", "0, 1, 2", "1, 2, 3, 4", "3, 3, 3"],
      },
      {
        id: "js-loop-code",
        type: "code",
        eyebrow: "Loop through a list",
        prompt: "Use for...of to log every item in an array named items.",
        placeholder: "for (const item of items) {\n  console.log(item);\n}",
      },
    ],
  },
  "js-functions": {
    slug: "js-functions",
    title: "Functions",
    subtitle: "Package JavaScript into reusable pieces.",
    icon: "🧰",
    xp: 45,
    duration: "9 min",
    exercises: [
      {
        id: "js-function-syntax",
        type: "choice",
        eyebrow: "Choose the function",
        prompt: "Which line correctly starts a function named greet with a name parameter?",
        options: ["function greet(name) {", "def greet(name):", "function = greet(name)", "greet function(name) {"],
      },
      {
        id: "js-function-return",
        type: "text",
        eyebrow: "Fill the keyword",
        prompt: "Which keyword sends a result back from a JavaScript function?",
        code: "function double(number) {\n  ____ number * 2;\n}",
        placeholder: "Keyword",
      },
      {
        id: "js-function-code",
        type: "code",
        eyebrow: "Write a function",
        prompt: "Write a function named double that returns number multiplied by 2.",
        placeholder: "function double(number) {\n  return number * 2;\n}",
      },
    ],
  },
  "js-mini-project": {
    slug: "js-mini-project",
    title: "Score Tracker",
    subtitle: "Combine arrays, loops and variables into a small project.",
    icon: "🚀",
    xp: 90,
    duration: "11 min",
    exercises: [
      {
        id: "js-project-array",
        type: "choice",
        eyebrow: "Project setup",
        prompt: "Which line creates an array containing the scores 4, 7 and 9?",
        options: ["const scores = [4, 7, 9];", "const scores = (4, 7, 9);", "scores = 4 + 7 + 9;", "array scores = 4, 7, 9;"],
      },
      {
        id: "js-project-total",
        type: "code",
        eyebrow: "Add the scores",
        prompt: "Start total at 0, then use for...of to add each score from scores into total.",
        placeholder: "let total = 0;\nfor (const score of scores) {\n  total = total + score;\n}",
      },
      {
        id: "js-project-output",
        type: "code",
        eyebrow: "Finish the project",
        prompt: "Log the final total to the console.",
        placeholder: "console.log(total);",
      },
    ],
  },
};

Object.assign(lessons, {
  "fund-algorithms": {
    "slug": "fund-algorithms",
    "title": "Algorithmic Thinking",
    "subtitle": "Solve problems with clear steps",
    "icon": "🧭",
    "xp": 30,
    "duration": "6 min",
    "overview": "An algorithm is a clear, finite sequence of steps for solving a problem. Identify the input, decide which actions are needed, and specify the output. This logic can be translated into any programming language.",
    "example": "INPUT first number\nINPUT second number\nADD the numbers\nDISPLAY the total",
    "takeaway": "The concept matters more than the punctuation of any single programming language.",
    "exercises": [
      {
        "id": "fund-algorithms-q1",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "Which example is an algorithm?",
        "options": [
          "A recipe with numbered instructions",
          "A random collection of ideas",
          "A laptop brand",
          "A programming language"
        ]
      },
      {
        "id": "fund-algorithms-q2",
        "type": "text",
        "eyebrow": "Complete the concept",
        "prompt": "What do we call values supplied to an algorithm?",
        "placeholder": "Type your answer"
      },
      {
        "id": "fund-algorithms-q3",
        "type": "order",
        "eyebrow": "Sequence the steps",
        "prompt": "Put the steps to add numbers in the correct order.",
        "options": [
          "DISPLAY the total",
          "INPUT two numbers",
          "ADD the numbers"
        ]
      }
    ]
  },
  "fund-programming": {
    "slug": "fund-programming",
    "title": "Introduction to Programming",
    "subtitle": "Discover input, processing and output",
    "icon": "💡",
    "xp": 30,
    "duration": "6 min",
    "overview": "Programming is creating precise instructions for a computer. A program can take input, process the input and produce output. Pseudocode is a readable planning tool, not code that depends on a particular platform.",
    "example": "INPUT name\nDISPLAY name",
    "takeaway": "The concept matters more than the punctuation of any single programming language.",
    "exercises": [
      {
        "id": "fund-programming-q1",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "Why do programmers write pseudocode?",
        "options": [
          "To plan the steps of a solution",
          "To run the same file on every computer",
          "To buy hardware",
          "To replace testing"
        ]
      },
      {
        "id": "fund-programming-q2",
        "type": "text",
        "eyebrow": "Complete the concept",
        "prompt": "Complete the sequence: input → processing → ____.",
        "placeholder": "Type your answer"
      },
      {
        "id": "fund-programming-q3",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "If a program asks for your name and then displays it, what is the output?",
        "options": [
          "The name entered",
          "The keyboard",
          "The operating system",
          "Nothing"
        ]
      }
    ]
  },
  "fund-variables": {
    "slug": "fund-variables",
    "title": "Variables",
    "subtitle": "Store and update named values",
    "icon": "📦",
    "xp": 30,
    "duration": "6 min",
    "overview": "A variable gives a value a name so it can be used again. Values can change while an algorithm runs. We use SET name TO value as pseudocode; actual programming languages may use other syntax.",
    "example": "SET score TO 5\nSET score TO score + 2\nDISPLAY score",
    "takeaway": "The concept matters more than the punctuation of any single programming language.",
    "exercises": [
      {
        "id": "fund-variables-q1",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "Which word is the variable name in SET score TO 5?",
        "options": [
          "score",
          "SET",
          "TO",
          "5"
        ]
      },
      {
        "id": "fund-variables-q2",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "What does the example display?",
        "options": [
          "7",
          "5",
          "52",
          "2"
        ]
      },
      {
        "id": "fund-variables-q3",
        "type": "text",
        "eyebrow": "Complete the concept",
        "prompt": "Complete the variable name: SET ____ TO 3, where the name holds remaining lives.",
        "placeholder": "Type your answer"
      }
    ]
  },
  "fund-types": {
    "slug": "fund-types",
    "title": "Data Types",
    "subtitle": "Distinguish text, numbers and booleans",
    "icon": "🧩",
    "xp": 30,
    "duration": "6 min",
    "overview": "Data types describe the kind of information in a value. Common types include string (text), integer (whole number), decimal number and Boolean (true or false). Languages can use different names and conventions for these types.",
    "example": "SET name TO \"Amara\"\nSET age TO 15\nSET ready TO TRUE",
    "takeaway": "The concept matters more than the punctuation of any single programming language.",
    "exercises": [
      {
        "id": "fund-types-q1",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "What data type is \"Amara\"?",
        "options": [
          "String",
          "Integer",
          "Boolean",
          "List"
        ]
      },
      {
        "id": "fund-types-q2",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "What data type represents TRUE or FALSE?",
        "options": [
          "Boolean",
          "String",
          "Integer",
          "Decimal"
        ]
      },
      {
        "id": "fund-types-q3",
        "type": "text",
        "eyebrow": "Complete the concept",
        "prompt": "What common data type holds a whole number like 15?",
        "placeholder": "Type your answer"
      }
    ]
  },
  "fund-operators": {
    "slug": "fund-operators",
    "title": "Operators & Expressions",
    "subtitle": "Calculate and compare",
    "icon": "➕",
    "xp": 30,
    "duration": "6 min",
    "overview": "Operators perform actions such as addition, multiplication and comparison. Expressions combine operators and values to produce a result. Follow ordinary mathematical order of operations unless grouping changes it.",
    "example": "SET total TO 8 + 4\nSET enough TO total >= 10\nDISPLAY enough",
    "takeaway": "The concept matters more than the punctuation of any single programming language.",
    "exercises": [
      {
        "id": "fund-operators-q1",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "What is 8 + 4 × 2?",
        "options": [
          "16",
          "24",
          "20",
          "12"
        ]
      },
      {
        "id": "fund-operators-q2",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "Does 12 >= 10 evaluate to TRUE or FALSE?",
        "options": [
          "TRUE",
          "FALSE",
          "12",
          "10"
        ]
      },
      {
        "id": "fund-operators-q3",
        "type": "text",
        "eyebrow": "Complete the concept",
        "prompt": "Which mathematical symbol means multiplication?",
        "placeholder": "Type your answer"
      }
    ]
  },
  "fund-conditions": {
    "slug": "fund-conditions",
    "title": "Conditional Decisions",
    "subtitle": "Choose between IF and ELSE",
    "icon": "🔀",
    "xp": 35,
    "duration": "8 min",
    "overview": "Conditions test whether a statement is true. IF follows one set of steps when the condition succeeds; ELSE handles the alternative. The exact punctuation differs across languages, but the decision logic stays the same.",
    "example": "IF temperature > 28 THEN\n  DISPLAY \"Warm\"\nELSE\n  DISPLAY \"Cool\"\nEND IF",
    "takeaway": "The concept matters more than the punctuation of any single programming language.",
    "exercises": [
      {
        "id": "fund-conditions-q1",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "If temperature is 30, what message is displayed?",
        "options": [
          "Warm",
          "Cool",
          "30",
          "Nothing"
        ]
      },
      {
        "id": "fund-conditions-q2",
        "type": "text",
        "eyebrow": "Complete the concept",
        "prompt": "Which word introduces the alternative branch?",
        "placeholder": "Type your answer"
      },
      {
        "id": "fund-conditions-q3",
        "type": "order",
        "eyebrow": "Sequence the steps",
        "prompt": "Arrange a simple IF decision.",
        "options": [
          "END IF",
          "IF ready THEN",
          "DISPLAY \"Start\""
        ]
      }
    ]
  },
  "fund-loops": {
    "slug": "fund-loops",
    "title": "Loops & Repetition",
    "subtitle": "Repeat instructions safely",
    "icon": "🔁",
    "xp": 35,
    "duration": "8 min",
    "overview": "A loop repeats work. Count-controlled loops repeat a known number of times; condition-controlled loops repeat while a test remains true. Every loop should have a sensible way to stop.",
    "example": "REPEAT 3 TIMES\n  DISPLAY \"Hello\"\nEND REPEAT",
    "takeaway": "The concept matters more than the punctuation of any single programming language.",
    "exercises": [
      {
        "id": "fund-loops-q1",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "How many times does the example display Hello?",
        "options": [
          "3",
          "2",
          "4",
          "Forever"
        ]
      },
      {
        "id": "fund-loops-q2",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "When is a loop useful?",
        "options": [
          "When work must repeat",
          "To remove all variables",
          "To avoid decisions",
          "To change the computer"
        ]
      },
      {
        "id": "fund-loops-q3",
        "type": "text",
        "eyebrow": "Complete the concept",
        "prompt": "A loop that never reaches a stopping condition is called an ____ loop.",
        "placeholder": "Type your answer"
      }
    ]
  },
  "fund-functions": {
    "slug": "fund-functions",
    "title": "Functions",
    "subtitle": "Reuse a set of instructions",
    "icon": "🛠️",
    "xp": 40,
    "duration": "8 min",
    "overview": "A function is a named, reusable group of steps. Functions can accept parameters as inputs and RETURN a result. The names and symbols vary, but the concept carries across programming languages.",
    "example": "FUNCTION double(number)\n  RETURN number * 2\nEND FUNCTION\nDISPLAY double(4)",
    "takeaway": "The concept matters more than the punctuation of any single programming language.",
    "exercises": [
      {
        "id": "fund-functions-q1",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "Why do programmers use functions?",
        "options": [
          "To reuse steps",
          "To avoid input",
          "To delete variables",
          "To choose a device"
        ]
      },
      {
        "id": "fund-functions-q2",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "What value does double(4) produce?",
        "options": [
          "8",
          "4",
          "2",
          "16"
        ]
      },
      {
        "id": "fund-functions-q3",
        "type": "text",
        "eyebrow": "Complete the concept",
        "prompt": "Which word sends the result back from a function?",
        "placeholder": "Type your answer"
      }
    ]
  },
  "fund-lists": {
    "slug": "fund-lists",
    "title": "Arrays & Lists",
    "subtitle": "Store and process collections",
    "icon": "🗂️",
    "xp": 40,
    "duration": "8 min",
    "overview": "An array or list stores a collection of items under one name. A loop can visit each item. Index positions are language-dependent, so this example uses FOR EACH rather than an indexing rule.",
    "example": "SET colors TO [blue, gold, violet]\nFOR EACH color IN colors\n  DISPLAY color\nEND FOR",
    "takeaway": "The concept matters more than the punctuation of any single programming language.",
    "exercises": [
      {
        "id": "fund-lists-q1",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "Which expression represents a collection of three colors?",
        "options": [
          "[blue, gold, violet]",
          "blue + gold",
          "TRUE",
          "12"
        ]
      },
      {
        "id": "fund-lists-q2",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "How many colors does the example display?",
        "options": [
          "3",
          "2",
          "1",
          "4"
        ]
      },
      {
        "id": "fund-lists-q3",
        "type": "text",
        "eyebrow": "Complete the concept",
        "prompt": "What is the general term for visiting items in a collection?",
        "placeholder": "Type your answer"
      }
    ]
  },
  "fund-mini-project": {
    "slug": "fund-mini-project",
    "title": "Final Logic Challenge",
    "subtitle": "Design a score counter in pseudocode",
    "icon": "🚀",
    "xp": 90,
    "duration": "12 min",
    "overview": "Combine your new skills without relying on a particular language. Plan a score counter: start at zero, check each answer, add one for every correct answer, and display the final score.",
    "example": "SET score TO 0\nFOR EACH answer IN answers\n  IF answer IS correct THEN\n    SET score TO score + 1\n  END IF\nEND FOR\nDISPLAY score",
    "takeaway": "You can translate this algorithm into a language after planning the logic.",
    "exercises": [
      {
        "id": "fund-mini-project-q1",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "What value should score start with?",
        "options": [
          "0",
          "1",
          "TRUE",
          "A list"
        ]
      },
      {
        "id": "fund-mini-project-q2",
        "type": "order",
        "eyebrow": "Sequence the steps",
        "prompt": "Arrange the main stages of the score counter.",
        "options": [
          "DISPLAY score",
          "CHECK answers and add points for correct ones",
          "SET score TO 0"
        ]
      },
      {
        "id": "fund-mini-project-q3",
        "type": "choice",
        "eyebrow": "Choose the answer",
        "prompt": "Which concept determines whether a point is earned?",
        "options": [
          "A condition",
          "A file name",
          "A string",
          "A comment"
        ]
      },
      {
        "id": "fund-mini-project-q4",
        "type": "text",
        "eyebrow": "Complete the concept",
        "prompt": "If three answers are correct, what is the final score?",
        "placeholder": "Type your answer"
      }
    ]
  }
} satisfies Record<string, Lesson>);

export const implementedLessonSlugs = Object.keys(lessons);

export function getLesson(slug: string) {
  return lessons[slug];
}

export function getLessonWorldHome(slug: string) {
  if (slug.startsWith("fund-")) return "/learn/fundamentals";
  if (slug.startsWith("web-")) return "/learn/web";
  if (slug.startsWith("js-")) return "/learn/javascript";
  return "/learn";
}

export function isCourseFinalProject(slug: string) {
  return slug === "fund-mini-project" ||
    slug === "mini-project" ||
    slug === "web-mini-project" ||
    slug === "js-mini-project";
}
