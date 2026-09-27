# Dynamic Sentence Builder

A full-stack web application that lets users construct sentences by selecting
words according to their grammatical type, then save, retrieve, and edit
those sentences.

## Stack
- **Frontend:** Angular 18 (standalone components)
- **Backend / API:** Node.js + Express.js
- **Database:** PostgreSQL

## Project layout
```
sentence-builder/
├── backend/    Express REST API + PostgreSQL access layer
└── frontend/   Angular 18 application
```

## Getting started

### 1. Database
Create a PostgreSQL database and note its connection string, e.g.:
```
createdb sentence_builder
```

### 2. Backend
```
cd backend
cp .env.example .env      # fill in your DB credentials
npm install
npm run seed               # creates tables & seeds word types/words
npm run dev                 # starts API on http://localhost:3000
```

### 3. Frontend
```
cd frontend
npm install
npm start                   # starts Angular dev server on http://localhost:4200
```

The frontend expects the API at `http://localhost:3000/api` (see
`frontend/src/environments/environment.ts`).

## API Overview

| Method | Endpoint                | Description                              |
|--------|--------------------------|-------------------------------------------|
| GET    | /api/word-types          | List all grammatical word types           |
| GET    | /api/words?typeId=       | List words, optionally filtered by type   |
| GET    | /api/sentences            | List all saved sentences                  |
| GET    | /api/sentences/:id        | Get a single saved sentence                |
| POST   | /api/sentences            | Save a new sentence                        |
| PUT    | /api/sentences/:id        | Edit an existing saved sentence            |

## User stories covered
- **US-01/US-02** — `GET /api/word-types` + `GET /api/words?typeId=` power the
  word-type selector and word list components.
- **US-03** — the sentence builder component lets the user append selected
  words into an ordered sentence in the browser.
- **US-04** — `POST /api/sentences` persists the finished sentence.
- **US-05** — `PUT /api/sentences/:id` lets a saved sentence be reloaded into
  the builder, edited, and re-saved.
- **US-06** — `GET /api/sentences` backs the saved-sentences list/review view.
