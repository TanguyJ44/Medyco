const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");

const app = express();

// limite de requetes
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000
});

// analyser les demandes de type contenu - application/json
app.use(bodyParser.json());

// analyser les demandes de type contenu - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// autoriser l'accès à distance
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(limiter);

// route racine
app.get("/", (req, res) => {
    res.json({ message: "Medyco WebService" });
});

// route racine api
app.get("/api", (req, res) => {
    res.json({ message: "Medyco API V1 - 2021" });
});

// charger nos routes
require("./app/routes/auth.routes.js")(app);
require("./app/routes/search.routes.js")(app);
require("./app/routes/rdv.routes.js")(app);
require("./app/routes/pa.routes.js")(app);
require("./app/routes/pr.routes.js")(app);
require("./app/routes/admin.routes.js")(app);

// ouvrir le port, écouter les demandes
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});