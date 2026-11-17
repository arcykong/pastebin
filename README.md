# Pastebin Application

This is a simple web application for creating and sharing text snippets (pastes) through randomly generated URLs. Pastes are stored in memory and expire after 24 hours. Restarting or recreating the container removes all stored pastes.

## Features

- Create text pastes.
- Generate an 8-character URL using lowercase letters and digits, excluding `0`, `1`, `o`, and `l` to reduce confusion.
- Click HTTP and HTTPS links to open them in a new tab while preserving the displayed text, spaces, and line breaks for selection and copying.
- Use "Copy URL", "Copy Text", and "New Paste" buttons to share, copy the original text, or start a new paste.
- Automatically follow the operating system's light or dark mode; QR codes retain a white background.
- Pastes automatically expire after 24 hours.
- In-memory storage, no database required.
- Dockerized for easy deployment.

## Technology Stack

- **Backend:** Node.js 24, Express.js
- **Template Engine:** EJS (Embedded JavaScript)
- **Containerization:** Docker

## Project Structure

```
/
├── Dockerfile
├── .dockerignore
├── index.js
├── package.json
├── package-lock.json
├── public/
│   └── css/
│       └── style.css
└── views/
    ├── index.ejs
    ├── notfound.ejs
    └── paste.ejs
```

## Getting Started

### Prerequisites

- Node.js 24 and npm for local development
- Docker with the Docker Compose plugin for container deployment

### Running Locally

1.  **Clone the repository (or set up the files as done previously).**

2.  **Install dependencies:**
    ```bash
    npm ci
    ```

3.  **Start the server:**
    ```bash
    npm start
    ```

4.  Open your browser and navigate to `http://localhost:3000`.

### Running with Docker

Build locally for the target server architecture. The current server uses ARM64; do not reuse an x64-only image. The build uses Node.js 24 and `npm ci`, and `.dockerignore` excludes `.git/` from the build context.

#### 1. Build from Source

1.  **Build the Docker image:**
    ```bash
    docker build -t pastebin:3 -t jgkong/pastebin:3 .
    ```

2.  **Run the Docker container:**
    ```bash
    docker run -d -p 3000:3000 --name pastebin-container pastebin:3
    ```

#### 2. Deploy with Docker Compose

The current server's Compose configuration is `/opt/docker/pastebin/compose.yaml`, outside this repository. It uses the locally built `pastebin:3` image with automatic restart, a health check, and log rotation. The `jgkong/pastebin:3` tag above is also local; building does not publish it to Docker Hub.

1.  **Build the image from the repository directory:**
    ```bash
    docker build -t pastebin:3 -t jgkong/pastebin:3 .
    ```

2.  **Start or update the Compose service:**
    ```bash
    docker compose -f /opt/docker/pastebin/compose.yaml up -d --wait
    ```

The standalone container is accessible at `http://localhost:3000`. The Compose service exposes port 3000 only within the existing external `proxy_net` network; Cloudflare Tunnel can use `http://pastebin:3000` as its service URL. Configure the public hostname separately. Rebuilding and redeploying replaces the container and clears its in-memory pastes.

## API Routes

- `GET /`: Displays the main page to create a new paste.
- `POST /`: Creates a new paste, saves it, and redirects to the new paste's URL.
- `GET /:id`: Displays the content of the paste with the corresponding ID.
