# Pastebin Application

This is a simple web application that allows users to create and share text snippets (pastes). When a user submits text, the application generates a unique random URL where the content can be viewed. The data is stored in memory and expires after 24 hours.

## Features

- Create text pastes.
- Generate a unique, random URL for each paste.
- View pastes at their unique URL.
- "Copy URL" button to easily share the link.
- Pastes automatically expire after 24 hours.
- In-memory storage, no database required.
- Dockerized for easy deployment.

## Technology Stack

- **Backend:** Node.js, Express.js
- **Template Engine:** EJS (Embedded JavaScript)
- **Containerization:** Docker

## Project Structure

```
/
├── Dockerfile
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

- [Node.js](https://nodejs.org/) and npm
- [Docker](https://www.docker.com/)

### Running Locally

1.  **Clone the repository (or set up the files as done previously).**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    npm start
    ```

4.  Open your browser and navigate to `http://localhost:3000`.

### Running with Docker

You can either build the Docker image from the source or pull the pre-built image from Docker Hub.

#### 1. Build from Source

1.  **Build the Docker image:**
    ```bash
    docker build -t pastebin-app .
    ```

2.  **Run the Docker container:**
    ```bash
    docker run -d -p 3000:3000 --name pastebin-container pastebin-app
    ```

#### 2. Pull from Docker Hub

The image is publicly available on Docker Hub.

1.  **Pull the image:**
    You can pull either a specific version or the latest one.
    ```bash
    # Pull version 1
    docker pull jgkong/pastebin-app:1

    # Or pull the latest version
    docker pull jgkong/pastebin-app:latest
    ```

2.  **Run the Docker container:**
    ```bash
    docker run -d -p 3000:3000 --name pastebin-container jgkong/pastebin-app:1
    ```

After running the container, the application will be accessible at `http://localhost:3000`.

## API Routes

- `GET /`: Displays the main page to create a new paste.
- `POST /`: Creates a new paste, saves it, and redirects to the new paste's URL.
- `GET /:id`: Displays the content of the paste with the corresponding ID.
