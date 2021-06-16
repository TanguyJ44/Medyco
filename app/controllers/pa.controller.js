const Pa = require('../models/pa.model.js');

// Renvoie l'état du service patient
exports.info = (req, res) => {
    res.send({ message: "[UP] The patient service works normally" });
};

// Récupérer les informations du patient
exports.userInfo = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pa.getUserInfo(result.content.userId, (err, data) => {
                if (err) {
                    res.status(500).send({ userInfo: false });
                    console.log("error: ", err);
                } else {
                    delete data.userId;
                    res.send(data);
                }
            });
        } else {
            res.send({ userInfo: false });
        }
    });
};

// Récupérer les informations bancaire du patient
exports.creditCard = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pa.getUserCreditCard(result.content.userId, (err, data) => {
                if (err) {
                    res.status(500).send({ creditCard: false });
                    console.log("error: ", err);
                } else {
                    if (data != false) {
                        delete data.userId;
                        res.send(data);
                    } else {
                        res.send({ creditCard: false });
                    }
                }
            });
        } else {
            res.send({ creditCard: false });
        }
    });
};

// Récupérer les futurs rendez-vous du patient
exports.nextRdv = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pa.getNextRdv(result.content.userId, (err, data) => {
                if (err) {
                    res.status(500).send({ nextRdv: false });
                    console.log("error: ", err);
                } else {
                    if (data == null) {
                        res.send({ nextRdv: false });
                    } else {
                        res.send(data);
                    }
                }
            });
        } else {
            res.send({ nextRdv: false });
        }
    });
};

// Récupérer l'historique des rendez-vous du patient
exports.lastRdv = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pa.getLastRdv(result.content.userId, (err, data) => {
                if (err) {
                    res.status(500).send({ lastRdv: false });
                    console.log("error: ", err);
                } else {
                    if (data == null) {
                        res.send({ lastRdv: false });
                    } else {
                        res.send(data);
                    }
                }
            });
        } else {
            res.send({ lastRdv: false });
        }
    });
};

// Récupérer les enfants du patient
exports.children = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pa.getUserChildren(result.content.userId, (err, data) => {
                if (err) {
                    res.status(500).send({ children: false });
                    console.log("error: ", err);
                } else {
                    res.send(data);
                }
            });
        } else {
            res.send({ children: false });
        }
    });
};

// Récupérer les messages du patient
exports.msg = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pa.getUserMsg(result.content.userId, (err, data) => {
                if (err) {
                    res.status(500).send({ msg: false });
                    console.log("error: ", err);
                } else {
                    if (data == null) {
                        res.send({ msg: false });
                    } else {
                        res.send(data);
                    }
                }
            });
        } else {
            res.send({ msg: false });
        }
    });
};

// Mettre à jour les informations du patient
exports.updateInfo = (req, res) => {
    checkToken(req.body.token, function (result) {
        if (result.content != false) {
            const userInfo = ({
                email: req.body.email,
                address: req.body.address,
                zipcode: req.body.zipcode,
                city: req.body.city
            });

            Pa.updateUserInfo(result.content.userId, userInfo);

            res.send({ updateInfo: true });
        } else {
            res.send({ updateInfo: false });
        }
    });
};

// Mettre à jour les informations bancaire du patient
exports.updateCreditCard = (req, res) => {
    checkToken(req.body.token, function (result) {
        if (result.content != false) {
            const updateCreditCard = ({
                num: req.body.num,
                name: req.body.name,
                date: req.body.date,
                ccv: req.body.ccv
            });
            Pa.getUserCreditCard(result.content.userId, (err, data) => {
                if (err) {
                    res.status(500).send({ updateCreditCard: false });
                    console.log("error: ", err);
                } else {
                    if (data != false) {
                        Pa.updateCreditCard(0, result.content.userId, updateCreditCard);
                    } else {
                        Pa.updateCreditCard(1, result.content.userId, updateCreditCard);
                    }
                    res.send({ updateCreditCard: true });
                }
            });
        } else {
            res.send({ updateCreditCard: false });
        }
    });
};

// Ajouter un enfant au patient
exports.newChildren = (req, res) => {
    checkToken(req.body.token, function (result) {
        if (result.content != false) {
            const newChildren = ({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender: req.body.gender,
                birthDate: req.body.birthDate
            });

            Pa.newUserChildren(result.content.userId, newChildren);

            res.send({ newChildren: true });
        } else {
            res.send({ newChildren: false });
        }
    });
};

// Supprimer un enfant du patient
exports.removeChildren = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pa.removeUserChildren(result.content.userId, req.params.id);

            res.send({ removeChildren: true });
        } else {
            res.send({ removeChildren: false });
        }
    });
};

// Supprimer un rendez-vous patient
exports.removeRdv = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pa.removeUserRdv(result.content.userId, req.params.id);

            res.send({ removeRdv: true });
        } else {
            res.send({ removeRdv: false });
        }
    });
};

// Supprimer un message du patient
exports.removeMsg = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pa.removeUserMsg(result.content.userId, req.params.id);

            res.send({ removeMsg: true });
        } else {
            res.send({ removeMsg: false });
        }
    });
};


// Vérifier le token utilisateur
function checkToken(token, callback) {
    Pa.getUserId(token, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res.userId });
        }
    });
}