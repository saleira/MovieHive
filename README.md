
# MovieHive Overview

MovieHive is a web application that allows users to register, log in, and manage their favorite movies. It uses JWT authentication for securing routes and has functionality for handling user-related actions (such as login, registration, and managing favorite movies). The application has a MongoDB-backed database for storing data about movies and users.

## API Endpoints

### Authentication

#### POST /login
**Description**: Authenticates a user and generates a JWT token.

**Request**:
- **Body**:
    - `Username`: (String) The username of the user.
    - `Password`: (String) The password of the user.

**Response**:
- **200 OK**: Returns a JWT token and the user information.
  ```json
  {
    "user": {
      "Name": "John Doe",
      "Username": "johndoe",
      "Email": "johndoe@example.com",
      "Birthday": "1990-01-01T00:00:00.000Z"
    },
    "token": "JWT_TOKEN"
  }
  ```
- **400 Bad Request**: If authentication fails.
  ```json
  {
    "message": "Something is not right",
    "user": null
  }
  ```

---

### Movies

#### GET /movies
**Description**: Retrieves all movies in the database.

**Request**:
- **Query Parameters**:
  - `limit`: (Integer) Optional. The number of movies to return.
  - `page`: (Integer) Optional. The page number for pagination.

**Response**:
- **200 OK**: Returns an array of movie objects.
  ```json
  [
    {
      "_id": "movie_id",
      "Title": "Movie Title",
      "Description": "Movie Description",
      "Genre": {
        "Name": "Action",
        "Description": "Action movies"
      },
      "Director": {
        "Name": "Director Name",
        "Bio": "Director biography"
      },
      "Actors": ["Actor1", "Actor2"],
      "ImagePath": "image_url",
      "Feature": true
    }
  ]
  ```

#### GET /movies/:id
**Description**: Retrieves a specific movie by its ID.

**Request**:
- **URL Parameters**:
  - `id`: (String) The ID of the movie to retrieve.

**Response**:
- **200 OK**: Returns a movie object.
  ```json
  {
    "_id": "movie_id",
    "Title": "Movie Title",
    "Description": "Movie Description",
    "Genre": {
      "Name": "Action",
      "Description": "Action movies"
    },
    "Director": {
      "Name": "Director Name",
      "Bio": "Director biography"
    },
    "Actors": ["Actor1", "Actor2"],
    "ImagePath": "image_url",
    "Feature": true
  }
  ```
- **404 Not Found**: If the movie is not found.
  ```json
  {
    "message": "Movie not found"
  }
  ```

#### POST /movies
**Description**: Adds a new movie to the database.

**Request**:
- **Body**:
  - `Title`: (String) The title of the movie.
  - `Description`: (String) A description of the movie.
  - `Genre`: (Object) The genre of the movie.
    - `Name`: (String) The genre name.
    - `Description`: (String) The genre description.
  - `Director`: (Object) The director's details.
    - `Name`: (String) The director's name.
    - `Bio`: (String) The director's biography.
  - `Actors`: (Array) A list of actors in the movie.
  - `ImagePath`: (String) The URL of the movie's image.
  - `Feature`: (Boolean) Whether the movie is featured.

**Response**:
- **201 Created**: If the movie is successfully created.
  ```json
  {
    "message": "Movie created successfully",
    "movie": {
      "_id": "movie_id",
      "Title": "Movie Title",
      "Description": "Movie Description",
      "Genre": { ... },
      "Director": { ... },
      "Actors": ["Actor1", "Actor2"],
      "ImagePath": "image_url",
      "Feature": true
    }
  }
  ```
- **400 Bad Request**: If the movie data is invalid.
  ```json
  {
    "message": "Invalid data"
  }
  ```

#### PUT /movies/:id
**Description**: Updates an existing movie's details.

**Request**:
- **URL Parameters**:
  - `id`: (String) The ID of the movie to update.
- **Body**:
  - Any of the fields defined in the POST request for movies.

**Response**:
- **200 OK**: If the movie is updated successfully.
  ```json
  {
    "message": "Movie updated successfully",
    "movie": { ... }
  }
  ```
- **404 Not Found**: If the movie does not exist.
  ```json
  {
    "message": "Movie not found"
  }
  ```

#### DELETE /movies/:id
**Description**: Deletes a movie by its ID.

**Request**:
- **URL Parameters**:
  - `id`: (String) The ID of the movie to delete.

**Response**:
- **200 OK**: If the movie is successfully deleted.
  ```json
  {
    "message": "Movie deleted successfully"
  }
  ```
- **404 Not Found**: If the movie does not exist.
  ```json
  {
    "message": "Movie not found"
  }
  ```

---

### Users

#### POST /users
**Description**: Registers a new user.

**Request**:
- **Body**:
  - `Name`: (String) The name of the user.
  - `Username`: (String) The username of the user.
  - `Password`: (String) The password of the user.
  - `Email`: (String) The email of the user.
  - `Birthday`: (Date) The birthday of the user (optional).
  - `FavoriteMovies`: (Array) A list of movie IDs the user likes (optional).

**Response**:
- **201 Created**: If the user is created successfully.
  ```json
  {
    "message": "User created successfully",
    "user": {
      "Name": "John Doe",
      "Username": "johndoe",
      "Email": "johndoe@example.com",
      "Birthday": "1990-01-01T00:00:00.000Z"
    }
  }
  ```

#### GET /users/:id
**Description**: Retrieves a user's information by their ID.

**Request**:
- **URL Parameters**:
  - `id`: (String) The ID of the user.

**Response**:
- **200 OK**: If the user is found.
  ```json
  {
    "Name": "John Doe",
    "Username": "johndoe",
    "Email": "johndoe@example.com",
    "Birthday": "1990-01-01T00:00:00.000Z",
    "FavoriteMovies": [{...}, {...}]
  }
  ```

---

### Error Handling

For all endpoints, the following error responses are possible:
- **400 Bad Request**: Invalid input or missing required fields.
- **404 Not Found**: The resource could not be found.
- **500 Internal Server Error**: General server error.

---

## Dependencies

- `bcrypt`: Password hashing
- `body-parser`: Parsing incoming request bodies
- `cors`: Cross-Origin Resource Sharing
- `dotenv`: Managing environment variables
- `express`: Web application framework
- `express-validator`: Input validation middleware
- `jsonwebtoken`: Generating and verifying JWTs
- `mongoose`: MongoDB object modeling
- `passport`: Authentication middleware
- `passport-jwt`: JWT strategy for Passport
- `passport-local`: Local strategy for Passport
