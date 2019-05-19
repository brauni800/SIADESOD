const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const app = express();

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.use(require('./routes/RouteDentist'));
app.use(require('./routes/RouteStaff'));
app.use(require('./routes/RoutePatient'));

app.listen(PORT, () => {
    console.log(`Listen on ${PORT}`);
});