require('dotenv').config();
const express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    cors = require('cors'),
    {check, validationResult} = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User
const app = express();

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const allowedOrigins = ['http://localhost:8080', 'https://movie-hive-ee3949a892be.herokuapp.com', 'http://localhost:1234', 'https://movie-hive-client.netlify.app'];
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                let message =
                    "The CORS policy for this application doesn't allow access from origin " +
                    origin;
                return callback(new Error(message), false);
            }
            return callback(null, true);
        },
    })
);

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


// Routes
app.get('/', (req, res) => {
    res.send('Welcome to my Movie app!');
})

app.get('/documentation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// ###########################################################################
// ################################## MOVIES #################################
// ###########################################################################~
// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const movies = await Movies.find();
        res.json(movies);
    } catch (err) {
        next(err);
    }
});


// Get Movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
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
app.get('/genres/:genre', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
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
app.post('/movies', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
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
app.delete('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const title = req.params.title
        const movieDelete = await Movies.findOneAndDelete({Title: title});
        if (!movieDelete) {
            return next(createError(`The movie '${title}' does not exist. Please check the title and try again.`, 404));
        }
        res.status(200).send(`Movie '${title}' has been deleted successfully.`)
    } catch (err) {
        next(err);
    }
});

// Get a genre by name
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
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
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
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
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const users = await Users.find().select('Name Username Birthday FavoriteMovies -_id');
        res.json(users);
    } catch (err) {
        next(err);
    }
});
// Get user by username
app.get('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const username = req.params.username;
        const userSelect = await Users.findOne({ Username: username }).select('Name Username Email Birthday FavoriteMovies');
        
        if (!userSelect) {
            return next(createError(`The user with username '${req.params.username}' does not exist. Please check the username and try again.`, 404));
        }
        res.json(userSelect); 
    } catch (err) {
            next(err);
        }
});
// Update user info by username
app.put('/users/:username', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try {
        if (req.user.Username !== req.params.username) {
            return next(createError('Premission denied', 400));
        }
        const userUpdate = await Users.findOneAndUpdate({Username: req.params.username}, {
            $set: {
                Name: req.body.Name,
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
app.post('/users',
    [
        // Validation rules
        check('Username', 'Username is required and should be at least 5 characters long.').isLength({min: 5}),
        check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Name', 'Name is required.').not().isEmpty(),
        check('Password', 'Password is required.').not().isEmpty(),
        check('Email', 'Email does not appear to be valid.').isEmail(),
        check('Birthday', 'Birthday format should be YYYY-MM-DD').isDate({format: 'YYYY-MM-DD'})
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.array()});
            }

            if (!req.body.Name || !req.body.Username || !req.body.Password || !req.body.Email) {
                return next(createError('Invalid request data. Please make sure all fields are provided and correctly formatted.', 400));
            }

            let hashedPassword = await Users.hashPassword(req.body.Password);

            const existingUser = await Users.findOne({ Username: req.body.Username });
            if (existingUser) {
                return next(createError(`The username '${req.body.Username}' is already taken. Please choose a different username.`, 409));
            }
            const newUser = await Users.create({
                Name: req.body.Name,
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            });
            res.status(201).json(newUser);
        } catch (err) {
            next(err);
        }
    }
);

// Add a movie to a user's list of favorites
app.post('/users/:username/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const movie = await Movies.findOne({Title: req.params.title});
        if (!movie) {
            return next(createError(`The movie '${req.params.title}' does not exist. Please check the title and try again.`, 404));
        }
        const user = await Users.findOneAndUpdate({Username: req.params.username}, {
            $push: {FavoriteMovies: movie.Title}
        }, {new: true});
        res.json(user);
    } catch (err) {
        next(err);
    }
});
// Remove a movie from a user's list of favorites
app.delete('/users/:username/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const movie = await Movies.findOne({Title: req.params.title});
        if (!movie) {
            return next(createError(`The movie '${req.params.title}' does not exist. Please check the title and try again.`, 404));
        }
        const user = await Users.findOneAndUpdate({Username: req.params.username}, {
            $pull: {FavoriteMovies: movie.Title}
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
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const userDelete = await Users.findOneAndDelete({Username: req.params.username});
        if (!userDelete) {
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
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port ${PORT}.`);
});