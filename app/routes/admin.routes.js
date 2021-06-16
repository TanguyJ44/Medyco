module.exports = app => {
    const admin = require("../controllers/admin.controller.js");

    // Vérifier l'état du service admin
    app.get("/api/admin", admin.info);

    // Vérifier si l'utilisateur est administrateur
    app.get("/api/admin/:token/verif", admin.verif);

    // Récupérer la liste des nouveaux praticiens en attente
    app.get("/api/admin/:token/new-pr", admin.newPr);

    // Récupérer les infos d'un praticiens en attente
    app.get("/api/admin/:token/info-pr/:id", admin.infoPr);

    // Accepter un praticien en attente
    app.put("/api/admin/:token/confirm-pr/:id", admin.confirmPr);

    // Supprimer un praticien en attente
    app.delete("/api/admin/:token/remove-pr/:id", admin.removePr);
};