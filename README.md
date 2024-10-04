# Power Gym Server

## Table Of Content
- [Description](#Descriptions)
- [DBDiagram](#DBDiagram)
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variable](#environment-variables)
- [Running Locally](#running-locally)



## Descriptions

The Power Gym Management System is a web application designed to help gyms manage their daily tasks more easily. It allows gym staff to handle things like member management, class scheduling, and fitness tips. Members can sign up for classes and track their progress.

Key Features:
- Admin Dashboard: Admins can add, update, and manage users, gym classes, and fitness tips.
- Member Portal: Members can view available classes, join sessions, and receive fitness tips.
- User Authentication: Secure login for users, with special access for admins.
- Database: Data is securely stored using MongoDB.
- Token-Based Security: JWT tokens are used to secure user authentication.

This system simplifies gym management for both staff and members.

## DB_Diagram

![diagram](https://i.ibb.co.com/2sDWd8L/Untitled-1.png)


## Technologies

- Built with **Mongoose** & **Express**
- Used **MongoDB** as database


## Installation

**Prerequisites:**

- **Node.js:** Ensure you have Node.js (version 14 or higher) installed on your system. If not, download and install it from the official Node.js website: [https://nodejs.org/](https://nodejs.org/)

1. Clone the repository:
   ```bash
    git clone https://github.com/Tahsin0909/powerGym_server.git
   ```
2. Install dependencies:
   ```bash
    npm install
   ```

## Running Locally

1. Start the development server:
   ```bash
    nodemon index.js
   ```
2. Access the application in your browser at `http://localhost:2000/`.


## Environment Variables

1. Create a file named `.env` in the root directory of the project.
2. Replace the following placeholder values with your own database credentials:

```.md
DB_USERNAME=YOUR_MongoDB_USERNAME
DB_PASSWORD=YOUR_MongoDB_PASSWORD
DB_NAME=YOUR_MongoDB_DATABASE_NAME
```

- You can obtain these values from the MongoDB Database access for your MongoDB project.
