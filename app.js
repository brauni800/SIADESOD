const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('SIADESOD app');
});

//routes
app.use(require('./routes/RouteCredentials'));
app.use(require('./routes/RouteDentist'));
app.use(require('./routes/RouteStaff'));
app.use(require('./routes/RoutePatient'));
app.use(require('./routes/RouteAppointment'));
app.use(require('./routes/RouteTreatment'));

app.listen(PORT, () => {
    console.log(`Listen on ${PORT}`);
});