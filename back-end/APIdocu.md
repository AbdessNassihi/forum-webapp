# Forum Webapp API Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
   - [Login](#login)
   - [Logout](#logout)
   - [Register](#register)
3. [User Management](#user-management)
   - [Get User Info](#get-user-info)
   - [Find User by Username](#find-user-by-username)
   - [Retrieve User Profile Image](#retrieve-user-profile-image)
   - [Update Username](#update-username)
   - [Update User Text](#update-user-text)
   - [Update Password](#update-password)
   - [Update Profile Image](#update-profile-image)
   - [Update User Admin Status](#update-user-admin-status)
   - [Delete User](#delete-user)
4. [Thread Management](#thread-management)
   - [Retrieve Threads](#retrieve-threads)
   - [Retrieve Specific Thread](#retrieve-specific-thread)
   - [Create a Thread](#create-a-new-thread)
   - [Update Thread Title](#update-thread-title)
   - [Delete a Thread](#delete-a-thread)
   - [Retrieve Posts in a Thread](#retrieve-posts-of-a-thread)
   - [Create a Post in a Thread](#create-a-new-post-in-a-thread)
5. [Post Management](#post-management)
   - [Retrieve Specific Post](#retrieve-a-post)
   - [Retrieve Posts for the User Feed](#retrieve-user-feed-posts)
   - [Update Post Content](#update-post-content)
   - [Like a Post](#like-a-post)
   - [Pin or Unpin a Post](#pin-or-unpin-a-post)
   - [Delete a Post](#delete-a-post)
   - [Retrieve Comments on a Post](#retrieve-comments-of-a-post)
   - [Create a Comment on a Post](#create-a-comment-on-a-post)
6. [Comment Management](#comment-management)
   - [Like a Comment](#like-a-comment)
   - [Delete a Comment](#delete-a-comment)
7. [Follow Management](#follow-management)
   - [Follow a User](#follow-a-user)
   - [Unfollow a User](#unfollow-a-user)
8. [Subscription Management](#subscription-management)
   - [Subscribe to a Thread](#subscribe-to-a-thread)
   - [Unsubscribe from a Thread](#unsubscribe-from-a-thread)

## Introduction

This documentation tells how to interact with the Forum Webapp to manage users, threads, posts, comments, and more.

- **Base URL**: `http://localhost:3000`

## Authentication

### **Login**

- **Endpoint**: `POST /auth/login`
- **Description**: Authenticates a user and starts a session.

**Request:**

- **Headers**: None
- **Body**: The request body should be in JSON format, containing:

      {
          "username" (string): The username,
          "password" (string): The password
      }

**Response:**

- **Status Codes**:

  - `200 OK`: Indicates that authentication succeeded.
  - `401 Unauthorized`: Indicates that authentication failed, or the user does not exist.
  - `500 Internal Server Error`: Indicates that an error occurred during authentication.

- **Response Body**:

  - On success (200 OK):

              {
                  "code": 200,
                  "status": "OK",
                  "message": "Authentication succeeded",
                  "user":
                      {
                        "iduser": 1,
                        "username": "user",
                        "email": "user@gmail.com",
                        "is_admin": null,
                        "img_url": "/uploads/default_ProfileImage.jpg",
                        "textuser": "text of the user"
                      }
              }

  - On failure (401 Unauthorized):

    - User is not found.

           {
               "code": 401,
               "status": "Unauthorized",
                "errors": [
                   {
                       "path": "username",
                       "msg": "User not found"
                   }
               ]
           }

    - Password is incorrect.

            {
                "code": 401,
                "status": "Unauthorized",
                "errors": [
                    {
                        "path": "password",
                        "msg": "Invalid password"
                    }
                ]
            }

  - On error (500 Internal Server Error):

            {
                "code": 500,
                "status": "Error",
                "message": "An error occurred during authentication" OR "Login failed"
            }

---

### **Logout**

- **Endpoint**: `GET /auth/logout`
- **Description**: Logs out the authenticated user and ends the session.

**Request:**

- **Headers**: None
- **Body**: No request body is needed.

**Response:**

- **Status Codes**:

  - `200 OK`: Indicates that logout succeeded.
  - `401 Unauthorized`: Indicates that the user is not authenticated.
  - `400 Bad Request`: Indicates that logout failed due to a server error.

- **Response Body**:

  - On success (200 OK):

        {
            "code": 200,
            "status": "OK",
            "message": "You have been logged out"
        }

  - On unauthorized access (401 Unauthorized):

        {
            "code": 401,
            "status": "Unauthorized",
            "message": "User not authenticated"
        }

  - On error (400 Bad Request):

        {
            "code": 400,
            "status": "Bad Request",
            "message": 'Logout failed'
        }

---

### **Register**

- **Endpoint**: `POST /auth/register`
- **Description**: Registers a new user in the system.

**Request:**

- **Headers**: None
- **Body**: The request body should be in JSON format, containing:

          {
              "username"(string): The username,
              "email"(string):The email adress,
              "textuser"(string): The user description,
              "password"(string): The password
          }

**Response:**

- **Status Codes**:

  - `201 Created`: Indicates that the user registration was successful.
  - `401 Unauthorized`: Indicates that the registration failed due to invalid input (e.g., username or email already used).
  - `500 Internal Server Error`: Indicates that an error occurred during registration.

- **Response Body**:

  - On success (201 Created):

        {
            "code": 201,
            "status": "Created",
            "message": "User registered successfully",
        }

  - On failure (400 Bad Request):

    - Username is not valid

          {
              "code": 400,
              "status": "Bad Request",
              "errors": [
                  {
                      "type": "field",
                      "value": "",
                      "msg": "Username must be between 3 and 20 characters long",
                      "path": "username",
                      "location": "body"
                  }
              ]
          }

    - Username not available

            {
                "code": 400,
                "status": "Bad Request",
                "errors": [
                    {
                        "path": "username",
                        "msg": "username already used"
                    }
                ]
            }

    - Email is not valid

            {
                "code": 400,
                "status": "Bad Request",
                "errors": [
                    {
                        "type": "field",
                        "value": "",
                        "msg": "Invalid email format",
                        "path": "email",
                        "location": "body"
                    }
                ]
            }

    - Email not available

            {
                "code": 400,
                "status": "Bad Request",
                "errors": [
                    {
                        "path": "email",
                        "msg": "email already used"
                    }
                ]
            }

    - Password is not valid

            {
                "code": 400,
                "status": "Bad Request",
                "errors": [
                    {
                        "type": "field",
                        "value": "Passwordofuser",
                        "msg": "Password must be 8-50 characters long, with at least one uppercase, one lowercase, one digit, one symbol, and no spaces.",
                        "path": "password",
                        "location": "body"
                    }
                ]
            }

  - On error (500 Internal Server Error):

            {
                "code": 500,
                "status": 'Internal Server Error',
                "message": 'Error while registering user',
                "log": "the error message"
            }

## User Management

### **Get User Info**

- **Endpoint**: `GET /users/:iduser`
- **Description**: Retrieves detailed information about a specific user, including their posts, created threads, followed threads, and follower statistics.

**Request:**

- **URL Parameters**:

  - iduser: The unique identifier of the user whose information is being retrieved.

- **Headers**: None
- **Body**: No request body is needed.

**Response:**

- **Status Codes**:

  - `200 OK`: User information was retrieved successfully.
  - `404 Not Found`: The specified user was not found.
  - `500 Internal Server Error`: An error occurred while retrieving user information.

- **Response Body**:

  - On success (200 OK):

        {
          "code": 200,
          "status": "OK",
          "message": "User retrieved successfully",
          "user": {
            "id": 2,
            "isAdmin": null,
            "username": "user",
            "email": "user@gmail.com",
            "textuser": "text of the user",
            "posts": [],
            "createdThreads": [],
            "followedThreads": [],
            "numFollowers": 0,
            "numFollowings": 0
            }
        }

  - On failure (404 Not Found):

            {
              "code": 404,
              "status": "Not Found",
              "message": "User not found"
            }

  - On error (500 Internal Server Error):

            {
                "code": 500,
                "status": 'Internal Server Error',
                "message": 'Error while retrieving user',
                "log": "the error message"
            }

---

### **Find User by Username**

- **Endpoint**: `GET /users/username/:username`
- **Description**: Retrieves user information based on the username specified by `username`.

**Request:**

- **URL Parameters**:

  - username: The username of the user being searched for.

- **Headers**: None
- **Body**: No request body is needed.

**Response:**

- **Status Codes**:

  - `200 OK`: The user was found and information retrieved successfully.
  - `404 Not Found`: No user was found with the specified username.
  - `500 Internal Server Error`: An error occurred while retrieving user information.

- **Response Body**:

  - On success (200 OK):

        {
          "code": 200,
          "status": "OK",
          "message": "User retrieved successfully",
          "user": {
            "iduser": 2,
            "username": "user",
            "email": "user@gmail.com",
            "textuser": "text of the user",
            "is_admin": null,
            "num_followers": 0,
            "num_followings": 0,
            "is_following": 0
        }

    }

  - On failure (404 Not Found):

        {
          "code": 404,
          "status": "Not Found",
          "message": "User not found"
        }

  - On error (500 Internal Server Error):

        {
          "code": 500,
          "status": 'Internal Server Error',
          "message": 'Error while retrieving user',
          "log": "the error message"
        }

---

### **Retrieve User Profile Image**

- **Endpoint**: `GET /users/:iduser/image/`
- **Description**: Retrieves the profile image of a specific user identified by `iduser`.

**Request:**

- **URL Parameters**:

  - iduser: The unique identifier of the user whose profile image is being retrieved.

- **Headers**: None
- **Body**: No request body is needed.

**Response:**

- **Status Codes**:

  - `200 OK`: The profile image was retrieved successfully.
  - `404 Not Found`: The specified user was not found.
  - `500 Internal Server Error`: An error occurred while retrieving the profile image.

- **Response Body**:

  - On success (200 OK):

    - The response includes the user's profile image.

  - On failure (404 Not Found):

        {
          "code": 404,
          "status": "Not Found",
          "message": "User not found"
        }

  - On error (500 Internal Server Error):

        {
          "code": 500,
          "status": 'Internal Server Error',
          "message": 'Error while retrieving user',
          "log": "the error message"
        }

---

### **Update Username**

- **Endpoint**: `PUT /users/username`
- **Description**: Updates the username of the authenticated user.

**Request:**

- **Headers**: None
- **Body**: The request body should be in JSON format, containing:

      {
        "username"(string): The username
      }

**Response:**

- **Status Codes**:

  - `200 OK`: The username was updated successfully.
  - `401 Unauthorized`: The request was invalid, or the username is already in use.
  - `404 Not Found`: The specified user was not found.
  - `500 Internal Server Error`: An error occurred while updating the username.

- **Response Body**:

  - On success (200 OK):

        {
          "code": 200,
          "status": "OK",
          "message": "Username updated successfully",
          "field": "username"
        }

  - On failure (400 Bad Request):

    - Username is not available

            {
              "code": 400,
              "status": "Bad Request",
              "errors": [
                {
                  "path": "username",
                  "msg": "username already used"
                }
              ]
            }

    - Username is not valid

            {
              "code": 400,
              "status": "Bad Request",
              "errors": [
                    {
                      "type": "field",
                      "value": "",
                      "msg": "Username must be between 3 and 20 characters long",
                      "path": "username",
                      "location": "body"
                    }
                ]
            }

  - On failure (404 Not Found):

        {
          "code": 404,
          "status": "Not Found",
          "message": "User not found"
        }

  - On error (500 Internal Server Error):

        {
          "code": 500,
          "status": 'Internal Server Error',
          "message": 'Error while updating username',
          "log": "the error message"
        }

---

### **Update User Text**

- **Endpoint**: `PUT /users/textuser`
- **Description**: Updates the bio or description of the authenticated user.

**Request:**

- **Headers**: None
- **Body**: The request body should be in JSON format, containing:

      {
        "textuser"(string): The user description
      }

**Response:**

- **Status Codes**:

  - `200 OK`: The bio was updated successfully.
  - `404 Not Found`: The specified user was not found.
  - `500 Internal Server Error`: An error occurred while updating the bio.

- **Response Body**:

  - On success (200 OK):

        {
          "code": 200,
          "status": "OK",
          "message": "Text user updated successfully",
          "field": "textuser"
        }

  - On failure (404 Not Found):

        {
          "code": 404,
          "status": "Not Found",
          "message": "User not found"
        }

  - On error (500 Internal Server Error):

        {
          "code": 500,
          "status": 'Internal Server Error',
          "message": 'Error while updating text of user',
          "log": "the error message"
        }

---

### **Update Password**

- **Endpoint**: `PUT /users/password`
- **Description**: Updates the password of the authenticated user.

**Request:**

- **Headers**: None
- **Body**: The request body should be in JSON format, containing:

      {
        "password"(string): The password
      }

**Response:**

- **Status Codes**:

  - `200 OK`: The password was updated successfully.
  - `401 Unauthorized`: The request was invalid (e.g., password too short).
  - `404 Not Found`: The specified user was not found.
  - `500 Internal Server Error`: An error occurred while updating the password.

- **Response Body**:

  - On success (200 OK):

        {
          "code": 200,
          "status": "OK",
          "message": "Password updated successfully",
          "field": "password"
        }

  - On failure (400 Bad Request):

        {
          "code": 400,
          "status": "Bad Request",
          "errors": [
            {
              "type": "field",
              "value": "password",
              "msg": "Password must be 8-50 characters long, with at least one uppercase, one lowercase, one digit, one symbol, and no spaces.",
              "path": "password",
              "location": "body"
            }
          ]

    }

  - On failure (404 Not Found):

        {
          "code": 404,
          "status": "Not Found",
          "message": "User not found"
        }

  - On error (500 Internal Server Error):

        {
          "code": 500,
          "status": 'Internal Server Error',
          "message": 'Error while updating password',
          "log": "the error message"
        }

---

### **Update Profile Image**

- **Endpoint**: `PUT /users/image`
- **Description**: Updates the profile image of the authenticated user.

**Request:**

- **Type**: use the multipart/form-data content type

- **Headers**: None
- **Body**: No request body is needed.

**Response:**

- **Status Codes**:

  - `200 OK`: The profile image was updated successfully.
  - `401 Unauthorized`: The file has an invalid file format.
  - `404 Not Found`: The specified user was not found.
  - `500 Internal Server Error`: An error occurred while updating the profile image.

- **Response Body**:

  - On success (200 OK):

        {
          "code": 200,
          "status": "OK",
          "message": "Profile image updated successfully",
          "field": "password"
        }

  - On failure (400 Bad Request):

        {
          "code": 400,
          "status": "Bad Request",
          "errors": [
            {
              "path": "image",
              "msg": "Invalid file type"
            }
          ]
        }

  - On failure (404 Not Found):

        {
          "code": 404,
          "status": "Not Found",
          "message": "User not found"
        }

  - On error (500 Internal Server Error):

        {
          "code": 500,
          "status": 'Internal Server Error',
          "message": 'Error while profile image',
          "log": "the error message"
        }

---

### **Update User Admin Status**

- **Endpoint**: `PUT /users/:iduser/admin`
- **Description**: Updates the admin status of a specific user identified by `iduser`.

**Request:**

- **URL Parameters**:

  - iduser: The unique identifier of the user whose admin status is being updated.

- **Headers**: None
- **Body**: No request body is needed.

**Response:**

- **Status Codes**:

  - `200 OK`: The admin status was updated successfully.
  - `401 Unauthorized`: The user making the request is not an administrator.
  - `404 Not Found`: The specified user was not found.
  - `500 Internal Server Error`: An error occurred while updating the admin status.

- **Response Body**:

  - On success (200 OK):

        {
          "code": 200,
          "status": "OK",
          "message": "Status updated successfully"
        }

  - On failure (401 Unauthorized):

        {
          "code": 401,
          "status": "Unauthorized",
          "message": "Operation requires to be an admin"
        }

  - On failure (404 Not Found):

        {
          "code": 404,
          "status": "Not Found",
          "message": "User not found"
        }

  - On error (500 Internal Server Error):

        {
          "code": 500,
          "status": 'Internal Server Error',
          "message": 'Error while updating status of user',
          "log": "the error message"
        }

---

### **Delete User**

- **Endpoint**: `DELETE /users/:iduser`
- **Description**: Deletes a user identified by `iduser`.

**Request:**

- **URL Parameters**:

  - iduser: The unique identifier of the user to be deleted.

- **Headers**: None
- **Body**: No request body is needed.

**Response:**

- **Status Codes**:

  - `200 OK`: The user was deleted successfully.
  - `401 Unauthorized`: The user making the request is not an administrator.
  - `404 Not Found`: The specified user was not found.
  - `500 Internal Server Error`: An error occurred while deleting the user.

- **Response Body**:

  - On success (200 OK):

        {
          "code": 200,
          "status": "OK",
          "message": "User deleted successfully"
        }

  - On failure (401 Unauthorized):

        {
          "code": 401,
          "status": "Unauthorized",
          "message": "Operation requires to be an admin"
        }

  - On failure (404 Not Found):

        {
          "code": 404,
          "status": "Not Found",
          "message": "User not found"
        }

  - On error (500 Internal Server Error):

        {
          "code": 500,
          "status": 'Internal Server Error',
          "message": 'Error while deleting user',
          "log": "the error message"
        }

## Thread Management

### Retrieve All Threads

**Endpoint:** `GET /threads`

**Description:** Retrieves all threads available.

**Request:**

- **URL Parameters:** None
- **Headers:** None
- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: Threads retrieved successfully.
  - `404 Not Found`: No threads were found.
  - `500 Internal Server Error`: An error occurred while retrieving the threads.

- **Response Body:**

  - **On success (200 OK):**

        {
          "code": 200,
          "status": "OK",
          "message": "Threads retrieved successfully",
          "threads": [ /* array of threads */ ]
        }

  - **On failure (404 Not Found):**

        {
          "code": 404,
          "status": "Not Found",
          "message": "No threads found",
          "threads": []
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while retrieving threads",
          "log": "the error message"
        }

---

### Retrieve a Specific Thread

**Endpoint:** `GET /threads/:idthread`

**Description:** Retrieves details of a specific thread specified by `idthread`.

**Request:**

- **URL Parameters:**
  - `idthread`: The unique identifier of the thread to be retrieved.
- **Headers:** None
- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: Thread retrieved successfully.
  - `404 Not Found`: The specified thread was not found.
  - `500 Internal Server Error`: An error occurred while retrieving the thread.

- **Response Body:**

  - **On success (200 OK):**

        {
          "code": 200,
          "status": "OK",
          "message": "Thread retrieved successfully",
          "data": { /* thread details */ }
        }

  - **On failure (404 Not Found):**

        {
          "code": 404,
          "status": "Not Found",
          "message": "Thread not found"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while retrieving thread",
          "log": "the error message"
        }

---

### Create a New Thread

**Endpoint:** `POST /threads`

**Description:** Creates a new thread.

**Request:**

- **URL Parameters:** None
- **Headers:** None
- **Body:**

          {
            "title" (string): The title of thread,
            "textthread" (string): The discription of the thread
          }

**Response:**

- **Status Codes:**

  - `201 Created`: The thread was created successfully.
  - `401 Unauthorized`: Validation errors occurred (e.g., duplicate title).
  - `500 Internal Server Error`: An error occurred while creating the thread.

- **Response Body:**

  - **On success (201 Created):**

        {
          "code": 201,
          "status": "Created",
          "message": "Thread created successfully"
        }

  - **On failure (400 Bad Request):**

    - Title is not available

              {
                "code": 400,
                "status": "Bad Request",
                "errors": [
                  {
                    "path": "title",
                    "msg": "title already used"
                  }
                ]
              }

    - Title is not valid

            {
              "code": 400,
              "status": "Bad Request",
              "errors": [
                    {
                      "type": "field",
                      "value": "",
                      "msg": "Title must be between 10 and 100 characters",
                      "path": "title",
                      "location": "body"
                    },
                    {
                      "type": "field",
                      "value": "",
                      "msg": "Title must contain only letters, numbers, and spaces",
                      "path": "title",
                      "location": "body"
                    }

                ]

            }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error creating thread",
          "log": "the error message"
        }

---

### Update Thread Title

**Endpoint:** `PUT /threads/title/:idthread`

**Description:** Updates the title of an existing thread specidied by `idthread`.

**Request:**

- **URL Parameters:**
  - `idthread`: The unique identifier of the thread to be updated.
- **Headers:** None
- **Body:**

      {
        "title" (string): The title of thread
      }

**Response:**

- **Status Codes:**

  - `200 OK`: The thread title was updated successfully.
  - `401 Unauthorized`: Validation errors occurred.
  - `404 Not Found`: The specified thread was not found.
  - `500 Internal Server Error`: An error occurred while updating the thread title.

- **Response Body:**

  - **On success (200 OK):**

        {
          "code": 200,
          "status": "OK",
          "message": "Thread title updated successfully"
        }

  - **On failure (400 Bad Request):**

    - Title is not available

              {
                "code": 400,
                "status": "Bad Request",
                "errors": [
                  {
                    "path": "title",
                    "msg": "title already used"
                  }
                ]
              }

    - Title is not valid

            {
              "code": 400,
              "status": "Bad Request",
              "errors": [
                    {
                      "type": "field",
                      "value": "",
                      "msg": "Title must be between 10 and 100 characters",
                      "path": "title",
                      "location": "body"
                    },
                    {
                      "type": "field",
                      "value": "",
                      "msg": "Title must contain only letters, numbers, and spaces",
                      "path": "title",
                      "location": "body"
                    }

                ]

            }

  - **On failure (404 Not Found):**

        {
          "code": 404,
          "status": "Not Found",
          "message": "Thread not found"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while updating thread title",
          "log": "the error message"
        }

---

### Delete a Thread

**Endpoint:** `DELETE /threads/:idthread`

**Description:** Deletes a thread specified by `idthread` from the system.

**Request:**

- **URL Parameters:**
  - `idthread`: The unique identifier of the thread to be deleted.
- **Headers:** None
- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: The thread was deleted successfully.
  - `401 Unauthorized`: The user making the request is not an administrator.
  - `404 Not Found`: The specified thread was not found.
  - `500 Internal Server Error`: An error occurred while deleting the thread.

- **Response Body:**

  - **On success (200 OK):**

        {
          "code": 200,
          "status": "OK",
          "message": "Thread deleted successfully"
        }

  - **On failure (401 Unauthorized):**

        {
          "code": 401,
          "status": "Unauthorized",
          "message": "Operation requires to be an admin"
        }

  - **On failure (404 Not Found):**

        {
          "code": 404,
          "status": "Not Found",
          "message": "Thread not found"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while deleting thread",
          "log": "the error message"
        }

---

### Retrieve Posts of a Thread

**Endpoint:** `GET /threads/:idthread/posts`

**Description:** Retrieves all posts associated with a specific thread specified by `idthread`.

**Request:**

- **URL Parameters:**
  - `idthread`: The unique identifier of the thread whose posts are to be retrieved.
- **Headers:** None
- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: Posts retrieved successfully.
  - `404 Not Found`: No posts were found for the specified thread.
  - `500 Internal Server Error`: An error occurred while retrieving the posts.

- **Response Body:**

  - **On success (200 OK):**

        {
          "code": 200,
          "status": "OK",
          "message": "Posts of thread retrieved successfully",
          "posts": [ /* array of posts */ ]
        }

  - **On failure (404 Not Found):**

        {
          "code": 404,
          "status": "Not Found",
          "message": "No posts found",
          "posts": []
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error retrieving posts of thread",
          "log": "the error message"
        }

## Post Management

### Create a New Post in a Thread

**Endpoint:** `POST /threads/:idthread/posts`

**Description:** Creates a new post within a specific thread specified by `idthread`.

**Request:**

- **URL Parameters:**
  - `idthread`: The unique identifier of the thread in which the post will be created.
- **Headers:** None
- **Body:**

      {
        "content" (string): The content of the post,
         "title" (string): The title of the post
      }

**Response:**

- **Status Codes:**

  - `201 Created`: The post was created successfully.
  - `500 Internal Server Error`: An error occurred while creating the post.

- **Response Body:**

  - **On success (201 Created):**

        {
          "code": 201,
          "status": "Created",
          "message": "Post created successfully"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while creating post",
          "log": "the error message"
        }

---

### Retrieve a Post

**Endpoint:** `GET /posts/:idpost`

**Description:** Retrieves the details of a specific post specified by `idpost`.

**Request:**

- **URL Parameters:**

  - `idpost`: The unique identifier of the post to retrieve.

- **Headers:** None

- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: The post was retrieved successfully.
  - `404 Not Found`: The specified post was not found.
  - `500 Internal Server Error`: An error occurred while retrieving the post.

- **Response Body:**

  - **On success (200 OK):**

        {
          "code": 200,
          "status": "OK",
          "message": "Post retrieved successfully",
          "post": { /* post details */ }
        }

  - **On failure (404 Not Found):**

        {
          "code": 404,
          "status": "Not Found",
          "message": "Post not found"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while retrieving post",
          "log": "the error message"
        }

---

### Retrieve User Feed Posts

**Endpoint:** `GET /posts`

**Description:** Retrieves posts for the user's feed, including posts from subscriptions, followings, and the user's threads.

**Request:**

- **Headers:** None

- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: The posts were retrieved successfully.
  - `404 Not Found`: No posts found for the user's feed.
  - `500 Internal Server Error`: An error occurred while retrieving the posts.

- **Response Body:**

  - **On success (200 OK):**

        {
          "code": 200,
          "status": "OK",
          "message": "Posts retrieved successfully",
          "posts": [ /* array of posts */ ]
        }

  - **On failure (404 Not Found):**

        {
          "code": 404,
          "status": "Not Found",
          "message": "Posts not found",
          "posts": []
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while retrieving posts",
          "log": "the error message"
        }

---

### Update Post Content

**Endpoint:** `PUT /posts/content/:idpost`

**Description:** Updates the content of a specific post specified by `idpost`.

**Request:**

- **URL Parameters:**

  - `idpost`: The unique identifier of the post to update.

- **Headers:** None

- **Body:**

      {
        "content" (string): The content of the post
      }

**Response:**

- **Status Codes:**

  - `200 OK`: The post content was updated successfully.
  - `404 Not Found`: The specified post was not found.
  - `500 Internal Server Error`: An error occurred while updating the post.

- **Response Body:**

  - **On success (200 OK):**

        {
          "code": 200,
          "status": "OK",
          "message": "Post updated successfully"
        }

  - **On failure (404 Not Found):**

        {
          "code": 404,
          "status": "Not Found",
          "message": "Post not found"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while updating post",
          "log": "the error message"
        }

---

### Like a Post

**Endpoint:** `POST /posts/:idpost/like`

**Description:** Likes a specific post specified by `idpost`.

**Request:**

- **URL Parameters:**

  - `idpost`: The unique identifier of the post to like.

- **Headers:** None

- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: The post was liked successfully.
  - `400 Bad Request`: The post was already liked.
  - `500 Internal Server Error`: An error occurred while liking the post.

- **Response Body:**

  - **On success (200 OK):**

        {
          "code": 200,
          "status": "OK",
          "message": "Post liked successfully"
        }

  - **On failure (400 Bad Request):**

        {
          "code": 400,
          "status": "Bad Request",
          "error": "post already liked"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while liking the post",
          "log": "the error message"
        }

---

### Pin or Unpin a Post

**Endpoint:** `PUT /posts/:idpost/pinned/:pin`

**Description:** Pins or unpins a specific post specofied by `idpost`.

**Request:**

- **URL Parameters:**

  - `idpost`: The unique identifier of the post to pin or unpin.
  - `pin`: Set to `1` to pin the post, or `0` to unpin it.

- **Headers:** None

- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: The post was pinned or unpinned successfully.
  - `404 Not Found`: The specified post was not found.
  - `500 Internal Server Error`: An error occurred while pinning or unpinning the post.

- **Response Body:**

  - **On success (200 OK):**

        {
          "code": 200,
          "status": "OK",
          "message": "Post (un)pinned successfully"
        }

  - **On failure (404 Not Found):**

        {
          "code": 404,
          "status": "Not Found",
          "message": "Post not found"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while (un)pinning post",
          "log": "the error message"
        }

---

### Delete a Post

**Endpoint:** `DELETE /posts/:idpost`

**Description:** Deletes a specific post specified by `idpost`.

**Request:**

- **URL Parameters:**

  - `idpost`: The unique identifier of the post to delete.

- **Headers:** None

- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: The post was deleted successfully.
  - `401 Unauthorized`: The user making the request is not an administrator.
  - `404 Not Found`: The specified post was not found.
  - `500 Internal Server Error`: An error occurred while deleting the post.

- **Response Body:**

  - **On success (200 OK):**

        {
          "code": 200,
          "status": "OK",
          "message": "Post deleted successfully"
        }

  - **On failure (401 Unauthorized):**

        {
          "code": 401,
          "status": "Unauthorized",
          "message": "Operation requires to be an admin"
        }

  - **On failure (404 Not Found):**

        {
          "code": 404,
          "status": "Not Found",
          "message": "Post not found"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while deleting post",
          "log": "the error message"
        }

---

### Retrieve Comments of a Post

**Endpoint:** `GET /posts/:idpost/comments`

**Description:** Retrieves all comments associated with a specific post specified by `idpost`.

**Request:**

- **URL Parameters:**

  - `idpost`: The unique identifier of the post to retrieve comments for.

- **Headers:** None

- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: The comments were retrieved successfully.
  - `404 Not Found`: No comments found for the specified post.
  - `500 Internal Server Error`: An error occurred while retrieving the comments.

- **Response Body:**

  - **On success (200 OK):**

        {
          "code": 200,
          "status": "OK",
          "message": "Comments of post retrieved successfully",
          "comments": [ /* array of comments */ ]
        }

  - **On failure (404 Not Found):**

        {
          "code": 404,
          "status": "Not Found",
          "message": "No comments found",
          "comments": []
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while retrieving comments of post",
          "log": "the error message"
        }

---

### Create a Comment on a Post

**Endpoint:** `POST /posts/:idpost/comments`

**Description:** Creates a new comment on a specific post specified by `idpost`.

**Request:**

- **URL Parameters:**

  - `idpost`: The unique identifier of the post to comment on.

- **Headers:** None

- **Body:**

      {
        "content" (string): The content of the comment
      }

**Response:**

- **Status Codes:**

  - `201 Created`: The comment was created successfully.
  - `500 Internal Server Error`: An error occurred while creating the comment.

- **Response Body:**

  - **On success (201 Created):**

        {
          "code": 201,
          "status": "Created",
          "message": "Comment created successfully"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while creating comment",
          "log": "the error message"
        }

## Comment Management

### Like a Comment

**Endpoint:** `POST /comments/:idcom/like`

**Description:** Likes a specific comment specified by `idcom`.

**Request:**

- **URL Parameters:**

  - `idcom`: The unique identifier of the comment to be liked.

- **Headers:** None
- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: The comment was liked successfully.
  - `400 Bad Request`: The comment was already liked.
  - `500 Internal Server Error`: An error occurred while liking the comment.

- **Response Body:**

  - **On success (200 OK):**

        {
            "code": 200,
            "status": "OK",
            "message": "Comment liked successfully"
        }

  - **On failure (400 Bad Request):**

        {
          "code": 400,
          "status": "Bad Request",
          "error": "Comment already liked"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while liking the comment",
          "log": "the error message"
        }

---

### Delete a Comment

**Endpoint:** `DELETE /comments/:idcomment`

**Description:** Deletes a specific comment specified by `idcom`.

**Request:**

- **URL Parameters:**

  - `idcomment`: The unique identifier of the comment to be deleted.

- **Headers:** None
- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: The comment was deleted successfully.
  - `401 Unauthorized`: The user making the request is not an administrator.
  - `404 Not Found`: The specified comment was not found.
  - `500 Internal Server Error`: An error occurred while deleting the comment.

- **Response Body:**

  - **On success (200 OK):**

        {
            "code": 200,
            "status": "OK",
            "message": "Comment deleted successfully"
        }

  - **On failure (401 Unauthorized):**

        {
          "code": 401,
          "status": "Unauthorized",
          "message": "Operation requires to be an admin"
        }

  - **On failure (404 Not Found):**

        {
          "code": 404,
          "status": "Not Found",
          "message": "Comment not found"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while deleting comment",
          "log": "the error message"
        }

## Follow Mangement

### Follow a User

**Endpoint:** `POST /follow/:iduser`

**Description:** Follows a specific identified by `iduser`.

**Request:**

- **URL Parameters:**

  - `iduser`: The unique identifier of the user to be followed.

- **Headers:** None
- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: The user was followed successfully.
  - `500 Internal Server Error`: An error occurred while following the user.

- **Response Body:**

  - **On success (200 OK):**

        {
            "code": 200,
            "status": "OK",
            "message": "Followed successfully"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while following user",
          "log": "the error message"
        }

---

### Unfollow a User

**Endpoint:** `DELETE /follow/:iduser`

**Description:** Unfollows a specific user identified by `iduser`.

**Request:**

- **URL Parameters:**

  - `iduser`: The unique identifier of the user to be unfollowed.

- **Headers:** None
- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: The user was unfollowed successfully.
  - `500 Internal Server Error`: An error occurred while unfollowing the user.

- **Response Body:**

  - **On success (200 OK):**

        {
            "code": 200,
            "status": "OK",
            "message": "Unfollowed successfully"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while unfollowing user",
          "log": "the error message"
        }

## Subscribtion Management

### Subscribe to a Thread

**Endpoint:** `POST /subscriptions/:idthread`

**Description:** Subscribes a user to a specific thread specified by `idthread`.

**Request:**

- **URL Parameters:**

  - `idthread`: The unique identifier of the thread to subscribe to.

- **Headers:** None

- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `201 Created`: The user was successfully subscribed to the thread.
  - `500 Internal Server Error`: An error occurred while subscribing to the thread.

- **Response Body:**

  - **On success (201 Created):**

        {
          "code": 201,
          "status": "Created",
          "message": "Subscribed successfully"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while subscribing to thread",
          "log": "the error message"
        }

---

### Unsubscribe from a Thread

**Endpoint:** `DELETE /subscriptions/:idthread`

**Description:** Unsubscribes a user from a specific thread specified by `idthread`.

**Request:**

- **URL Parameters:**

  - `idthread`: The unique identifier of the thread to unsubscribe from.

- **Headers:** None

- **Body:** No request body is needed.

**Response:**

- **Status Codes:**

  - `200 OK`: The user was successfully unsubscribed from the thread.
  - `500 Internal Server Error`: An error occurred while unsubscribing from the thread.

- **Response Body:**

  - **On success (200 OK):**

        {
            "code": 200,
            "status": "OK",
            "message": "Unsubscribed successfully"
        }

  - **On error (500 Internal Server Error):**

        {
          "code": 500,
          "status": "Internal Server Error",
          "message": "Error while unsubscribing to thread",
          "log": "the error message"
        }
