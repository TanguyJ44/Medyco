const Admin = require('../models/admin.model.js');
const Mail = require("../models/mail.js");
const fs = require('fs');
const path = require("path");

// Renvoie l'état du service admin
exports.info = (req, res) => {
    res.send({ message: "[UP] The admin service works normally" });
};

// Vérifier si l'utilisateur est administrateur
exports.verif = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            checkUserAdmin(result.content.userId, function (result2) {
                res.send({ admin: result2.content });
            });
        } else {
            res.send({ admin: false });
        }
    });
};

// Récupérer la liste des nouveaux praticiens en attente
exports.newPr = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            checkUserAdmin(result.content.userId, function (result2) {
                if (result2.content == true) {
                    Admin.getNewPr((err, data) => {
                        if (err) {
                            res.status(500).send({ newPr: false });
                            console.log("error: ", err);
                        } else {
                            if (data == null) {
                                res.send({ newPr: false });
                            } else {
                                res.send(data);
                            }
                        }
                    });
                } else {
                    res.send({ newPr: false });
                }
            });
        } else {
            res.send({ newPr: false });
        }
    });
};

// Récupérer les infos d'un praticiens en attente
exports.infoPr = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            checkUserAdmin(result.content.userId, function (result2) {
                if (result2.content == true) {
                    Admin.getInfoPr(req.params.id, (err, data) => {
                        if (err) {
                            res.status(500).send({ infoPr: false });
                            console.log("error: ", err);
                        } else {
                            if (data == null) {
                                res.send({ infoPr: false });
                            } else {
                                res.send(data);
                            }
                        }
                    });
                } else {
                    res.send({ infoPr: false });
                }
            });
        } else {
            res.send({ infoPr: false });
        }
    });
};

// Accepter un praticien en attente
exports.confirmPr = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            checkUserAdmin(result.content.userId, function (result2) {
                if (result2.content == true) {
                    Admin.confirmPr(req.params.id);

                    getPrEmail(req.params.id, function (result3) {
                        if (result3.content != null) {
                            let mailContent = fs.readFileSync(path.resolve(__dirname, '../res/pr-accept.html'), 'utf8');

                            Mail({
                                from: 'Medyco <contact@medyco.fr>',
                                to: result3.content[0].email,
                                subject: 'Inscription approuvée | Medyco.fr',
                                html: mailContent
                            });
                        }
                    });

                    res.send({ confirmPr: true });
                } else {
                    res.send({ confirmPr: false });
                }
            });
        } else {
            res.send({ confirmPr: false });
        }
    });
};

// Supprimer un praticien en attente
exports.removePr = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            checkUserAdmin(result.content.userId, function (result2) {
                if (result2.content == true) {
                    getPrEmail(req.params.id, function (result3) {
                        if (result3.content != null) {
                            let mailContent = fs.readFileSync(path.resolve(__dirname, '../res/pr-deny.html'), 'utf8');

                            Mail({
                                from: 'Medyco <contact@medyco.fr>',
                                to: result3.content[0].email,
                                subject: 'Inscription refusée | Medyco.fr',
                                html: mailContent
                            });
                        }
                    });

                    Admin.removePr(req.params.id);

                    res.send({ removePr: true });
                } else {
                    res.send({ removePr: false });
                }
            });
        } else {
            res.send({ removePr: false });
        }
    });
};


// Vérifier le token utilisateur
function checkToken(token, callback) {
    Admin.getUserId(token, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res.userId });
        }
    });
}

// Vérifier si l'utilisateur est admin
function checkUserAdmin(userId, callback) {
    Admin.getUserIsAdmin(userId, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res });
        }
    });
}

// Récupérer l'e-mail du praticien
function getPrEmail(id, callback) {
    Admin.getPrEmail(id, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res });
        }
    });
}