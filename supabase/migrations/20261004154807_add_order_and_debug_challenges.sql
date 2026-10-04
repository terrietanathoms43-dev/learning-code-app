insert into public.exercises (
  lesson_id, exercise_key, exercise_type, eyebrow, prompt,
  options, hint, explanation, sort_order, is_published
)
select
  l.id,
  'condition-order',
  'order',
  'Order the code',
  'Put these lines in the correct order to handle both outcomes.',
  '["    print(\"Keep trying\")","else:","if score >= 10:","    print(\"Ready\")"]'::jsonb,
  'The if line comes before its action; else follows the first block.',
  'A complete if/else structure places each action directly under its matching branch.',
  5,
  true
from public.lessons l
where l.slug = 'conditions'
on conflict (exercise_key) do update
set lesson_id = excluded.lesson_id,
    exercise_type = excluded.exercise_type,
    eyebrow = excluded.eyebrow,
    prompt = excluded.prompt,
    options = excluded.options,
    hint = excluded.hint,
    explanation = excluded.explanation,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published;

insert into public.exercises (
  lesson_id, exercise_key, exercise_type, eyebrow, prompt,
  code_snippet, placeholder, hint, explanation, sort_order, is_published
)
select
  l.id,
  'loop-debug',
  'debug',
  'Fix the bug',
  'Repair this loop so it runs correctly.',
  E'for number in range(1, 4)\nprint(number)',
  E'for number in range(1, 4):\n    print(number)',
  'The loop header needs its ending punctuation, and the repeated line belongs inside the loop.',
  'Python loop headers end with a colon and the repeated body must be indented.',
  5,
  true
from public.lessons l
where l.slug = 'loops'
on conflict (exercise_key) do update
set lesson_id = excluded.lesson_id,
    exercise_type = excluded.exercise_type,
    eyebrow = excluded.eyebrow,
    prompt = excluded.prompt,
    code_snippet = excluded.code_snippet,
    placeholder = excluded.placeholder,
    hint = excluded.hint,
    explanation = excluded.explanation,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published;

insert into private.exercise_answers (
  exercise_id, accepted_answers, correct_feedback, incorrect_feedback
)
select
  e.id,
  case e.exercise_key
    when 'condition-order' then
      '["if score >= 10:\n    print(\"Ready\")\nelse:\n    print(\"Keep trying\")"]'::jsonb
    when 'loop-debug' then
      '["for number in range(1, 4):\n    print(number)"]'::jsonb
  end,
  case e.exercise_key
    when 'condition-order' then
      'Perfect. The condition and else branch are in the correct order.'
    when 'loop-debug' then
      'Bug fixed. The loop syntax and indentation are correct.'
  end,
  case e.exercise_key
    when 'condition-order' then
      'Start with if, then its indented action, followed by else and its action.'
    when 'loop-debug' then
      'Check the colon and indentation of the loop body.'
  end
from public.exercises e
where e.exercise_key in ('condition-order', 'loop-debug')
on conflict (exercise_id) do update
set accepted_answers = excluded.accepted_answers,
    correct_feedback = excluded.correct_feedback,
    incorrect_feedback = excluded.incorrect_feedback;
