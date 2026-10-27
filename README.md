# Notes REST API

A simple REST API built with **Node.js** and **Express** for managing notes.
Data is stored in a local JSON file (`notes.json`), so no database setup is required.

## Features

- Add a new note
- View all notes or a single note
- Update an existing note
- Delete a note
- Basic validation and proper HTTP status codes (201, 400, 404)

## Tech Stack

- Node.js
- Express
- JSON file storage

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)

### Installation

```bash
git clone <your-repo-url>
cd notes-api
npm install
```

### Run the server

```bash
npm start
```

The server runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint      | Description          |
|--------|---------------|----------------------|
| GET    | `/`           | Health check         |
| POST   | `/notes`      | Create a new note    |
| GET    | `/notes`      | Get all notes        |
| GET    | `/notes/:id`  | Get a note by id     |
| PUT    | `/notes/:id`  | Update a note        |
| DELETE | `/notes/:id`  | Delete a note        |

## Request & Response Examples

### Create a note

**POST** `/notes`

```json
{
  "title": "Buy milk",
  "content": "2 litres"
}
```

**Response** `201 Created`

```json
{
  "id": 1,
  "title": "Buy milk",
  "content": "2 litres",
  "createdAt": "2026-10-17T10:00:00.000Z"
}
```

### Get all notes

**GET** `/notes`

**Response** `200 OK`

```json
[
  {
    "id": 1,
    "title": "Buy milk",
    "content": "2 litres",
    "createdAt": "2026-10-17T10:00:00.000Z"
  }
]
```

### Update a note

**PUT** `/notes/1`

```json
{
  "content": "3 litres"
}
```

**Response** `200 OK` with the updated note.

### Delete a note

**DELETE** `/notes/1`

**Response** `200 OK`

```json
{
  "message": "Note deleted",
  "note": { "id": 1, "title": "Buy milk", "content": "3 litres" }
}
```

## Error Responses

| Status | When                                  |
|--------|---------------------------------------|
| 400    | `title` is missing or empty           |
| 404    | Note id or route does not exist       |

## Testing with Postman

1. Start the server with `npm start`.
2. Open Postman and create a request for each endpoint above.
3. For POST and PUT, set **Body → raw → JSON**.
4. Check the response status and body.

Or test with curl:

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello"}'

curl http://localhost:3000/notes
```

## Project Structure

```
API/
├── server.js       # API code
├── package.json    # Project config and dependencies
├── notes.json      # Auto-created data file
└── README.md
```

## Author

Abhiram Manoj Ganta
