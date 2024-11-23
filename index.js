const bodyParser = require('body-parser'),
    express = require('express'),
    uuid = require('uuid'),
    path = require('path');

const app = express();

let movies = [
    {
        id: "1",
        title: "Scott Pilgrim vs. the World",
        description: "Scott Pilgrim must defeat his new girlfriend's seven evil exes to win her heart.",
        genre: ["Action", "Comedy", "Romance"],
        imageURL: "https://image.tmdb.org/t/p/original/gseLBM6CzrwubkvGAqOsVd7FtKn.jpg",
        actors: ["Michael Cera", "Mary Elizabeth Winstead", "Kieran Culkin"],
        director: "Edgar Wright"
    },
    {
        id: "2",
        title: "Whiplash",
        description: "A young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
        genre: ["Drama", "Music"],
        imageURL: "https://i.pinimg.com/736x/23/29/b2/2329b2825deb93f8a4b1e796687315d4.jpg",
        actors: ["Miles Teller", "J.K. Simmons", "Melissa Benoist"],
        director: "Damien Chazelle"
    },
    {
        id: "3",
        title: "A Bug's Life",
        description: "A misfit ant, looking for warriors to save his colony from greedy grasshoppers, recruits a group of bugs that turn out to be an inept circus troupe.",
        genre: ["Animation", "Adventure", "Comedy"],
        imageURL: "https://cdn.posteritati.com/posters/000/000/041/371/a-bugs-life-md-web.jpg",
        actors: ["Kevin Spacey", "Dave Foley", "Julia Louis-Dreyfus"],
        director: "John Lasseter"
    },
    {
        id: "4",
        title: "The Dark Knight",
        description: "When the Joker emerges as a new criminal mastermind, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        genre: ["Action", "Crime", "Drama"],
        imageURL: "https://cdn.europosters.eu/image/750webp/184446.webp",
        actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        director: "Christopher Nolan"
    },
    {
        id: "5",
        title: "Birdman",
        description: "A washed-up superhero actor attempts to revive his career by writing and starring in a Broadway production.",
        genre: ["Comedy", "Drama"],
        imageURL: "https://i.pinimg.com/736x/85/dd/a5/85dda5993e65f4bddd73cf9f28d91670.jpg",
        actors: ["Michael Keaton", "Zach Galifianakis", "Edward Norton"],
        director: "Alejandro G. Iñárritu"
    },
    {
        id: "6",
        title: "Dune",
        description: "Paul Atreides, a young man born into a great destiny, must protect his family's future as malevolent forces clash over the desert planet Arrakis.",
        genre: ["Adventure", "Drama", "Sci-Fi"],
        imageURL: "https://storage.googleapis.com/pod_public/1300/216439.jpg",
        actors: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
        director: "Denis Villeneuve"
    },
    {
        id: "7",
        title: "Django Unchained",
        description: "With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal plantation owner.",
        genre: ["Drama", "Western"],
        imageURL: "https://cdn.europosters.eu/image/750webp/13361.webp",
        actors: ["Jamie Foxx", "Christoph Waltz", "Leonardo DiCaprio"],
        director: "Quentin Tarantino"
    },
    {
        id: "8",
        title: "Spider-Man: Into the Spider-Verse",
        description: "Teenager Miles Morales becomes Spider-Man of his universe and teams up with other Spider-People to stop a threat to all realities.",
        genre: ["Animation", "Action", "Adventure"],
        imageURL: "https://cdn.europosters.eu/image/750webp/66655.webp",
        actors: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
        director: "Bob Persichetti, Peter Ramsey, Rodney Rothman"
    },
    {
        id: "9",
        title: "Toy Story",
        description: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
        genre: ["Animation", "Adventure", "Comedy"],
        imageURL: "https://m.media-amazon.com/images/I/61QPrqydVoL._AC_SL1000_.jpg",
        actors: ["Tom Hanks", "Tim Allen", "Don Rickles"],
        director: "John Lasseter"
    },
    {
        id: "10",
        title: "Joker",
        description: "In Gotham City, mentally troubled comedian Arthur Fleck embarks on a downward spiral that leads to the creation of the iconic Joker.",
        genre: ["Crime", "Drama", "Thriller"],
        imageURL: "https://m.media-amazon.com/images/M/MV5BNzY3OWQ5NDktNWQ2OC00ZjdlLThkMmItMDhhNDk3NTFiZGU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        actors: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
        director: "Todd Phillips"
    },
    {
        id: "11",
        title: "Oppenheimer",
        description: "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
        genre: ["Biography", "Drama", "History"],
        imageURL: "https://www.universalpictures.co.uk/tl_files/content/movies/oppenheimer/posters/01.jpg",
        actors: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
        director: "Christopher Nolan"
    }
];

const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Drama",
    "History",
    "Music",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Western"
];

let directors = [
    {
        id: "1",
        name: "Edgar Wright",
        bio: "British filmmaker known for his work in the Cornetto Trilogy, including 'Shaun of the Dead' and 'Hot Fuzz'.",
        birthYear: 1974,
        deathYear: null
    },
    {
        id: "2",
        name: "Damien Chazelle",
        bio: "American director and screenwriter, known for 'Whiplash' and 'La La Land', which won several Academy Awards.",
        birthYear: 1985,
        deathYear: null
    },
    {
        id: "3",
        name: "John Lasseter",
        bio: "American animator, director, and producer, best known as a co-founder of Pixar Animation Studios.",
        birthYear: 1957,
        deathYear: null
    },
    {
        id: "4",
        name: "Christopher Nolan",
        bio: "British-American filmmaker renowned for directing mind-bending films such as 'Inception', 'Interstellar', and 'The Dark Knight' trilogy.",
        birthYear: 1970,
        deathYear: null
    },
    {
        id: "5",
        name: "Alejandro G. Iñárritu",
        bio: "Mexican filmmaker, known for his unique storytelling style in movies like 'Birdman' and 'The Revenant'.",
        birthYear: 1963,
        deathYear: null
    },
    {
        id: "6",
        name: "Denis Villeneuve",
        bio: "Canadian director acclaimed for his work on 'Arrival', 'Blade Runner 2049', and 'Dune'.",
        birthYear: 1967,
        deathYear: null
    },
    {
        id: "7",
        name: "Quentin Tarantino",
        bio: "American filmmaker known for his distinctive dialogue and nonlinear storytelling in films like 'Pulp Fiction' and 'Django Unchained'.",
        birthYear: 1963,
        deathYear: null
    },
    {
        id: "8",
        name: "Bob Persichetti",
        bio: "American animator and director known for co-directing 'Spider-Man: Into the Spider-Verse'.",
        birthYear: 1973,
        deathYear: null
    },
    {
        id: "9",
        name: "Peter Ramsey",
        bio: "American filmmaker and artist, notable for co-directing 'Spider-Man: Into the Spider-Verse' and 'Rise of the Guardians'.",
        birthYear: 1962,
        deathYear: null
    },
    {
        id: "10",
        name: "Rodney Rothman",
        bio: "American filmmaker and screenwriter, celebrated for co-directing 'Spider-Man: Into the Spider-Verse'.",
        birthYear: 1973,
        deathYear: null
    },
    {
        id: "11",
        name: "Todd Phillips",
        bio: "American filmmaker best known for directing 'The Hangover' trilogy and 'Joker'.",
        birthYear: 1970,
        deathYear: null
    }
];

let users = [
    {
        id: "1",
        name: "Alice",
        username: "alice123",
        email: "test@email.com",
        password: "password",
        dateOfBirth: "1990-01-01"
    }
];


// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.get('/documentation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// Get all movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

// Get Movie by title
app.get('/movies/:title', (req, res, next) => {
    const title = req.params.title;
    const movieSelect = movies.find((movie) => movie.title === title);

    if (!movieSelect) {
        return next(Error(`Movie ${title} not found.`));
    }
    res.json(movieSelect)
});

// Get movies by genres
app.get('/genres/:genre', (req, res, next) => {
    const genre = req.params.genre;
    const filteredMovies = movies.filter((movie) => movie.genre.includes(genre));
    
    if (filteredMovies.length === 0) {
        return next( Error(`Genre ${genre} not found.`));
    }
    res.json(filteredMovies);
});

// Get all directors
app.get('/directors', (req, res) => {
    res.json(directors);
});

// Get director by name
app.get('/directors/:name', (req, res) => {
    res.json(directors.find((director) => {return director.name === req.params.name}))
});


app.get('/users', (req, res) => {
    res.json(users);
});
// Register a new user
app.post('/regist', (req, res) => {
    let newRegist = req.body;
    if (!newRegist.name || !newRegist.email || !newRegist.password) {
        res.status(400).send('Please fill out all fields.');
    } else {
        newRegist.id = uuid.v4();
        users.push(newRegist);
        res.status(201).send('Thank you for registering!');
    }
});

// Update user information
app.put('/users/:id', (req, res) => {
    let user = users.find((user) => {return user.id === req.params.id});

    if (user) {
        let updatedUser = req.body;
        if (updatedUser.username) {
            user.username = updatedUser.username;
        }
        if (updatedUser.email) {
            user.email = updatedUser.email;
        }
        if (updatedUser.password) {
            user.password = updatedUser.password;
        }
        if (updatedUser.dateOfBirth) {
            user.dateOfBirth = updatedUser.dateOfBirth;
        }
        res.status(200).send('User updated.');
    } else {
        res.status(404).send(`User with ID ${req.params.id} not found.`);
    }
});

// Add a movie to the list
app.post('/movies', (req, res) => {
    let newMovie = req.body;

    if (!newMovie.title || !newMovie.directed || !newMovie.description || !newMovie.genre || !newMovie.imageURL || !newMovie.actors || !newMovie.director) {
        res.status(400).send('Please fill out all fields.');
    } else {
        newMovie.id = uuid.v4();
        movies.push(newMovie);
        res.status(201).send('Movie added.');
    }
});

// Delete a movie from the list
app.delete('/movies/:id', (req, res) => {
    let movie = movies.find((movie) => {return movie.id === req.params.id});

    if (movie) {
        movies = movies.filter((movie) => {return movie.id !== req.params.id});
        res.status(200).send('Movie deleted.');
    } else {
        res.status(404).send(`Movie with ID ${req.params.id} not found.`);
    }
});

// Error handling
app.use((err, req, res, next) => {
    if (err.message) {
        res.status(404).send(err.message);
    } else {
        next(err);
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Your app is listening on port ${PORT}.`);
});