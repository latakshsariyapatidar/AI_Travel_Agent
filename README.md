# AI Travel Assistant - Project Documentation & Architecture

This is the overarching architecture and documentation for the AI Travel Assistant, designed to interface with the Google Gemini API. This document details the architectural decisions and system design before implementation begins.

## Recent Architecture Updates

Prior to implementation, the following updates were made to the High-Level Design (HLD) and explicitly reflected in this Low-Level Design (LLD) to ensure consistency:
- **API Contracts**: Modified the Chat Endpoint to return RAW structured data for extracted fields instead of heavily pre-processed statuses.
- **Lead Retrieval**: Updated the Specific Lead Endpoint logic to fetch a lead if the conversation *ever* reached the threshold.
- **Qualification Thresholds**: Tightened the scoring criteria. `readyToCapture` increased from 40 to 50; `leadReady` increased from 60 to 65. Confidence mappings were adjusted accordingly.

## High Level Design (HLD)

![Backend HLD](./public/HLD_Updated.png)

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Fast scaffold, component-first |
| Backend | Node.js + Express | Lightweight, familiar |
| Database | MongoDB | JSON-native, schema fits lead structure |
| AI Model | Gemini-2.5-Flash | High quality, free tier available |

## File & Folder Structure

```text
travel-lead-ai/
├── frontend/                          # Vite + React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatPanel.jsx        # Message list + input box
│   │   │   ├── MessageBubble.jsx    # Single message bubble (user / assistant)
│   │   │   ├── LeadPanel.jsx        # Live sidebar showing all captured fields
│   │   │   ├── FieldRow.jsx         # One field row — label + value or null placeholder
│   │   │   └── ScoreBadge.jsx       # Score bar + confidence pill (Low / Medium / High)
│   │   ├── hooks/
│   │   │   └── useChat.js           # All state + API call logic
│   │   ├── utils/
│   │   │   └── conversationId.js    # Generates conv ID once, persists in sessionStorage
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env                         # Frontend environment variables
│   └── vite.config.js
│
├── backend/                          # Node.js + Express Backend
│   ├── routes/
│   │   ├── chat.js                  # Chat endpoints
│   │   └── leads.js                 # Lead retrieval endpoints
│   ├── services/
│   │   ├── geminiService.js         # AI Agent — calls Gemini, parses reply and data
│   │   ├── scoreService.js          # Lead Score + Confidence Calculator
│   │   └── dataService.js           # Database operations
│   ├── models/
│   │   ├── Lead.js                  # Lead data definitions
│   │   └── Conversation.js          # Conversation history definitions
│   ├── prompts/
│   │   └── systemPrompt.js          # AI system prompt definitions
│   ├── middleware/
│   │   └── rateLimiter.js           # API rate limiting rules
│   ├── db.js                        # Database connection
│   ├── index.js                     # Application entry point
│   └── .env                         # Backend environment variables
│
└── README.md                        # This documentation file
```

## Data Models (Conceptual)

### Lead Data
Stores information about a captured lead.
- **Identifier**: Conversation ID (Unique string to prevent duplicates).
- **Customer Details**: Name, Phone, Email (optional).
- **Travel Details**: Destination, Departure City, Travel Date, Travellers, Budget, Duration, Trip Type, Special Requirements.
- **Qualification Details**: Lead Score, Confidence (Low/Medium/High), Reason, Summary.
- **Timestamps**: Created At, Updated At.

*Notes:*
- `Travel Date` and `Budget` will be stored exactly as the user provides them to avoid lossy parsing.
- Database records will be upserted using the `Conversation ID` to dynamically update the lead as new details emerge.

### Conversation History
Stores the flow of the conversation.
- **Identifier**: Conversation ID (Unique).
- **History**: A sliding window of the most recent messages (e.g., the last 8 messages).
- **Summary**: AI-generated summary of the full conversation to preserve context beyond the sliding window.
- **Timestamps**: Updated At.

## API Contracts (Conceptual)

### Chat Endpoint
- **Purpose**: Submits the user's message alongside the conversation history to the AI agent.
- **Payload**: Conversation ID, recent message history, and the new user message.
- **Response**: The conversational reply from the AI, and RAW data in structured format including all the necessary details which can be extracted from message.

### Retrieve All Leads Endpoint
- **Purpose**: Fetches all stored leads for dashboarding, verification, or demonstration purposes.
- **Response**: A collection of all saved lead records.

### Retrieve Specific Lead Endpoint
- **Purpose**: Fetches a lead associated with a specific conversation ID.
- **Payload**: Conversation ID.
- **Response**: The specific lead record (if that conversation ever reached the qualification threshold).

## Core Services

### AI Agent Service
- Prepares the context by prepending the system prompt to the message history.
- Trims the history to fit within the AI provider's token limits.
- Interfaces with the Gemini AI model.
- Parses the AI's response to separate the conversational reply from the structured data (the extracted fields).
- Includes error handling to fallback gracefully if the AI fails to output correctly formatted structured data.

### Scoring Service
- Purely functional, rule-based scoring (no AI involvement, ensuring predictability and testability).
- Calculates a lead score based on the presence of required fields.
- Maps the calculated score to a confidence level (Low/Medium/High).
- Evaluates logical flags (e.g., when the AI has enough context to ask for contact info, and when a lead should be written to the database).

### Data Service
- Manages the persistence of leads and conversation history.
- Upserts conversation history on every turn.
- Upserts lead data only when the lead score meets the defined qualification threshold.

## Score Calculator Logic

Scoring is additive. Each field contributes a fixed number of points when present.

| Signal | Points |
|---|---|
| Destination specified | +20 |
| Travel date — specific (month/year) | +15 |
| Travel date — vague ("next year", "sometime") | +8 |
| Traveller count | +10 |
| Budget specified | +15 |
| Trip type (honeymoon, family, solo, etc.) | +10 |
| Departure city | +5 |
| Special requirements | +5 |
| Name captured | +10 |
| Phone captured | +10 |
| **Maximum** | **100** |

### Confidence Mapping

| Score Range | Confidence |
|---|---|
| 0 – 49 | Low |
| 50 – 64 | Medium |
| 65 – 100 | High |

### Qualification Flags

| Flag | Condition |
|---|---|
| `readyToCapture` | Score ≥ 50 AND Name is missing (enough travel info gathered to politely ask for contact details). |
| `leadReady` | Score ≥ 65 AND Name & Phone are present (lead is fully qualified and should be saved to the database). |
## System Prompt Design

The system prompt will act as the core intelligence of the assistant, performing three primary jobs:
1. **Conversational Guidance**: Instructing the AI on how to interact naturally, prioritize which missing fields to ask for, and request contact details respectfully without being overly aggressive.
2. **Field Extraction**: Defining exactly which key travel details to extract from the user's natural language responses.
3. **Structured Output Enforcement**: Enforcing a strict text delimiter structure (e.g., a designated JSON block) at the end of every reply, allowing the backend to reliably parse the extracted data without disrupting the user-facing text.

## Frontend State Management (Conceptual)

The React frontend will be state-driven, managing the following core concepts:
- **Message History**: The ongoing dialogue array to render the chat interface.
- **Live Extracted Fields**: A real-time reflection of what the AI has successfully captured so far, displayed alongside the chat.
- **Lead Qualification Status**: The current score, confidence badge, and readiness flags derived from the backend response.
- **UI State**: Loading indicators during API calls.
- **Session Identity**: A persistent conversation ID generated once per session and stored locally to maintain state across reloads.

## Rate Limiting

The application will implement rate limiting (e.g., a cap of 10 requests per minute per IP address). This ensures compliance with the Gemini API free-tier restrictions and prevents service abuse.

## Environment Configuration (Required Variables)

The system will rely on environment variables for sensitive or environment-specific configurations:
- Backend Port
- MongoDB Connection URI
- Gemini API Key
- Lead Score Thresholds
- Rate Limiting Parameters (Window duration and max requests)
- Frontend API Base URL

## Edge Cases & Assumptions

| Scenario | System Behaviour |
|---|---|
| User shares contact info very early (before travel details) | Accepted gracefully. Name and phone are stored, but the score reflects missing travel fields. The lead will not be marked as `leadReady` until the score meets the threshold. |
| User shows interest but refuses contact details | Conversation continues naturally and helpfully. The score is effectively capped (lacking name/phone points) and the lead is never forced into the database. |
| User's interest drops mid-conversation ("I'll think about it") | The AI respects this and does not push. Qualification flags remain false and no lead is saved. |
| Vague travel date ("sometime next year") | Accepted and stored as-is. Scores fewer points than a specific date but still contributes to the overall score. |
| AI fails to output structured data correctly | The backend catches the parsing error, returns the conversational reply to the user, and waits for the next turn to re-attempt extraction based on the updated history. |
| Double submission of the same message | Database operations use idempotent upserts, preventing duplicate records. |
| User provides partial contact (name but no phone) | `leadReady` remains false. The name is stored, and the AI naturally follows up to ask for the phone number. |
