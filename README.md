# Mindspire - Blog Application

This is a blog application where users can create, read, update, and delete their blogs. Users can also comment on other people's blogs.

## Features

- Post a new blog
- Read all the blogs
- Update existing blogs you have created
- Delete your blogs
- Comment on other people's blogs

## Tech Stack

- Frontend: React, Redux
- Backend: Node.js, Express
- Database: MongoDB

## Prerequisites

Make sure you have the following installed:

- Node.js
- VS Code (personal choice)

## Setup

- Clone the repository

```bash
git clone https://github.com/Akhash/Blog-Application.git
```

- Navigate to the project folder

```
> cd Blog Application
```

### Backend Setup

- Navigate to the backend folder

```
> cd backend
```

- Install dependencies

```
> npm install
```

- Set up environment variables

  Create a .env file in the backend folder and add the following:

```
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_secret
```

- Run the backend server

```
> npm start
```

### Frontend Setup

- Open a new terminal window/tab and navigate to the frontend folder

```
> cd frontend
```

- Install dependencies

```
> npm install
```

- Set up environment variables

  Create a .env file in the frontend folder and add the following

```
REACT_APP_BACKEND_API_URL=your_backend_api_url
```

- Run the frontend

```
> npm start
```

Open your browser and visit http://localhost:3000
