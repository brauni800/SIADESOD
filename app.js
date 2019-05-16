const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.use(require('./routes/RouteStaff'));
app.use(require('./routes/RoutePatient'));

app.listen(3000, () => {
    console.log('Listen on port 3000');
});