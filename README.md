# Todo App CLI

A simple command-line Todo application with user registration, login, and task management features.

## Features

- User Registration with validation
- User Login
- Add Tasks with title, description, due date, and priority
- View All Tasks
- Edit Tasks
- Delete Tasks
- Search Tasks by keyword
- Logout

## Prerequisites

- Node.js installed
- MySQL database running
- Database credentials configured in `.env` file

## Setup

1. Make sure your `.env` file has the correct database credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sdet_todo
DB_USER=root
DB_PASSWORD=your_password
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Make sure your MySQL database is running and the database `sdet_todo` exists.

## Run the Application

```bash
node main.js
```

## How to Use

### Main Menu
When you start the app, you'll see:
- **Register**: Create a new account
- **Login**: Login with existing account
- **Exit**: Close the application

### After Login - Todo Menu
- **Add Task**: Create a new task with title, description, due date, and priority
- **View All Tasks**: See all your tasks
- **Edit Task**: Update an existing task
- **Delete Task**: Remove a task
- **Search Tasks**: Find tasks by keyword in title or description
- **Logout**: Return to main menu

## Validation Rules

### Registration
- Name cannot be empty
- Email must be in valid format
- Email must be unique
- Password must be at least 4 characters

### Login
- Email and password must match registered user

### Add/Edit Task
- Task title cannot be empty
- Priority must be: Low, Medium, or High
- Status must be: Pending or Completed

## Database Tables

### Users Table
- id
- name
- email
- password
- createdAt
- updatedAt

### Todos Table
- id
- userId (foreign key)
- title
- description
- dueDate
- priority
- status
- createdAt
- updatedAt
