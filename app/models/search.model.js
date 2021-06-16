const sql = require("./db.js");

// constructeur de la table
const Search = function (search) {
    this.req = search.req;
};

// Récupérer le userId de l'utilisateur
Search.getUserId = (token, result) => {
    sql.query('SELECT userId FROM tokens WHERE token = ?', token, (err, res) => {
        if (err) {
            result(null, { userId: false });
            return;
        }
        if (res.length) {
            result(null, { userId: res[0] });
            return;
        }
        result(null, { userId: false });
    });
};

// Récupérer tous les praticiens favories de l'utilisateur 
Search.getUserFavorite = (userId, result) => {
    sql.query('SELECT speId FROM favorites WHERE userId = ?', userId, (err, res) => {
        if (err) {
            result(null, null);
            return;
        }
        if (res.length) {
            result(null, res);
            return;
        }
        result(null, null);
    });
};

// Récupérer le userId d'un praticien avec son id
Search.getPrUserId = (id, result) => {
    sql.query('SELECT userId FROM professionals WHERE id = ?', id, (err, res) => {
        if (err) {
            result(null, { userId: false });
            return;
        }
        if (res.length) {
            result(null, { userId: res[0] });
            return;
        }
        result(null, { userId: false });
    });
};

// Ajouter un praticien au favorie de l'utilisateur
Search.addPrFavorite = (userId, speId, result) => {
    sql.query('INSERT INTO favorites (userId, speId) VALUES (?, ?)', [userId, speId]);
};

// Supprimer un praticien des favories de l'utilisateur
Search.removePrFavorite = (userId, speId, result) => {
    sql.query('DELETE FROM favorites WHERE userId = ? AND speId = ?', [userId, speId]);
};

module.exports = Search;
