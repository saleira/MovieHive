const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

const topMovies = [
    {
        title: 'Scott Pilgrim vs. the World',
        directed: '	Edgar Wright'
    },
    {
        title: 'Whiplash',
        directed: 'Damien Chazelle'
    },
    {
        title: 'A Bug\'s Life',
        directed: 'John Lasseter'
    },
    {
        title: 'The Dark Knight',
        directed: 'Christopher Nolan'
    },
    {
        title: 'Birdman',
        directed: 'Alejandro G. Iñárritu'
    },
    {
        title: 'Dune',
        directed: 'Denis Villeneuve'
    },
    {
        title: 'Django Unchained',
        directed: 'Quentin Tarantino'
    },
    {
        title: 'Spider-Man: Into the Spider-Verse',
        directed: 'Bob Persichetti, Peter Ramsey, Rodney Rothman'
    },
    {
        title: 'Toy Story',
        directed: 'John Lasseter'
    },
    {
        title: 'Joker',
        directed: 'Todd Phillips'
    },
    { 
        title: 'Oppenheimer',
        directed: 'Christopher Nolan'
    }
];

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

// Middleware
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to my app!');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).send('Not Found!');
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