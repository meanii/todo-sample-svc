# Todo Service with User Management

A sample todo service with user management for demonstration purposes, written in Express.js and MongoDB.

## Content of Table
- [Installation](#installation)
    - [Legacy](#legacy)
    - [Docker](#docker)
- [Docs](#docs)

## Installation

### Legacy

#### Prerequisites
- Node.js
- MongoDB
- pnpm
- git

#### Steps
1. **Clone the repository:**
```sh
git clone https://github.com/meanii/todo-sample-svc.git
cd todo-sample-srv
pnpm install
pnpm run start
```

### Docker

#### Prerequisites

- Docker
- Docker Compose
- git

#### Steps
1. **Clone the repository:**
```sh
git clone https://github.com/meanii/todo-sample-svc.git
cd todo-sample-srv
```

1. **Set up the .env file:**
Create a `.env` file in the root directory of the project and add the necessary environment variables.

1. **Build the Docker image:**
```sh
docker compose build
```

1. **Run the Docker container:**
```sh
docker compose up -d
```

## Docs
- Users Swagger: [hhttps://apis.users.demo.meanii.dev/users/docs](https://apis.users.demo.meanii.dev/users/docs)
- Todos Swagger: [https://apis.tasks.demo.meanii.dev/todos/docs](https://apis.tasks.demo.meanii.dev/todos/docs)