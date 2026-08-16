# How to change the LYNK website

You do not need to know how to code. You do not need to understand GitHub. You
describe the change in ordinary English, look at a picture of the result, and a
maintainer publishes it.

Most changes take about five minutes.

---

## What you can change

Anything you can see: mentors, sponsors, competition dates, wording, photos,
season results, FAQ answers.

**You cannot break the live site.** Nothing you do goes public on its own. Every
change waits for one of the maintainers to approve it, and if something wrong
slips through it can be undone in seconds.

---

## Part 1 — One-time setup

You do this once, ever. About ten minutes.

### 1. Get a GitHub account

GitHub is where the website's files live. Think of it as the filing cabinet.

Sign up at **<https://github.com/signup>** — it is free. Use whatever email you
like and pick any username.

### 2. Get added to the team

Send your GitHub username to **<info@lynkrobotics.org>**, or tell a maintainer
directly. They will send you an invitation to the LynkRobotics organisation.

Accept it from the email, or at **<https://github.com/LynkRobotics>**.

> Until you accept, you will not be able to make changes. If you are not sure
> whether it worked, open <https://github.com/LynkRobotics/website> — if you can
> see the files, you are in.

### 3. Get access to Claude

Claude is the assistant that actually makes the edits. Go to
**<https://claude.ai>** and sign in or sign up.

Ask a maintainer whether the team has a plan you should be added to. Making
changes this way needs Claude Code, which is on the paid plans.

**That is the setup finished.** You never have to do it again.

---

## Part 2 — Making your first change

Let us walk through a real one: adding a mentor.

### Step 1 — Open the website project

Go to **<https://claude.ai/code>**.

Choose the **LynkRobotics/website** repository from the list. If it is not
there, look for an option to connect GitHub and grant access, then try again.

You will get a chat box. That is the whole interface.

### Step 2 — Say what you want

Type it the way you would say it to a person:

> Add Jane Doe to the mentors page. She is a Mechanical Engineer at Acme and
> she is our Design Mentor. Her "My whY" is: "I mentor because watching a
> student solve a problem they thought was beyond them never gets old." She
> joined this season and she is an FRC alum.

Then drag her photo into the chat.

**Do not worry about getting it perfectly right.** If something is missing,
Claude will ask. If you would rather be prompted through it, type `/add-mentor`
and it will ask you for each piece.

### Step 3 — Wait a minute

Claude will edit the files, check nothing is broken, and put the change forward
for approval. You do not need to follow along.

### Step 4 — Look at the result

Claude's reply will contain a **link to pictures** of the pages you changed, at
both computer and phone size. Click it and check it looks right.

You will also get a link to the **pull request** — that is GitHub's word for
"a change waiting to be approved". On that page, a minute or so later, a comment
appears with a **preview link**. That is the real website with your change in
it, which you can click around exactly like the live site.

> Preview pages have a small orange **Preview** badge in the corner. That is how
> you know you are not looking at the live site.

### Step 5 — Ask for changes, if you want any

Go back to the chat and say so:

> Her photo is a bit tight, can you crop it wider?

> Actually her title should be Senior Mechanical Engineer.

Claude updates the same request and sends new pictures. Repeat as many times as
you like — nothing is public yet.

### Step 6 — Ask a maintainer to publish it

Send the pull request link to a maintainer, or comment on the page tagging one.

They check it and press Merge. **Your change is live within about two minutes.**

> You will not have a Merge button yourself. That is deliberate, not a mistake —
> only maintainers can publish.

---

## Part 3 — Things people ask for most

Type any of these straight into the chat. The `/` shortcuts prompt you through
each step, but plain English works just as well.

| What you want | Say this |
| --- | --- |
| Add or update a mentor | `/add-mentor` or *"Add Jane Doe to the mentors page…"* |
| Add a sponsor | `/add-sponsor` or *"Acme is a new sponsor at the $5,000 level, logo attached"* |
| Change competition dates | `/update-events` or *"The Pembroke event moved to March 28–29"* |
| We qualified for States | `/update-events` or *"We qualified for States, take the 'if we qualify' note off it"* |
| A new season page | `/new-season 2027` |
| Fix a typo | *"On the FAQs page, 'recieve' should be 'receive'"* |
| Replace a photo | *"Replace the photo on the home page with this one"* — then drag it in |
| Update the roster | *"Add these students to the 2026 roster: …"* |

### Photos

Just drag them into the chat. Claude resizes and crops them.

Send the **biggest version you have** — a photo can be made smaller without
losing quality, but not larger. Straight off a phone or camera is ideal.

---

## Part 4 — If you would rather not use Claude

Open a request instead and a maintainer will do it:

**<https://github.com/LynkRobotics/website/issues/new/choose>**

Choose *Request a website change*, fill in the form, attach any photos. That is
all.

---

## If something goes wrong

**"I do not see the repository in Claude."**
You are probably not in the organisation yet, or have not accepted the
invitation. Check <https://github.com/LynkRobotics/website> loads for you.

**"Claude says a check failed."**
Something in the change does not build. Say *"that check failed, can you fix
it?"* — it can read the error and sort it out.

**"The preview link does not work yet."**
It takes a minute or two to build. Refresh the pull request page.

**"I published something wrong."**
Tell a maintainer straight away. Any change can be undone in about a minute —
nothing is ever lost.

**"Claude changed more than I asked for."**
Say so: *"only change the mentors page, put the rest back."*

---

## The words GitHub uses

You can ignore all of these, but in case you see them:

| Word | What it means here |
| --- | --- |
| **Repository** (repo) | The folder holding the website's files |
| **Branch** | A private copy of the site where your change lives until it is approved |
| **Commit** | One saved edit |
| **Pull request** (PR) | A change waiting for approval |
| **Merge** | Approving it — this is what makes it live |
| **Main** | The version that is live right now |

---

## Who to ask

- Website not doing what you expect → <info@lynkrobotics.org>
- Need publishing rights → ask a member of the
  [website-maintainers](https://github.com/orgs/LynkRobotics/teams/website-maintainers)
  team
- Curious how it all works → [README.md](README.md) and [SETUP.md](SETUP.md)
