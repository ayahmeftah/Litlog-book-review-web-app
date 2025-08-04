# 📖 Litlog - Book Review Web App

## Introduction

Litlog is a book review platform designed for both readers and authors. Users can discover books, track their reading journey, write reviews, and read vibrant literary community's reviews. Authors can also showcase their books and receive valuable feedback from readers.

<img width="1897" height="892" alt="Image" src="https://github.com/user-attachments/assets/448de8ee-e042-49bf-b26b-ffbafcda1571" />

<img width="1900" height="904" alt="Image" src="https://github.com/user-attachments/assets/f9f9cc80-43a9-4c1b-b197-925ac5fb6974" />
*A dynamic web application where readers and authors meet to share, rate, and review books.*

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

## 🚀 Getting Started

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
    npm



Attributions

cloudinary and multer

- https://dev.to/njong_emy/how-to-store-images-in-mongodb-using-cloudinary-mern-stack-imo
- https://cloudinary.com/documentation/node_integration
- https://www.npmjs.com/package/multer
- https://www.npmjs.com/package/multer-storage-cloudinary

password validation
- https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters

bootstrap
- https://getbootstrap.com/docs/5.3/layout/breakpoints/

logo generator
- https://app.brandmark.io/v3/


- https://litlog-book-review-web-app.onrender.com