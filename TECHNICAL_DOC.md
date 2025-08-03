# Technical Documentation for LLM Analysis

This document provides a detailed technical breakdown of the Pastebin application. It is intended for analysis by Large Language Models (LLMs) or for developers seeking a deep understanding of the codebase, architecture, and deployment process.

## 1. Project Overview

This is a minimalist web application for creating and sharing text snippets. It is built with Node.js and Express.js. The application is designed to be stateless in the sense that it does not require an external database; all data is stored in a volatile in-memory JavaScript object. The entire application is containerized with Docker for portability and ease of deployment.

## 2. Core Architecture

- **Backend Runtime:** Node.js
- **Web Framework:** Express.js
- **View Engine:** EJS (Embedded JavaScript) for server-side rendering of HTML.
- **Data Storage:** A single JavaScript object (`pastes`) in the running Node.js process memory. Data is ephemeral and will be lost on application restart.
- **Containerization:** Docker. A `Dockerfile` is provided to build a production-ready image.

## 3. Data Model

The application uses a single JavaScript object, `pastes`, as its in-memory database. The keys of this object are the randomly generated paste IDs.

The structure of a single paste object stored within `pastes` is as follows:

```json
{
  "text": "string",         // The user-submitted text content.
  "createdAt": "Date",      // JavaScript Date object: The timestamp when the paste was created.
  "ip": "string",           // The IP address of the client who created the paste.
  "expiresAt": "Date",    // JavaScript Date object: The timestamp when the paste will expire (24 hours after creation).
  "deleted": "boolean",     // A flag to mark the paste as deleted. Currently no API to set this.
  "lastRead": "Date | null" // JavaScript Date object: The timestamp of the last time the paste was read. Null if never read.
}
```

## 4. File-by-File Breakdown

This section details the purpose and logic of each critical file in the project.

### `index.js`
This is the main entry point and the core of the application. It performs the following functions:
- **Initialization:** Imports `express` and `path`, initializes the Express app, and defines the `pastes` object for storage.
- **Middleware Setup:**
  - `app.set('view engine', 'ejs')`: Configures EJS as the template engine.
  - `express.urlencoded({ extended: true })`: Parses incoming `application/x-www-form-urlencoded` payloads (form submissions).
  - `express.static('public')`: Serves static files (like CSS) from the `public` directory.
- **Route Handling:** Defines the application's routes (see API Specification below).
- **Helper Functions:**
  - `generateId(length = 8)`: Creates a random alphanumeric string of a given length to be used as the paste ID.
- **Server Activation:** Starts the HTTP server, listening on `PORT` 3000.

### `Dockerfile`
This file contains the instructions for building the application's Docker image.
- `FROM node:20-slim`: Uses a lightweight, official Node.js 20 image as the base.
- `WORKDIR /usr/src/app`: Sets the working directory inside the container.
- `COPY package*.json ./`: Copies the package manifests to install dependencies efficiently using Docker's layer caching.
- `RUN npm install`: Installs the Node.js dependencies.
- `COPY . .`: Copies the rest of the application source code into the container.
- `EXPOSE 3000`: Informs Docker that the container listens on port 3000.
- `CMD [ "npm", "start" ]`: Specifies the default command to run when the container starts.

### `package.json`
Defines the project's metadata and dependencies.
- **`dependencies`**: Lists `express` and `ejs`.
- **`scripts`**: Contains the `start` script (`node index.js`) used to run the application locally and by the Docker container.

### `views/` Directory
Contains the EJS templates for server-side rendering.
- **`index.ejs`**: The main page (`/`). Contains an HTML form with a `<textarea>` for users to submit text.
- **`paste.ejs`**: The view page (`/:id`). Displays the stored text in a read-only `<textarea>`. It includes client-side JavaScript to copy the current URL to the clipboard.
- **`notfound.ejs`**: The error page. Displayed for pastes that are not found, have expired, or are deleted.

### `public/` Directory
Contains static assets served to the client.
- **`css/style.css`**: Provides basic styling for the application's HTML pages.

## 5. API Specification

### Create a New Paste
- **Route:** `POST /`
- **Description:** Accepts form data to create a new paste.
- **Request Body:** `application/x-www-form-urlencoded` with a single field: `text` (string).
- **Success Response:**
  - **Status Code:** `302 Found`
  - **Headers:** `Location: /<generated_id>`
  - **Behavior:** Redirects the client to the newly created paste's view page.
- **Error Response:**
  - **Status Code:** `400 Bad Request`
  - **Body:** Plain text `"Content cannot be empty"` if the `text` field is missing or empty.

### View a Paste
- **Route:** `GET /:id`
- **Description:** Displays the content of a specific paste.
- **URL Parameters:** `id` (string) - The unique ID of the paste.
- **Success Response:**
  - **Status Code:** `200 OK`
  - **Content-Type:** `text/html`
  - **Body:** Renders the `paste.ejs` template with the paste's text.
- **Error Response:**
  - **Status Code:** `404 Not Found`
  - **Content-Type:** `text/html`
  - **Body:** Renders the `notfound.ejs` template if the paste ID does not exist, the paste has expired, or it is marked as deleted.

## 6. Deployment and Execution Flow

### Docker Hub Repository
- **Repository Name:** `jgkong/pastebin-app`
- **Available Tags:**
  - `1`: A specific versioned release.
  - `latest`: The most recent build.

### Execution from Docker Hub
1.  **Pull Image:** `docker pull jgkong/pastebin-app:latest`
2.  **Run Container:** `docker run -d -p 3000:3000 --name pastebin-container jgkong/pastebin-app:latest`
3.  **Access:** The application becomes available at `http://localhost:3000`.
