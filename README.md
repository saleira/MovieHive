
# MovieHive Overview

MovieHive is a backend API service designed to allow users to manage their movie preferences. The application provides functionality for user authentication, registration, and movie management via a set of RESTful API endpoints. It is built with **Node.js**, using **Express.js** for routing, and connects to a **MongoDB** database for persistent storage of user and movie data.

## Key Features:
- **User Authentication**: The API uses **JWT (JSON Web Token)** for secure user authentication. After successful login, users receive a token that is required for accessing protected routes.
- **User Management**: Users can register, log in, and manage their movie preferences (add/remove favorite movies).
- **Movie Management**: The API allows users to retrieve a list of movies, along with detailed information about each movie (e.g., title, description, genre, director).
- **Secure Data Handling**: User passwords are securely hashed using **bcrypt** before being stored in the database.

## Architecture and Components:
- **Backend Framework**: The application is built using **Node.js** and **Express.js**, providing a fast and scalable backend API for movie-related data and user management.
- **Authentication**: **Passport.js** is used to implement **local strategy** authentication (username and password) and **JWT-based** authorization for protecting sensitive routes.
- **Database**: The API interacts with a **MongoDB** database using **Mongoose** to store and retrieve user and movie data.
- **Environment Configuration**: Sensitive information, such as the JWT secret key, is managed using the **dotenv** library to securely store configuration values.

## Main Features:
- **Registration**: New users can sign up by providing their username, email, and password. Passwords are securely hashed using **bcrypt** before being stored.
- **Login**: Existing users can log in by providing their username and password. Upon successful login, a **JWT token** is returned for further authentication.
- **Movie Data**: Users can view a list of movies, including their title, description, genre, and director, through API endpoints. Each movie can be added to or removed from a user's list of favorite movies.
- **JWT Authentication**: After logging in, users receive a JWT token, which must be included in the **Authorization** header of subsequent requests to access protected routes (such as retrieving or modifying user favorites).

## Technologies Used:
- **Node.js**: A JavaScript runtime used to build the backend of the application.
- **Express.js**: A web framework for building the API, providing routing and middleware for handling requests.
- **MongoDB**: A NoSQL database used to store data related to users and movies.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB, providing a more convenient way to interact with the database.
- **Passport.js**: Middleware used for implementing authentication, including local strategy (username and password) and JWT-based authorization.
- **JWT (JSON Web Token)**: A compact and self-contained way to securely transmit information between parties (in this case, for user authentication).
- **bcrypt**: A library for securely hashing and validating passwords.

## Security Considerations:
- **Password Security**: User passwords are never stored in plain text; instead, they are hashed using **bcrypt** to ensure they are secure.
- **JWT Authorization**: The application uses **JWT** to authorize users. Once logged in, users receive a token that must be sent with each request to access protected routes.
- **Cross-Origin Resource Sharing (CORS)**: The application uses the **CORS** middleware to handle cross-origin requests, enabling the backend to serve data to different frontend applications.

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
