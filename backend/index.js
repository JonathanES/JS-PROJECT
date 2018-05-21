const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

const logRequests = (req, res, next) => {
    const { ip, method, originalUrl } = req;
    console.log(`[LOG] ${ip} ${method} ${originalUrl}`);
    next();
};

const routes = require('./routes');

app.use(logRequests);

app.get('/api/customers', (req, res) => {
    const customers = [
        { id: 1, firstname: 'Jonathan', lastname: 'Espiard' },
        { id: 2, firstname: 'Abby', lastname: 'Yang' },
        { id: 3, firstname: 'Mickael', lastname: 'AU' }
    ];
    res.json(customers);
});

app.use('/', routes);


app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});


module.exports = app;

app.listen(5000);

