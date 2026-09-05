# 3W Social Post Application

A simple full-stack social media application developed as part of the 3W Full Stack Internship Assignment.

## Live Demo

https://3w-social-app-indol.vercel.app

## Features

- User signup and login
- JWT-based authentication
- Create text posts
- Create image posts
- Create posts with both text and images
- View posts from other users
- Like and unlike posts
- Comment on posts
- Display usernames for likes and comments
- Delete your own posts
- Search posts
- Responsive dark-themed UI

## Technologies Used

### Frontend
- React.js
- Vite
- CSS

### Backend
- Node.js
- Express.js
- JWT
- bcryptjs

### Database
- MongoDB Atlas
- Mongoose

## Project Structure

3w-social-app/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Auth.jsx
│   │   ├── PostCard.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── server.js
│   ├── package.json
│   └── ...
│
└── README.md

## Database

The application uses two MongoDB collections:

- users - stores user account information
- posts - stores posts, likes, and comments

## Authentication

Users can create an account using their username, email, and password.

Passwords are securely hashed using bcryptjs.

After login, a JWT token is generated and used to authenticate protected actions such as creating posts, liking, commenting, and deleting posts.

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Assignment Requirements Covered

- User registration and login
- Create text or image posts
- View posts from all users
- Like posts
- Comment on posts
- Store usernames of users who liked or commented
- Delete own posts
- Search posts
- Responsive user interface
- Full-stack React, Node.js, Express, and MongoDB implementation

## Author

Maragoni Surya
