module.exports = app => {
    const auths = require("../controllers/auth.controller.js");

    // Vérifier l'état du service d'authentification
    app.get("/api/auth", auths.info);

    // Générer le token de connexion
    app.get("/api/auth/login/:gateway", auths.login);

    // Vérifier la validité d'un token
    app.get("/api/auth/token/:token", auths.token);

    // Enregistrer un nouvel utilisateur
    app.post("/api/auth/register", auths.register);

    // Confirmer une adresse mail
    app.put("/api/auth/register/confirm/:token", auths.confirm);

    // Invalider le token utilisateur (déconnexion)
    app.delete("/api/auth/logout/:token", auths.logout);

    // Mot de passe oublié
    app.put("/api/auth/recovery/:email", auths.recovery);

    // Définir un nouveau mot de passe
    app.post("/api/auth/recovery/update", auths.update);
};