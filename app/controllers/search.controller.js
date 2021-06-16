const algoliasearch = require('algoliasearch');
const { getUserFavorite } = require('../models/search.model.js');
const Search = require('../models/search.model.js');

const client = algoliasearch('KWUHKVKTP4', '366dc991ebb3e4ecd667e89705b5ba42');
const index = client.initIndex('spe_v1');

// Renvoie l'état du service de recherche
exports.info = (req, res) => {
    res.send({ message: "[UP] The search service works normally" });
};

// Recherche dans toutes les catégories
exports.search = (req, res) => {
    index.search(req.params.query).then(({ hits }) => {
        res.send(hits);
    });
};

// Recherche dans une catégorie spécifique
exports.category = (req, res) => {
    index.search(req.params.query, {
        restrictSearchableAttributes: req.params.category
    }).then(({ hits }) => {
        res.send(hits);
    });
};

// Récupérer les praticiens favories d'un utilisateur
exports.favorite = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            getFavoritePr(result.content.userId, function (result2) {
                if (result2.content != null) {
                    getPrData(result2.content, function (result3) {
                        if (result3.content != null) {
                            res.send(result3.content);
                        } else {
                            res.send({ favorite: false });
                        }
                    });
                } else {
                    res.send({ favorite: false });
                }
            });
        } else {
            res.send({ favorite: false });
        }
    });
};

// Ajouter un praticien au favorie de l'utilisateur
exports.addFavorite = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            getPrUserId(req.params.id, function (result2) {
                if (result2.content != false) {
                    Search.addPrFavorite(result.content.userId, result2.content.userId.userId);
                    res.send({ addFavorite: true });
                } else {
                    res.send({ addFavorite: false });
                }
            });
        } else {
            res.send({ addFavorite: false });
        }
    });
};

// Supprimer un praticien des favories de l'utilisateur
exports.removeFavorite = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            getPrUserId(req.params.id, function (result2) {
                if (result2.content != false) {
                    Search.removePrFavorite(result.content.userId, result2.content.userId.userId);
                    res.send({ removeFavorite: true });
                } else {
                    res.send({ removeFavorite: false });
                }
            });
        } else {
            res.send({ removeFavorite: false });
        }
    });
};

// Vérifier le token utilisateur
function checkToken(token, callback) {
    Search.getUserId(token, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res.userId });
        }
    });
}

// Liste des praticiens favories
function getFavoritePr(userId, callback) {
    Search.getUserFavorite(userId, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res });
        }
    });
}

// Récupérer les infos sur les praticiens favories
function getPrData(result, callback) {
    const resultSize = Object.keys(result).length;
    let data = null;

    for (let i = 0; i < resultSize; i++) {
        index.search(result[i].speId).then(({ hits }) => {
            if (data == null) {
                data = hits;
            } else {
                data = data.concat(hits);
            }
            if (i == resultSize - 1) {
                callback({ error: false, content: data });
            }
        });
    }
}

// Liste des praticiens favories
function getPrUserId(id, callback) {
    Search.getPrUserId(id, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res });
        }
    });
}
