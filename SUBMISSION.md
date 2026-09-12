# Submission

*I’m writing this submission report manually instead of letting AI fill it in quickly. 

## What did you investigate first, and why?

At first, I investigated the repo: what does it do? What features do we need to achieve? What’s the code structure? Those can help me better understand this project. This is important because we need to think first and know what to do before we code and build it.

I spent 50 minutes understanding the repo's purpose, internal logic, and code structure, and running the demo. That’s only the first part; I haven't reached the second part (validation) yet. Given 90 minutes total, I spent a lot of time figuring it out, but it’s worth it. 

## What did you choose to implement or fix?

First, after figuring it out, I decided to use CLI because it's easier;
As a fix, I resolved the branch issue. Right now, the given code hard-codes the `main` branch. That means if the main branch doesn't exist or has a different name (e.g., `master`), the program will fail. An error also happens if a branch does not exist. 

And also, there is a trick here: initially, I thought we were comparing differences between the current branch, the current commit, and the previous commit; but after I asked AI, AI said the templates default to comparing the current branch with the main branch. This helped me a lot.

Given the time constraints, this is the only issue I can fix.

## What did you intentionally not do?

It’s hard to say for me, or I don’t have any intention not to do; the only thing maybe is that, given the time constraints, I didn’t do the second part and fix more mistakes intentionally.

## Interface decision

- Decision: CLI-first
- Primary user and execution environment: can be a local developer.
- Trust boundary and allowed capabilities: assume only the local user.
- Reliability, discoverability, latency/context, and output tradeoffs: It is easy to debug, supports outputting to files, and the context is not constrained by the MCP protocol; the trade-off is that the AI ​​is not ready-to-use out of the box, and discovering tools relies on READMEs or help documentation.
- How supported interfaces remain consistent: Currently, production support is guaranteed only for the CLI; if MCP is retained, it will share the core, but no commitment is made at this time.
- Evidence that would change this decision: For example, the primary users have shifted to Cursor agents, and the majority of calls are executed via tools rather than through manual command entry.

## How did you use an AI coding agent?

AI helped me a lot. As I stated before, for the first 50 minutes I kept interacting with AI, asking AI questions step by step, just to figure out what this repo is trying to do, overall flow, etc. 

After that, I let AI code and fix the mistake for me. Overall, I mainly use AI to understand problems, not code.

## Where did you check, correct, or reject an AI suggestion? (required)

After AI finishes the code, I examine the code it generated — just looking at the code editor and all the files it modified. Then I run a terminal test, make sure the code is working, and add, commit, and push.

## Commands used to verify the result, with outcomes

You can run the command `npm run inspector -- review --repo .` to start this app; the output is written to `review-report.md`, including changed files. 

## A blocker you hit and how you approached it

The blocker is understanding the app itself and the code structure. Since I haven't solved a similar problem before, it took me a lot of time to figure it out. But in the end, with the help of AI, I was able to better understand this project and complete the task.

## Known limitations and the next three things you would do

There are many limitations, for sure, because I was only able to fix 1 issue; more issues need to be addressed, including both parts: validation and adding MCP. Those are the next three things I will do.

## Approximate focused-work time

About 90 minutes for instructions. 

- Start: Sep 11th, 4pm
- Finish: Sep 11th, 5:30pm
