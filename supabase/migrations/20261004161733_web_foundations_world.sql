create or replace function public.can_access_lesson(p_slug text)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  with target_lesson as (
    select id, unit_id, sort_order
    from public.lessons
    where slug = p_slug
      and is_published = true
    limit 1
  ),
  previous_lesson as (
    select id
    from public.lessons
    where is_published = true
      and unit_id = (select unit_id from target_lesson)
      and sort_order < (select sort_order from target_lesson)
    order by sort_order desc
    limit 1
  )
  select coalesce(
    auth.uid() is not null
    and exists (select 1 from target_lesson)
    and (
      not exists (select 1 from previous_lesson)
      or exists (
        select 1
        from public.user_lesson_progress p
        where p.user_id = auth.uid()
          and p.lesson_id = (select id from target_lesson)
          and p.status = 'completed'
      )
      or exists (
        select 1
        from public.user_lesson_progress p
        where p.user_id = auth.uid()
          and p.lesson_id = (select id from previous_lesson)
          and p.status = 'completed'
      )
    ),
    false
  );
$$;

revoke all on function public.can_access_lesson(text) from public, anon;
grant execute on function public.can_access_lesson(text) to authenticated;

insert into public.courses (
  slug, title, description, language, accent, sort_order, is_published
)
values (
  'web-foundations',
  'Web Foundations',
  'Learn the building blocks of the web with HTML, CSS and JavaScript.',
  'Web',
  '#14b8a6',
  2,
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
  'pixel-garden',
  'Pixel Garden',
  'Build structure, style and interaction for your first web pages.',
  'web',
  1,
  true
from public.courses c
where c.slug = 'web-foundations'
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
    ('web-html-basics','HTML Basics','Build the structure of a page','lesson','🏗️',25,6,1),
    ('web-css-basics','CSS Basics','Style what you built','lesson','🎨',30,7,2),
    ('web-js-basics','JavaScript Basics','Make pages react','lesson','⚡',35,7,3),
    ('web-mini-project','Mini Web Project','Put HTML, CSS and JS together','project','🌐',80,10,4)
) as v(slug,title,subtitle,lesson_type,icon,xp_reward,duration_minutes,sort_order)
where c.slug='web-foundations' and u.slug='pixel-garden'
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
    ('web-html-basics','web-html-heading','choice','Choose the tag',
     'Which HTML creates a main heading that says Hello?',null,
     '["<h1>Hello</h1>","<p>Hello</p>","<title>Hello</title>","<heading>Hello</heading>"]'::jsonb,
     null,'Use the main heading level.','h1 is the main page heading level.',1),
    ('web-html-basics','web-html-paragraph','text','Fill the tag',
     'Which tag name creates a paragraph? Type only the tag name.',
     '<____>Welcome to my page</____>',null,'Tag name',
     'HTML uses a one-letter tag for paragraphs.','The p tag creates a paragraph.',2),
    ('web-html-basics','web-html-code','code','Write HTML',
     'Create an h2 heading containing the text Welcome.',null,null,
     '<h2>Welcome</h2>','Use opening and closing h2 tags.','An h2 wraps the heading text between opening and closing tags.',3),
    ('web-css-basics','web-css-color','choice','Choose the property',
     'Which CSS property changes text color?',null,
     '["color","background","font-style","text-value"]'::jsonb,null,
     'Choose the property for foreground text.','The color property changes text color.',1),
    ('web-css-basics','web-css-selector','text','Name the selector',
     'Which selector targets every h1 element? Type only the selector.',
     E'____ {\n  color: blue;\n}',null,'Selector',
     'Use the element name itself.','The h1 selector targets every h1 element.',2),
    ('web-css-basics','web-css-debug','debug','Fix the CSS',
     'Repair this rule so the heading becomes blue.',
     E'h1 {\n  color blue\n}',null,E'h1 {\n  color: blue;\n}',
     'CSS properties need punctuation between the property and value.','A CSS declaration uses property: value inside the rule.',3),
    ('web-js-basics','web-js-variable','choice','Choose the variable',
     'Which line creates a JavaScript variable named score with the value 5?',null,
     '["let score = 5;","score == 5;","5 = score;","variable score = 5;"]'::jsonb,null,
     'JavaScript can create a changeable variable with let.','let score = 5; declares and assigns the variable.',1),
    ('web-js-basics','web-js-console','text','Fill the method',
     'Complete the browser-console output method.',
     'console.____("Hello");',null,'Method name',
     'Developers say they log a value to the console.','console.log() writes a value to the console.',2),
    ('web-js-basics','web-js-code','code','Write JavaScript',
     'Create a constant named name with the text Ada, then log name.',null,null,
     E'const name = "Ada";\nconsole.log(name);',
     'Use const on the first line and console.log on the second.','A const stores Ada and console.log displays its value.',3),
    ('web-mini-project','web-project-html','code','Build the content',
     'Create a button whose visible text is Start.',null,null,
     '<button>Start</button>',
     'Wrap Start in opening and closing button tags.','A button element displays the text between its tags.',1),
    ('web-mini-project','web-project-css','code','Style the button',
     'Write a CSS rule that gives button elements a blue background.',null,null,
     E'button {\n  background: blue;\n}',
     'Target button and set its background to blue.','The button selector can use background or background-color.',2),
    ('web-mini-project','web-project-js','code','Add JavaScript',
     'Create a constant named message containing Ready, then log it.',null,null,
     E'const message = "Ready";\nconsole.log(message);',
     'Store Ready in message, then log message.','The constant holds Ready and console.log displays it.',3)
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
    when 'web-html-heading' then '["<h1>Hello</h1>"]'::jsonb
    when 'web-html-paragraph' then '["p"]'::jsonb
    when 'web-html-code' then '["<h2>Welcome</h2>"]'::jsonb
    when 'web-css-color' then '["color"]'::jsonb
    when 'web-css-selector' then '["h1"]'::jsonb
    when 'web-css-debug' then '["h1 {\n  color: blue;\n}","h1 {\n  color: blue\n}"]'::jsonb
    when 'web-js-variable' then '["let score = 5;"]'::jsonb
    when 'web-js-console' then '["log"]'::jsonb
    when 'web-js-code' then '["const name = \"Ada\";\nconsole.log(name);","const name = ''Ada'';\nconsole.log(name);"]'::jsonb
    when 'web-project-html' then '["<button>Start</button>"]'::jsonb
    when 'web-project-css' then '["button {\n  background: blue;\n}","button {\n  background-color: blue;\n}"]'::jsonb
    when 'web-project-js' then '["const message = \"Ready\";\nconsole.log(message);","const message = ''Ready'';\nconsole.log(message);"]'::jsonb
  end,
  'Correct — keep building.',
  'Check the syntax and try again.'
from public.exercises e
where e.exercise_key in (
  'web-html-heading','web-html-paragraph','web-html-code',
  'web-css-color','web-css-selector','web-css-debug',
  'web-js-variable','web-js-console','web-js-code',
  'web-project-html','web-project-css','web-project-js'
)
on conflict (exercise_id) do update
set accepted_answers = excluded.accepted_answers,
    correct_feedback = excluded.correct_feedback,
    incorrect_feedback = excluded.incorrect_feedback;
