# Zeitbook

The backend application for Zeitspace's workshop on Progressive Web Apps.

## Setup

1. In your command line, navigate to the directory containing the source code for this starter application.
1. Run `npm install`, then `npm start`.
1. The server will start responding on [localhost:3000](localhost:3000).

## Api

**Return an object with list of posts**
----
  Returns json data contains a list of posts.

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
  Add a new post on the database and return the post object

* **URL**

  /posts/

* **Method:**

  `POST`

*  **URL Params**

  None

* **Data Params**

  `title=[string]`
  `content=[string]`
  `user=[string]`

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
  Returns json data contains a post and all of its comments.

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
