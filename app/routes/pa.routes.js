module.exports = app => {
    const pa = require("../controllers/pa.controller.js");

    // Vérifier l'état du service patient
    app.get("/api/pa", pa.info);

    // Récupérer les informations du patient
    app.get("/api/pa/:token/info", pa.userInfo);

    // Récupérer les informations bancaire du patient
    app.get("/api/pa/:token/credit-card", pa.creditCard);

    // Récupérer les futurs rendez-vous du patient
    app.get("/api/pa/:token/next-rdv", pa.nextRdv);

    // Récupérer l'historique des rendez-vous du patient
    app.get("/api/pa/:token/last-rdv", pa.lastRdv);

    // Récupérer les enfants du patient
    app.get("/api/pa/:token/children", pa.children);

    // Récupérer les messages du patient
    app.get("/api/pa/:token/msg", pa.msg);

    // Mettre à jour les informations du patient
    app.put("/api/pa/update/info", pa.updateInfo);

    // Mettre à jour les informations bancaire du patient
    app.put("/api/pa/update/credit-card", pa.updateCreditCard);

    // Ajouter un enfant au patient
    app.post("/api/pa/add/children", pa.newChildren);

    // Supprimer un enfant du patient
    app.delete("/api/pa/:token/remove/children/:id", pa.removeChildren);

    // Supprimer un rendez-vous patient
    app.delete("/api/pa/:token/remove/rdv/:id", pa.removeRdv);

    // Supprimer un message du patient
    app.delete("/api/pa/:token/remove/msg/:id", pa.removeMsg);
};