module.exports = app => {
    const rdv = require("../controllers/rdv.controller.js");

    // Vérifier l'état du service de rendez-vous
    app.get("/api/rdv", rdv.info);

    // Récupérer les utilisateurs rattaché au compte
    app.get("/api/rdv/pa/:token/name", rdv.paName);

    // Prendre un nouveau rendez-vous
    app.post("/api/rdv/new", rdv.new);

    // Récupérer informations sur praticien
    app.get("/api/rdv/pr/:id/info", rdv.prInfo);

    // Récupérer les créneaux disponibles à une date
    app.get("/api/rdv/pr/:id/slots/:date", rdv.prSlots);

    // Récupérer le nom d'un utilisateur en visio
    app.get("/api/rdv/display/:token/name/:type", rdv.displayName);
};