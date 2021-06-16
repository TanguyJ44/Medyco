module.exports = app => {
    const searchs = require("../controllers/search.controller.js");

    // Vérifier l'état du service de recherche
    app.get("/api/search", searchs.info);

    // Recherche dans toutes les catégories
    app.get("/api/search/:query", searchs.search);

    // Recherche dans une catégorie spécifique
    app.get("/api/search/:category/:query", searchs.category);

    // Récupérer les praticiens favories d'un utilisateur
    app.get("/api/favorite/:token", searchs.favorite);

    // Ajouter un praticien au favorie de l'utilisateur
    app.put("/api/favorite/:token/add/:id", searchs.addFavorite);

    // Supprimer un praticien des favories de l'utilisateur
    app.delete("/api/favorite/:token/remove/:id", searchs.removeFavorite);

};