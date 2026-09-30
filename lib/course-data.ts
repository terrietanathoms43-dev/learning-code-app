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
  {
    slug: "hello-world",
    title: "Hello, Python!",
    subtitle: "Meet your first line of code",
    icon: "👋",
    kind: "lesson",
    status: "completed",
    xp: 20,
  },
  {
    slug: "variables",
    title: "Variables",
    subtitle: "Give your data a name",
    icon: "📦",
    kind: "lesson",
    status: "current",
    xp: 25,
  },
  {
    slug: "data-types",
    title: "Data Types",
    subtitle: "Strings, numbers and booleans",
    icon: "🧩",
    kind: "lesson",
    status: "locked",
    xp: 25,
  },
  {
    slug: "operators",
    title: "Operators",
    subtitle: "Make values work together",
    icon: "➕",
    kind: "lesson",
    status: "locked",
    xp: 30,
  },
  {
    slug: "checkpoint-1",
    title: "Trail Checkpoint",
    subtitle: "Prove what you remember",
    icon: "⭐",
    kind: "checkpoint",
    status: "locked",
    xp: 50,
  },
  {
    slug: "conditions",
    title: "Conditions",
    subtitle: "Teach code how to decide",
    icon: "🔀",
    kind: "lesson",
    status: "locked",
    xp: 30,
  },
  {
    slug: "loops",
    title: "Loops",
    subtitle: "Repeat without repeating yourself",
    icon: "🔁",
    kind: "lesson",
    status: "locked",
    xp: 35,
  },
  {
    slug: "functions",
    title: "Functions",
    subtitle: "Build reusable blocks",
    icon: "🛠️",
    kind: "lesson",
    status: "locked",
    xp: 40,
  },
  {
    slug: "mini-project",
    title: "Mini Project",
    subtitle: "Build a tiny quiz game",
    icon: "🚀",
    kind: "project",
    status: "locked",
    xp: 100,
  },
];

export const lessons: Record<string, Lesson> = {
  "hello-world": {
    slug: "hello-world",
    title: "Hello, Python!",
    subtitle: "Learn how Python displays information.",
    icon: "👋",
    xp: 20,
    duration: "4 min",
    exercises: [
      {
        id: "hello-print-choice",
        type: "choice",
        eyebrow: "Pick the code",
        prompt: "Which line tells Python to display Hello, coder!?",
        options: [
          'print("Hello, coder!")',
          'show("Hello, coder!")',
          'say("Hello, coder!")',
          'output = "Hello, coder!"',
        ],
      },
      {
        id: "hello-fill-print",
        type: "text",
        eyebrow: "Fill the blank",
        prompt: "Complete the function name.",
        code: '____("I can code!")',
        placeholder: "Type the missing word",
      },
      {
        id: "hello-output",
        type: "choice",
        eyebrow: "Predict the output",
        prompt: "What does this code display?",
        code: 'print("Python is fun")',
        options: ["Python is fun", '"Python is fun"', "print", "Nothing"],
      },
    ],
  },
  variables: {
    slug: "variables",
    title: "Variables",
    subtitle: "Store information and give it a useful name.",
    icon: "📦",
    xp: 25,
    duration: "6 min",
    exercises: [
      {
        id: "variable-create",
        type: "choice",
        eyebrow: "Choose the variable",
        prompt: "Which line creates a variable named score with the value 10?",
        options: ["score = 10", "10 = score", "score == 10", 'score = "ten"'],
      },
      {
        id: "variable-name",
        type: "text",
        eyebrow: "Fill the blank",
        prompt: "Create a variable named lives with the value 7. Type only the missing name.",
        code: "_____ = 7",
        placeholder: "Variable name",
      },
      {
        id: "variable-output",
        type: "choice",
        eyebrow: "Predict the output",
        prompt: "What will Python display?",
        code: "points = 4\npoints = points + 3\nprint(points)",
        options: ["4", "7", "43", "points"],
      },
      {
        id: "variable-code",
        type: "code",
        eyebrow: "Write code",
        prompt: "Create a variable named language and store the text Python in it.",
        placeholder: 'language = "Python"',
      },
    ],
  },
};

export function getLesson(slug: string) {
  return lessons[slug];
}
