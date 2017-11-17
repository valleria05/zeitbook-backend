# Zeitbook

The backend application for Zeitspace's workshop on Progressive Web Apps.

[https://zeitbook.herokuapp.com/](https://zeitbook.herokuapp.com/)

## Setup Firebase Cloud Firestore
A database system is required to store posts and comments. This server is configured to connect to [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore/). [Here are the steps to setup Firestore](./firebase-steps/setup-firestore.md).

## Setup

1. Set up Firebase Cloud Firestore (see above).
1. In your command line, navigate to the directory containing the source code for this starter application.
1. Run `npm install`, then `npm run dev:server`.
1. The server will start responding on [localhost:3001](localhost:3001).
1. Optional: Follow [these steps](https://github.com/zeitspace/zeitbook-frontend#zeitbook) to set up a front-end instance of Zeitbook.

## Api

**Return an object with list of posts**
----
  Returns a JSON object containing all posts.

* **URL**

  /posts/

* **Method:**

  `GET`

*  **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```
      [{
        "time": "2017-11-02T18:45:12.836Z",
        "content":"Content",
        "title": "Title",
        "user":"John",
        "numComments": 2,
        "id":"HVzHbCpgnSKysIsQLDAr"
      }]
    ```

**Add a new post**
----
  Add a new post to the database and return a JSON object containing the post

* **URL**

  /posts/

* **Method:**

  `POST`

*  **URL Params**

  None

* **Data Params**

  `title: [string]`
  `content: [string]`
  `user: [string]`
  `token: [string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```
      {
        "content":"Content",
        "title": "Title",
        "user": "John",
        "token": "123123",
        "numComments": 0,
        "time": "2017-11-02T18:45:12.836Z",
        "id":"HVzHbCpgnSKysIsQLDAr"
      }
    ```

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Object requires title, content and user" }`

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "Bad request: No post was found with ID [postId]" }`

**Return a post object with comments**
----
  Returns a JSON object containing a post and its comments.

* **URL**

  /posts/:postId

* **Method:**

  `GET`

*  **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```
      {
        "time": "2017-11-02T18:45:12.836Z",
        "content":"Content",
        "title": "Title",
        "user":"John",
        "id":"HVzHbCpgnSKysIsQLDAr",
        "numComments": 2,
        "comments": [
          {
            "user": "John",
            "time": "2017-11-02T19:44:32.836Z",
            "comment": "Post comment",
            "id": "HDzHbCpgnSKysIsQLDBr"
          }
        ]
      }
    ```

* **Error Response:**

  * **Code:** 400 NOT FOUND <br />
    **Content:** `{ error : "Bad request: No post was found with ID [postId]" }`

**Add a new comment**
----
  Adds a new comment to a post, increments numComments by 1 and returns a JSON object that contains the comment.

* **URL**

  /posts/:postId/comments

* **Method:**

  `POST`

*  **URL Params**

  None

* **Data Params**

  `id: [string]`
  `comment: [string]`
  `user: [string]`
  `token: [string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```
      {
        "user": "John",
        "token": "12345",
        "time": "2017-11-02T19:44:32.836Z",
        "comment": "Post comment",
        "id": "HDzHbCpgnSKysIsQLDBr"
      }
    ```

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Object requires comment and user" }`

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "Bad request: No post was found with ID [postId]" }`
