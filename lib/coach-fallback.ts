export type CoachMode = "hint" | "explain" | "example";

type CoachFallback = {
  hint: string;
  explain: string;
  example: string;
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
};

export function getCoachFallback(lessonSlug: string, mode: CoachMode) {
  const lessonFallback =
    fallbacks[lessonSlug] ??
    ({
      hint: "Focus on the Python pattern this exercise is testing and compare it with the examples in the lesson.",
      explain: "Break the coding task into its smallest parts, then check the syntax and the value each part produces.",
      example: 'Try a similar tiny example such as: print("Practice")',
    } satisfies CoachFallback);

  return lessonFallback[mode];
}
