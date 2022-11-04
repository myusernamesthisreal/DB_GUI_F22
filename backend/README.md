# DB GUI F22 Backend

## Routes

### Users

#### GET /users/check

Checks if the user is logged in. Returns the user object if logged in, otherwise returns an error.

Response body:

```json
{
  "message": "Token is valid",
  "success": true,
  "username": "username",
  "id": 1
}
```

Error codes:

- 401: Unauthorized (no token)

---

#### GET /users/admin

Checks if the user is an admin.

Response body:

```json
{
  "admin": false,
  "message": "User is not admin",
  "success": true,
  "username": "username",
  "id": 1
}
```

Error codes:

- 401: Unauthorized (no token)

---

#### POST /users

Creates a new user.

Request body:

```json
{
  "username": "username",
  "password": "password"
}
```

Response body:

```json
{
  "message": "User created successfully",
  "success": true,
  "username": "username",
  "id": 1
}
```

Error codes:

- 400: Bad request (missing fields)
- 409: Conflict (username already exists)

---

#### POST /login

Logs in a user.

Request body:

```json
{
  "username": "username",
  "password": "password"
}
```

Response body:

```json
{
  "message": "Login successful",
  "success": true,
  "username": "username",
  "id": 1
}
```

Error codes:

- 400: Bad request (missing fields, invalid username or password)

---

#### POST /logout

Logs out a user.

Response body:

```json
{
  "message": "Logout successful",
  "success": true
}
```

---

#### PUT /displayname

Changes the display name of a user.

Request body:

```json
{
  "displayName": "displayname"
}
```

Response body:

```json
{
  "message": "Display name changed successfully",
  "success": true,
  "username": "username",
  "id": 1
}
```

Error codes:

- 400: Bad request (missing fields)
- 401: Unauthorized (no token or wrong user)

---

### Posts

#### GET /posts

Gets all posts.

Response body:

```json
{
  "message": "Posts fetched",
  "posts": [
    {
        "id": 43,
        "author": 46,
        "timestamp": "2022-10-25T04:08:35.000Z",
        "body": "body",
        "is_pinned": 0,
        "edited": 0,
        "authorname": "author",
        "authordisplayname": "author",
        "likes": 0,
        "liked": false,
        "categories": [
            "test",
            "test2"
        ]
    }
  ],
  "success": true
}
```

---

#### GET /posts/:id

Gets a post by id.

Response body:

```json
{
  "message": "Post fetched",
  "post": {
      "id": 43,
      "author": 46,
      "timestamp": "2022-10-25T04:08:35.000Z",
      "body": "body",
      "is_pinned": 0,
      "edited": 0,
      "authorname": "author",
      "authordisplayname": "author",
      "likes": 0,
      "liked": false,
      "categories": [
          "test",
          "test2"
      ]
  },
  "success": true
}
```

---

#### GET /users/:id/posts

Gets all posts by a user.

Response body:

```json
{
  "message": "Posts fetched",
  "posts": [
    {
        "id": 43,
        "author": 46,
        "timestamp": "2022-10-25T04:08:35.000Z",
        "body": "body",
        "is_pinned": 0,
        "edited": 0,
        "authorname": "author",
        "authordisplayname": "author",
        "likes": 0,
        "liked": false,
        "categories": [
            "test",
            "test2"
        ]
    }
  ],
  "success": true
}
```

---

#### POST /posts

Creates a new post. Body is required. Categories are optional.

Request body:

```json
{
  "body": "body",
  "categories": [
    "test",
    "test2"
  ]
}
```

Response body:

```json
{
  "message": "Post created successfully",
  "post": {
      "id": 43,
      "author": 46,
      "timestamp": "2022-10-25T04:08:35.000Z",
      "body": "body",
      "is_pinned": 0,
      "edited": 0,
      "authorname": "author",
      "authordisplayname": "author",
      "likes": 0,
      "liked": false,
      "categories": [
          "test",
          "test2"
      ]
  },
  "success": true
}
```

Error codes:

- 400: Bad request (missing fields)
- 401: Unauthorized (no token)

---

#### PATCH /posts/:id

Edits a post. Either body or categories can be edited. If no fields are provided, the post is not edited.

Request body:

```json
{
  "body": "body",
  "categories": [
    "test",
    "test2"
  ]
}
```

Response body:

```json
{
  "message": "Post edited successfully",
  "post": {
      "id": 43,
      "author": 46,
      "timestamp": "2022-10-25T04:08:35.000Z",
      "body": "body",
      "is_pinned": 0,
      "edited": 0,
      "authorname": "author",
      "authordisplayname": "author",
      "likes": 0,
      "liked": false,
      "categories": [
          "test",
          "test2"
      ]
  },
  "success": true
}
```

Error codes:

- 400: Bad request (missing fields)
- 401: Unauthorized (no token or wrong user)
- 404: Not found (post not found)

---

#### DELETE /posts/:id

Deletes a post.

Responds with 204 No Content and empty body.

Error codes:

- 401: Unauthorized (no token or wrong user)
- 404: Not found (post not found)

---

### Comments

### Likes
