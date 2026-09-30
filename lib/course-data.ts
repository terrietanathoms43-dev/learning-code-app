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
};

export const implementedLessonSlugs = Object.keys(lessons);

export function getLesson(slug: string) {
  return lessons[slug];
}
