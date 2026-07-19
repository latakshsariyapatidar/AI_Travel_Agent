# Background Context Summarization

## The Problem
When conversations get long (more than 8 messages), we can't just keep sending everything back to Gemini on every turn. The free tier has strict rate limits and we'd burn through our token budget fast. Plus latency gets bad.

## The Solution
Keep only the last 8 messages live. Anything older gets summarized into a dense paragraph by Gemini and stored in the database. We inject that summary into the system prompt going forward.

Why this works: A summary is way cheaper to send than a full transcript, and the AI won't forget context from earlier in the conversation.

## Async vs Sync
We could summarize the overflow right away (blocking), but that doubles response time for the user — bad UX.

Instead: Reply to the user immediately with the current 8-message window (still plenty of context). Fire off the summary in the background. By the time they message again, it's ready in the database.

The user never feels the extra work, and if the background job gets rate-limited, it just fails quietly. Main chat never breaks.

## Why It Matters
Free tier has hard limits. If we tried to do two API calls per request, we'd hit rate limits and crash. Going async means one API call blocks the user's response, everything else is fire-and-forget. Scales up cleanly to paid tiers too.