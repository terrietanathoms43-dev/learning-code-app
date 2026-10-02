export type Exercise = {
  id: string;
  type: "choice" | "text" | "code";
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
};

export const implementedLessonSlugs = Object.keys(lessons);

export function getLesson(slug: string) {
  return lessons[slug];
}
