const bodyParser = require('body-parser'),
    express = require('express'),
    uuid = require('uuid'),
    path = require('path'),
    mongoose = require('mongoose'),
    Models = require('./models.js');
const e = require('express');

const Movies = Models.Movie;
const Users = Models.User
const app = express();

mongoose.connect('mongodb://localhost:27017/MovieHive', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



// Routes
app.get('/documentation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// ###########################################################################
// ################################## MOVIES #################################
// ###########################################################################~
// Get all movies
app.get('/movies', async (req, res, next) => {
    try {
        const movies = await Movies.find();
        res.json(movies);
    } catch (err) {
        next(err);
    }
});


// Get Movie by title
app.get('/movies/:title', async (req, res, next) => {
    try {
        const title = req.params.title;
        const movieSelect = await Movies.findOne({Title: title});

        if (!movieSelect) {
            return next(createError(`The movie '${title}' does not exist. Please check the title and try again.`, 404));
        }
        res.json(movieSelect)
    } catch (err) {
        next(err);
    }
});

// Get movies by genres
app.get('/genres/:genre', async (req, res, next) => {
    try {
        const genre = req.params.genre;
        const filteredMovies = await Movies.find({'Genre.Name': genre});
    
        if (filteredMovies.length === 0) {
            return next(createError(`The genre '${genre}' does not exist. Please check the name and try again.`, 404));
        }
        res.json(filteredMovies);
    } catch (err) { 
        next(err);
    }
});

// Add a movie to the list
app.post('/movies', async (req, res, next) => {
    try {
        const existingMovie = await Movies.findOne({ Title: req.body.Title });

        if (existingMovie) {
            return next(createError(`The movie '${req.body.Title}' already exists. Please check the title and try again.`, 409));
        }
        const newMovie = await Movies.create({
            Title: req.body.Title,
            Description: req.body.Description,
            Genre: {
                Name: req.body.Genre.Name,
                Description: req.body.Genre.Description
            },
            Director: {
                Name: req.body.Director.Name,
                Bio: req.body.Director.Bio
            },
            ImagePath: req.body.ImagePath,
            Feature: req.body.Feature
        });
        res.status(201).json(newMovie);
    } catch (err) {
        next(err);
    }
});

// Delete a movie by title
app.delete('/movies/:title', async (req, res, next) => {
    try {
        const title = req.params.title
        const MovieDelete = await Movies.findOneAndDelete({Title: title});
        if (!MovieDelete) {
            return next(createError(`The movie '${title}' does not exist. Please check the title and try again.`, 404));
        }
        res.status(200).send(`Movie '${title}' has been deleted successfully.`)
    } catch (err) {
        next(err);
    }
});

// Get a genre by name
app.get('/movies/genres/:genreName', async (req, res, next) => {
    try {
        const genreName = req.params.genreName;
        const genre = await Movies.findOne({'Genre.Name': genreName});
        if (!genre) {
            return next(createError(`The genre '${genreName}' does not exist. Please check the name and try again.`, 404));
        }
        res.json(genre.Genre);
    } catch (err) {
        next(err);
    }
});

// Get a director by name
app.get('/movies/directors/:directorName', async (req, res, next) => {
    try {
        const directorName = req.params.directorName;
        const director = await Movies.findOne({'Director.Name': directorName});
        if (!director) {
            return next(createError(`The director '${directorName}' does not exist. Please check the name and try again.`, 404));
        }
        res.json(director.Director);
    } catch (err) {
        next(err);
    }
});

// ###########################################################################
// ################################## USERS ##################################
// ###########################################################################
// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
});
// Get user by username
app.get('/users/:username', async (req, res, next) => {
    try {
        const username = req.params.username;
        const userSelect = await Users.findOne({Username: username});
        
        if (!userSelect) {
            return next(createError(`The user with username '${req.params.username}' does not exist. Please check the username and try again.`, 404));
        }
        res.json(userSelect); 
    } catch (err) {
            next(err);
        }
});
// Update user info by username
app.put('/users/:username', async (req, res, next) => {
    try {
        const userUpdate = await Users.findOneAndUpdate({Username: req.params.username}, {
            $set: {
                Name: req.body.Name,
                Username: req.body.Username,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        }, {new: true});
        if (!userUpdate) {
            return next(createError(`The user with username '${req.params.username}' does not exist. Please check the username and try again.`, 404));
        }
        res.json(`User '${req.params.username}' has been updated successfully.`);
    } catch (err) {
        next(err);
    }    
});
//Add a user
app.post('/users', async (req, res, next) => {
    try {
        if (!req.body.Name || !req.body.Username || !req.body.Email) {
            return next(createError('Invalid request data. Please make sure all fields are provided and correctly formatted.', 400));
        }
        const existingUser = await Users.findOne({ Username: req.body.Username });
        if (existingUser) {
            return next(createError(`The username '${req.body.Username}' is already taken. Please choose a different username.`, 409));
        }
        const newUser = await Users.create({
            Name: req.body.Name,
            Username: req.body.Username,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        });
        res.status(201).json(newUser);

    } catch (err) {
        next(err);
    }
});
// Add a movie to a user's list of favorites
app.post('/users/:username/movies/:title', async (req, res, next) => {
    try {
        const movie = await Movies.findOne({Title: req.params.title});
        if (!movie) {
            return next(createError(`The movie '${req.params.title}' does not exist. Please check the title and try again.`, 404));
        }
        const user = await Users.findOneAndUpdate({Username: req.params.username}, {
            $push: {FavoriteMovies: movie.id}
        }, {new: true});
        res.json(user);
    } catch (err) {
        next(err);
    }
});
// Remove a movie from a user's list of favorites
app.delete('/users/:username/movies/:title', async (req, res, next) => {
    try {
        const movie = await Movies.findOne({Title: req.params.title});
        if (!movie) {
            return next(createError(`The movie '${req.params.title}' does not exist. Please check the title and try again.`, 404));
        }
        const user = await Users.findOneAndUpdate({Username: req.params.username}, {
            $pull: {FavoriteMovies: movie.id}
        }, {new: true});
        if (!user) {
            return next(createError(`The user with username '${req.params.username}' does not exist. Please check the username and try again.`, 404));
        }
        res.status(200).send(`The movie '${req.params.title}' has been removed from the list of favorite movies for user '${req.params.username}'.`);
    } catch (err) {
        next(err);
    }
});

// Delete a user by username
app.delete('/users/:username', async (req, res, next) => {
    try {
        const UserDelete = await Users.findOneAndDelete({Username: req.params.username});
        if (!UserDelete) {
            return next(createError(`The user with username '${req.params.username}' does not exist. Please check the username and try again.`, 404));
        }
        res.status(200).send(`User '${req.params.username}' has been deleted successfully.`);
    } catch (err) {
        next(err);
    }
});
// ###########################################################################
// ################################## ERROR HANDLING #########################
// ###########################################################################
// Create a new error
function createError(message, statusCode = 500) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};
app.use((req, res, next) => {
    const error = new Error("404: The requested resource was not found.");
    error.statusCode = 404;
    next(error);
});
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error.';
    res.status(statusCode).send(message);
});
// ###########################################################################
// ########################### LISTEN FOR REQUESTS ###########################
// ###########################################################################
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Your app is listening on port ${PORT}.`);
});