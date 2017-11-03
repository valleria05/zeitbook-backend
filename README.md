# Zeitbook

The backend application for Zeitspace's workshop on Progressive Web Apps.

## Setup

1. In your command line, navigate to the directory containing the source code for this starter application.
1. Run `npm install`, then `npm start`.
1. The server will start responding on [localhost:3000](localhost:3000).

## Api

**Return an object with list of posts**
----
  Returns a json object contains a list of posts.

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
        "id":"HVzHbCpgnSKysIsQLDAr"
      }]
    ```

**Add a new posts**
----
  Add a new post on the database and return a post object

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

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```
      {
        "time": "2017-11-02T18:45:12.836Z",
        "content":"Content",
        "title": "Title",
        "user":"John",
        "id":"HVzHbCpgnSKysIsQLDAr"
      }
    ```

**Return a post object with comments**
----
  Returns a json object contains a post and all of its comments.

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
        "id":"HVzHbCpgnSKysIsQLDAr"
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

**Add new comment**
----
  Add a new comment to a post and returns a json object contains the comment.

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

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```
      {
        "user": "John",
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
