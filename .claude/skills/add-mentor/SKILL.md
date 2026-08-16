---
name: add-mentor
description: Add, update or remove a mentor on the LYNK Robotics mentors page. Use when someone wants to put a new mentor on the website, change a mentor's role or blurb, or take a mentor down.
argument-hint: "[mentor name, if you know it]"
---

# Add or update a mentor

The person asking may not know how the site is built. Do not make them learn.
Ask for what you need in plain language, one short round of questions, then do
the whole job.

## What you need

Everything lives in `src/_data/mentors.json`. Each mentor is one object:

```json
{
  "name": "Jane Doe",
  "photo": "/assets/img/mentors/jane-doe.jpg",
  "title": "Mechanical Engineer @ Acme",
  "role": "Design Mentor",
  "why": "I mentor because ...",
  "since": "2026-Present",
  "alum": "FRC Alum"
}
```

- **name** — as they want it shown. Nicknames go in quotes, matching the
  existing entries: `Daniel "Danny" Smith`.
- **title** — their day job, written `Role @ Employer`.
- **role** — what they do on the team, e.g. `Design Mentor`,
  `Scouting and Strategy`.
- **why** — their "My whY" sentence. Ask for it in their own words; the page
  prints it after a bold `My whY:` label, so do not repeat that label in the text.
- **since** — `2026-Present` for someone joining now.
- **alum** — `FRC Alum`, `FLL + FRC Alum`, or `""` if neither. Optional.

## Ask for these

If the request did not already include them, ask for all of it in one message
rather than one question at a time:

1. Full name, as it should appear
2. Day job (role and employer)
3. Their role on the team
4. Their "My whY" sentence
5. Are they an FRC or FLL alum?
6. A photo

## The photo

Mentor photos are square, about 500×500, JPEG quality ~82, saved as
`src/assets/img/mentors/<first-last>.jpg` (all lowercase, hyphenated).

- If they attach or point to a file, resize and convert it yourself. Crop to a
  square centred on the face rather than squashing it.
- If they have no photo yet, say so and offer to add the mentor without one —
  but note the card will look unfinished, so a photo is worth chasing.
- Nothing in the build resizes images. Getting this right here is the only
  chance.

## Removing a mentor

Delete their object from `mentors.json` and delete their photo file. Do not
leave an orphan image.

## Ordering

`mentors.json` is rendered in file order, which is roughly lead coaches first,
then alphabetical by surname. Put a new mentor where they belong in that
pattern rather than appending to the end.

## Finish the job

Follow "Handing work back" in CLAUDE.md:

1. `npm run check`
2. `npm run review -- review.html --pages=/our-people/mentors/`
3. Publish `review.html` as an artifact, link it in your reply
4. Push a branch, open a pull request, and tell them a maintainer has to merge
   it before it goes live

In your reply, show them the mentor card as it will appear and say plainly what
happens next. Avoid Git vocabulary — "I have put this up for one of the
maintainers to approve" beats "I opened a PR against main".
