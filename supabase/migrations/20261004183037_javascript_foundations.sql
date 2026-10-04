insert into public.courses (
  slug, title, description, language, accent, sort_order, is_published
)
values (
  'javascript-foundations',
  'JavaScript Foundations',
  'Learn JavaScript through values, decisions, arrays, loops, functions and a small project.',
  'JavaScript',
  '#7c3aed',
  3,
  true
)
on conflict (slug) do update
set title = excluded.title,
    description = excluded.description,
    language = excluded.language,
    accent = excluded.accent,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published;

insert into public.units (
  course_id, slug, title, description, theme, sort_order, is_published
)
select
  c.id,
  'logic-lab',
  'Logic Lab',
  'Build JavaScript logic from variables through reusable functions.',
  'javascript',
  1,
  true
from public.courses c
where c.slug = 'javascript-foundations'
on conflict (course_id, slug) do update
set title = excluded.title,
    description = excluded.description,
    theme = excluded.theme,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published;

insert into public.lessons (
  unit_id, slug, title, subtitle, lesson_type, icon,
  xp_reward, duration_minutes, sort_order, is_published
)
select u.id, v.slug, v.title, v.subtitle, v.lesson_type, v.icon,
       v.xp_reward, v.duration_minutes, v.sort_order, true
from public.units u
join public.courses c on c.id = u.course_id
cross join (
  values
    ('js-variables','Values & Variables','Store values and print them','lesson','⚡',25,6,1),
    ('js-types','Types & Operators','Work with values safely','lesson','🔢',30,7,2),
    ('js-conditions','Decisions','Make code choose a path','lesson','🔀',35,8,3),
    ('js-arrays-loops','Arrays & Loops','Store lists and repeat work','lesson','🔁',40,9,4),
    ('js-functions','Functions','Create reusable JavaScript','lesson','🧰',45,9,5),
    ('js-mini-project','Score Tracker','Build a tiny score calculator','project','🚀',90,11,6)
) as v(slug,title,subtitle,lesson_type,icon,xp_reward,duration_minutes,sort_order)
where c.slug = 'javascript-foundations'
  and u.slug = 'logic-lab'
on conflict (slug) do update
set unit_id = excluded.unit_id,
    title = excluded.title,
    subtitle = excluded.subtitle,
    lesson_type = excluded.lesson_type,
    icon = excluded.icon,
    xp_reward = excluded.xp_reward,
    duration_minutes = excluded.duration_minutes,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published;

insert into public.exercises (
  lesson_id, exercise_key, exercise_type, eyebrow, prompt,
  code_snippet, options, placeholder, hint, explanation, sort_order, is_published
)
select l.id, v.exercise_key, v.exercise_type, v.eyebrow, v.prompt,
       v.code_snippet, v.options, v.placeholder, v.hint, v.explanation, v.sort_order, true
from public.lessons l
cross join (
  values
    ('js-variables','js-variable-console','text','Fill the method',
     'Complete the JavaScript method that prints to the console.',
     'console.____("Hello");',null,'Method name',
     'Developers say they log a value to the console.',
     'console.log() writes a value to the JavaScript console.',1),
    ('js-variables','js-variable-let','choice','Choose the variable',
     'Which line creates a changeable variable named score with the value 5?',
     null,'["let score = 5;","score == 5;","5 = score;","variable score = 5;"]'::jsonb,null,
     'Use JavaScript''s keyword for a variable whose value can change.',
     'let score = 5; declares the variable and stores 5 in it.',2),
    ('js-variables','js-variable-code','code','Write JavaScript',
     'Create a constant named language containing JavaScript, then log language.',
     null,null,E'const language = "JavaScript";\nconsole.log(language);',
     'Use const on the first line and console.log on the second.',
     'const creates the value and console.log reads the stored variable.',3),

    ('js-types','js-type-boolean','choice','Name the type',
     'What kind of value is stored in ready?',
     'const ready = true;','["Boolean","String","Number","Array"]'::jsonb,null,
     'true and false represent yes/no states.',
     'JavaScript calls true and false boolean values.',1),
    ('js-types','js-strict-equality','choice','Predict the result',
     'What does this strict comparison produce?',
     '5 === "5"','["false","true","5","\"5\""]'::jsonb,null,
     'Strict equality compares both the value and its type.',
     'The left side is a number and the right side is a string, so === returns false.',2),
    ('js-types','js-operator-code','code','Update a value',
     'Create let score with 8, then add 2 and store the result back in score.',
     null,null,E'let score = 8;\nscore = score + 2;',
     'Create score first, then assign score + 2 back into it.',
     'The second assignment replaces score with its previous value plus 2.',3),

    ('js-conditions','js-condition-syntax','choice','Choose the syntax',
     'Which line correctly starts a JavaScript if statement?',
     null,'["if (score >= 10) {","if score >= 10:","when (score >= 10) {","if score >= 10 then"]'::jsonb,null,
     'JavaScript wraps the condition in parentheses and opens a block with a curly brace.',
     'A JavaScript if block starts with if (condition) {.',1),
    ('js-conditions','js-condition-output','choice','Predict the output',
     'What will this code log?',
     E'const age = 16;\nif (age >= 13) {\n  console.log("Ready");\n}',
     '["Ready","16","true","Nothing"]'::jsonb,null,
     'Check whether 16 satisfies age >= 13.',
     'The condition is true, so the log statement inside the block runs.',2),
    ('js-conditions','js-condition-code','code','Write a decision',
     'Log Level up when score is at least 10.',
     null,null,E'if (score >= 10) {\n  console.log("Level up");\n}',
     'Put the comparison inside if (...) and the log statement inside the braces.',
     'The if block only runs its console.log when the score condition is true.',3),

    ('js-arrays-loops','js-array-index','choice','Read the array',
     'What does this code log?',
     E'const colors = ["blue", "gold"];\nconsole.log(colors[0]);',
     '["blue","gold","0","colors"]'::jsonb,null,
     'JavaScript array positions begin at zero.',
     'colors[0] reads the first value in the array.',1),
    ('js-arrays-loops','js-loop-output','choice','Predict the loop',
     'Which sequence is logged?',
     E'for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}',
     '["1, 2, 3","0, 1, 2","1, 2, 3, 4","3, 3, 3"]'::jsonb,null,
     'Start at 1 and keep going while i is at most 3.',
     'The loop logs 1, then 2, then 3 before its condition becomes false.',2),
    ('js-arrays-loops','js-loop-code','code','Loop through a list',
     'Use for...of to log every item in an array named items.',
     null,null,E'for (const item of items) {\n  console.log(item);\n}',
     'Use for (const item of items) and log item inside the block.',
     'for...of visits each array value directly.',3),

    ('js-functions','js-function-syntax','choice','Choose the function',
     'Which line correctly starts a function named greet with a name parameter?',
     null,'["function greet(name) {","def greet(name):","function = greet(name)","greet function(name) {"]'::jsonb,null,
     'JavaScript starts named functions with the function keyword.',
     'function greet(name) { begins a named function with one parameter.',1),
    ('js-functions','js-function-return','text','Fill the keyword',
     'Which keyword sends a result back from a JavaScript function?',
     E'function double(number) {\n  ____ number * 2;\n}',null,'Keyword',
     'The same keyword is commonly used to give a calculated value back to the caller.',
     'return sends a function result back to the code that called it.',2),
    ('js-functions','js-function-code','code','Write a function',
     'Write a function named double that returns number multiplied by 2.',
     null,null,E'function double(number) {\n  return number * 2;\n}',
     'Start with function double(number), then return number * 2 inside the block.',
     'The parameter receives a number and return sends back twice its value.',3),

    ('js-mini-project','js-project-array','choice','Project setup',
     'Which line creates an array containing the scores 4, 7 and 9?',
     null,'["const scores = [4, 7, 9];","const scores = (4, 7, 9);","scores = 4 + 7 + 9;","array scores = 4, 7, 9;"]'::jsonb,null,
     'JavaScript arrays use square brackets.',
     'Square brackets create the array and commas separate its values.',1),
    ('js-mini-project','js-project-total','code','Add the scores',
     'Start total at 0, then use for...of to add each score from scores into total.',
     null,null,E'let total = 0;\nfor (const score of scores) {\n  total = total + score;\n}',
     'Create total, loop over scores, then update total inside the loop.',
     'Each loop pass adds one score into the running total.',2),
    ('js-mini-project','js-project-output','code','Finish the project',
     'Log the final total to the console.',
     null,null,'console.log(total);',
     'Use console.log with the total variable.',
     'console.log(total) displays the final value after the loop.',3)
) as v(
  lesson_slug,exercise_key,exercise_type,eyebrow,prompt,
  code_snippet,options,placeholder,hint,explanation,sort_order
)
where l.slug = v.lesson_slug
on conflict (exercise_key) do update
set lesson_id = excluded.lesson_id,
    exercise_type = excluded.exercise_type,
    eyebrow = excluded.eyebrow,
    prompt = excluded.prompt,
    code_snippet = excluded.code_snippet,
    options = excluded.options,
    placeholder = excluded.placeholder,
    hint = excluded.hint,
    explanation = excluded.explanation,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published;

insert into private.exercise_answers (
  exercise_id, accepted_answers, correct_feedback, incorrect_feedback
)
select e.id,
  case e.exercise_key
    when 'js-variable-console' then '["log"]'::jsonb
    when 'js-variable-let' then '["let score = 5;"]'::jsonb
    when 'js-variable-code' then '["const language = \"JavaScript\";\nconsole.log(language);","const language = ''JavaScript'';\nconsole.log(language);"]'::jsonb
    when 'js-type-boolean' then '["Boolean"]'::jsonb
    when 'js-strict-equality' then '["false"]'::jsonb
    when 'js-operator-code' then '["let score = 8;\nscore = score + 2;"]'::jsonb
    when 'js-condition-syntax' then '["if (score >= 10) {"]'::jsonb
    when 'js-condition-output' then '["Ready"]'::jsonb
    when 'js-condition-code' then '["if (score >= 10) {\n  console.log(\"Level up\");\n}"]'::jsonb
    when 'js-array-index' then '["blue"]'::jsonb
    when 'js-loop-output' then '["1, 2, 3"]'::jsonb
    when 'js-loop-code' then '["for (const item of items) {\n  console.log(item);\n}"]'::jsonb
    when 'js-function-syntax' then '["function greet(name) {"]'::jsonb
    when 'js-function-return' then '["return"]'::jsonb
    when 'js-function-code' then '["function double(number) {\n  return number * 2;\n}"]'::jsonb
    when 'js-project-array' then '["const scores = [4, 7, 9];"]'::jsonb
    when 'js-project-total' then '["let total = 0;\nfor (const score of scores) {\n  total = total + score;\n}"]'::jsonb
    when 'js-project-output' then '["console.log(total);"]'::jsonb
  end,
  'Correct — keep building your JavaScript logic.',
  'Check the JavaScript syntax and try again.'
from public.exercises e
where e.exercise_key in (
  'js-variable-console','js-variable-let','js-variable-code',
  'js-type-boolean','js-strict-equality','js-operator-code',
  'js-condition-syntax','js-condition-output','js-condition-code',
  'js-array-index','js-loop-output','js-loop-code',
  'js-function-syntax','js-function-return','js-function-code',
  'js-project-array','js-project-total','js-project-output'
)
on conflict (exercise_id) do update
set accepted_answers = excluded.accepted_answers,
    correct_feedback = excluded.correct_feedback,
    incorrect_feedback = excluded.incorrect_feedback;
