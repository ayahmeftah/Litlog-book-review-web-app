# 📖 Litlog - Book Review Web App

## Introduction

Litlog is a book review platform designed for both readers and authors. Users can discover books, track their reading journey, write reviews, and read vibrant literary community's reviews. Authors can also showcase their books and receive valuable feedback from readers.

<img width="1897" height="892" alt="Image" src="https://github.com/user-attachments/assets/448de8ee-e042-49bf-b26b-ffbafcda1571" />

<img width="1900" height="904" alt="Image" src="https://github.com/user-attachments/assets/f9f9cc80-43a9-4c1b-b197-925ac5fb6974" />


## 📌 Features

- **User Roles:** Separate interfaces for readers and authors
- **Authentication:** Secure signup, login, and session management
- **Profile Management:** Edit profile, upload profile pictures, and delete accounts
- **Bookshelves:** Manage reading status — *Want to Read*, *Currently Reading*, and *Read*
- **Reviews:** Add, edit, delete, and view reviews with star ratings
- **Cloudinary Integration:** Profile and book image uploads
- **Search & Filtering:** Easily search and explore books by genre or title
- **User Profile:** Users can manage their account, books and reading list
- **Top Rated Books:** Highlights the most highly-rated books

### Planning Materials

- [Trello Board - LitLog MEN Stack Website](https://trello.com/invite/b/688a765ce8b55474f5700184/ATTIa50eb833c445c76c98bfa1eb28b576e243881A14/litlog-menstack-website)

## 📚 Books Routes

| HTTP Method | Route                     | Action       | Description                                           |
|-------------|---------------------------|--------------|-------------------------------------------------------|
| GET         | /books                    | Index        | Displays a list of all books                         |
| GET         | /book/home                | Home         | Displays home page with recommended books            |
| GET         | /books/new                | New          | Shows a form to create a new book                    |
| POST        | /books                    | Create       | Creates a new book                                   |
| GET         | /books/:id                | Show         | Displays details of a specific book                  |
| GET         | /books/:id/edit           | Edit         | Shows a form to edit a book                          |
| PUT         | /books/:id                | Update       | Updates a specific book                              |
| DELETE      | /books/:id                | Destroy      | Deletes a specific book                              |
| POST        | /books/:id/shelf          | Shelf        | Adds/updates/removes a book in user's bookshelf      |
| GET         | /books/:id/reviews        | Book Reviews  | Shows all reviews for a specific book                |
| POST        | /books/:id/reviews        | Add Review    | Adds a review for a specific book                    |
| PUT         | /books/:id/reviews/:rid   | Edit Review   | Edits a specific review                              |
| DELETE      | /books/:id/reviews/:rid   | Delete Review | Deletes a specific review                            |

## 👤 Users Routes

| HTTP Method | Route                           | Action         | Description                                               |
|-------------|----------------------------------|----------------|-----------------------------------------------------------|
| GET         | /users/profile                   | Show Profile   | Displays the logged-in user's profile                    |
| GET         | /users/profile/edit              | Edit Profile   | Shows a form to edit user profile                        |
| PUT         | /users/profile/edit              | Update Profile | Updates user profile and optionally changes password     |
| GET         | /users/my-reviews                | My Reviews     | Displays all reviews written by the user                 |
| GET         | /users/my-bookshelves            | My Bookshelves | Displays all books in the user's bookshelf               |
| GET         | /users/my-bookshelves/:status    | Shelf Filter   | Displays books filtered by reading status                |
| GET         | /users/my-books                  | My Books       | Displays books authored by the user (if role = author)   |
| DELETE      | /users/delete-account            | Delete Account | Deletes the user account and related data                |

## 🔐 Auth Routes

| HTTP Method | Route         | Action       | Description                                      |
|-------------|---------------|--------------|--------------------------------------------------|
| GET         | /auth/sign-up | Sign Up Form | Displays the sign-up form                        |
| POST        | /auth/sign-up | Register     | Creates a new user and logs them in             |
| GET         | /auth/login   | Login Form   | Displays the login form                         |
| POST        | /auth/login   | Login        | Logs in the user and starts a session           |
| GET         | /auth/logout  | Logout       | Logs out the user and destroys their session    |


## 🚀 Getting Started

### 🔗 Visit the Deployed Website

- [Litlog Books Reviews Website Deployed Link](https://litlog-book-review-web-app.onrender.com)

### 🛠️ Run the Website Locally

### Prerequisites
- Node.js
- MongoDB (local or Atlas)
- Cloudinary account for image hosting

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ayahmeftah/Litlog-book-review-web-app.git
   cd Litlog-book-review-web-app
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a .env file in the root directory and add the following:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    SESSION_SECRET=your_session_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. Start the app:
    ```bash
    npm start
    ```

5. Visit: http://localhost:3000/books/home

## 🙏 Attributions

- [Bootstrap](https://getbootstrap.com/) for responsive UI components
- [Cloudinary](https://cloudinary.com/) for image management
- [Brandmark](https://app.brandmark.io/v3/) for logo generation
- [Password Validation](https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters) from stacjoverflow
- [Poppins](https://fonts.google.com/specimen/Poppins) google font

- Book cover images and descriptions inspired by public sources for demo purposes

## 🧠 Technologies Used

- Node.js + Express (Backend)
- MongoDB + Mongoose (Database & ODM)
- EJS (Templating Engine)
- Bootstrap 5 (Frontend Framework)
- Cloudinary (Image Hosting)
- Multer (File Upload Middleware)
- bcrypt (Password Hashing)
- Express-session (Authentication)
- Method-override (PUT/DELETE in forms)

## 🚧 Future Enhancements

- Personalized book recommendations based on users’ favorite genres and reading history.  
- Community discussion feature allowing users to comment on and reply to reviews.  
- Reading challenges dashboard (e.g., “Read 15 books in 3 months”) with progress tracking.  
- Notification system for replies, challenge milestones, and new books in preferred genres.  
- Follow system to connect with users who share similar reading interests.
