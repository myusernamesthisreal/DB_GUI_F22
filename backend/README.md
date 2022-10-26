# DB GUI F22 Backend

## Routes

### Users

#### GET /users/check

Checks if the user is logged in.

Response body:

```json
{
  "message": "Token is valid",
  "success": true,
  "username": "username",
  "id": 1
}
```

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

#### POST /logout

Logs out a user.

Response body:

```json
{
  "message": "Logout successful",
  "success": true
}
```

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

### Posts

### Comments

### Likes

