const Auth = require("../models/auth.model.js");
const Mail = require("../models/mail.js");
const fs = require('fs');
const { promisify } = require('util');
const path = require("path");
const TokenGenerator = require('uuid-token-generator');

const readFile = promisify(fs.readFile);

// Renvoie l'état du service d'authentification
exports.info = (req, res) => {
    checkIfBddIsUp(function (result) {
        if (result.content == true) {
            res.send({ message: "[UP] The authentication service works normally" });
        } else {
            res.status(500).send({
                message:
                    err.message || " [DOWN] The authentication service has encountered a problem and is no longer available for the moment."
            });
        }
    });
};

// [LOGIN] Générer un nouveau token de connexion
exports.login = (req, res) => {

    const gateway = req.params.gateway;
    let gateway_split = gateway.split("$");

    Auth.getUserPassword(gateway_split[0], (err, data) => {
        if (err) {
            res.status(500).send({ login: false });
            console.log("error: ", err);
        } else {
            if (data.password.length > 1 && gateway_split[1] == data.password) {
                if (data.rpps.length == 0) {
                    verifUserPaStatus(data.userId, function (result) {
                        if (result.content == 1) {
                            generateNewToken(0, data.userId, res);
                        } else {
                            res.send({ login: false });
                        }
                    });
                } else {
                    if (gateway_split[2] == data.rpps) {
                        verifUserPrStatus(data.userId, function (result) {
                            if (result.content == 1) {
                                generateNewToken(1, data.userId, res);
                            } else {
                                res.send({ login: false });
                            }
                        });
                    } else {
                        res.send({ login: false });
                    }
                }
            } else {
                res.send({ login: false });
            }

        }
    });
};

// Vérifier la validité d'un token
exports.token = (req, res) => {
    Auth.checkToken(req.params.token, (err, data) => {
        if (err)
            res.status(500).send({ token: false });
        else
            res.send(data);
    });
};

// Enregistrer un nouvel utilisateur
exports.register = (req, res) => {
    if (req.body.rpps == 0) {
        Auth.checkPaEmailExist(req.body.email, (err, data) => {
            if (err) {
                res.send({ register: false });
            } else {
                if (data.email == false) {
                    const client = ({
                        userId: generateNewUserId("PA"),
                        gender: req.body.gender,
                        lastname: req.body.lastname,
                        firstname: req.body.firstname,
                        email: req.body.email,
                        birth: req.body.birth,
                        address: req.body.address,
                        city: req.body.city,
                        zipcode: req.body.zipcode,
                        password: req.body.password
                    });
                    Auth.savePaAccount(client);
                    let confirmToken = generateRecoveryToken();
                    let mailContent = fs.readFileSync(path.resolve(__dirname, '../res/confirm-mail.html'), 'utf8');
                    mailContent = mailContent.toString().replace('{{TOKEN}}', confirmToken);
                    Auth.saveConfirmToken(client.userId, confirmToken);
                    Mail({
                        from: 'Medyco <contact@medyco.fr>',
                        to: client.email,
                        subject: 'Confirmer votre e-mail | Medyco.fr',
                        html: mailContent
                    });
                    res.send({ register: true, type: 0 });
                } else {
                    res.send({ register: false });
                }
            }
        });
    } else {
        Auth.checkPrEmailExist(req.body.email, (err, data) => {
            if (err) {
                res.send({ register: false });
            } else {
                if (data.email == false) {
                    checkIfRppsExist(req.body.rpps, function (result) {
                        if (result.content == false) {
                            const professional = ({
                                userId: generateNewUserId("PR"),
                                gender: req.body.gender,
                                name: req.body.lastname + ' ' + req.body.firstname,
                                email: req.body.email,
                                address: req.body.address,
                                city: req.body.city,
                                zipcode: req.body.zipcode,
                                rpps: req.body.rpps,
                                password: req.body.password
                            });
                            Auth.savePrAccount(professional);
                            res.send({ register: true, type: 1 });
                        } else {
                            res.send({ register: false });
                        }
                    });
                } else {
                    res.send({ register: false });
                }
            }
        });
    }
};

// Supprime un token d'authentification existant
exports.logout = (req, res) => {
    Auth.removeToken(req.params.token, (err, data) => {
        if (err)
            res.status(500).send({ logout: false });
        else
            res.send({ logout: data.delete });
    });
};

// Mot de passe oublié
exports.recovery = (req, res) => {
    checkIfUserExistByEmail(req.params.email, function (result) {
        if (result.content != false) {
            let recoveryToken = generateRecoveryToken();
            let mailContent = fs.readFileSync(path.resolve(__dirname, '../res/recovery-mail.html'), 'utf8');
            mailContent = mailContent.toString().replace('{{TOKEN}}', recoveryToken);
            saveRecoveryToken(result.content, recoveryToken, function (result2) {
                if (result2.content == true) {
                    Mail({
                        from: 'Medyco <contact@medyco.fr>',
                        to: req.params.email,
                        subject: 'Demande de récupération de mot de passe | Medyco.fr',
                        html: mailContent
                    });
                    res.send({ recovery: true });
                } else {
                    res.send({ recovery: false });
                }
            });
        } else {
            res.send({ recovery: false });
        }
    });
};

// Définir un nouveau mot de passe
exports.update = (req, res) => {
    if (!req.body) {
        res.send({ update: false });
    }
    Auth.getUserIdUpdatePassword(req.body.token, (err, data) => {
        if (err) {
            res.send({ update: false });
        } else {
            if (data.userId != false) {
                Auth.updateUserPassword(data.userId, req.body.password);
                res.send({ update: true });
            } else {
                res.send({ update: false });
            }
        }
    });
};

// Confirmer une adresse mail
exports.confirm = (req, res) => {
    Auth.getUserIdConfirmEmail(req.params.token, (err, data) => {
        if (err) {
            res.status(500).send({ confirm: false });
        } else {
            verifUserPaStatus(data.userId, function (result) {
                if (result.content == 0) {
                    Auth.updateUserStatus(data.userId);
                    res.send({ confirm: true });
                } else {
                    res.send({ confirm: false });
                }
            });
        }
    });
};

// Vérifier si la BDD est UP
function checkIfBddIsUp(callback) {
    Auth.isOnline((err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: true });
        }
    });
}

// Générer un nouvel id utilisateur
function generateNewUserId(type) {
    const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
    let gentoken = tokgen.generate();

    let format_token = type + "-" + gentoken.slice(0, 14) + "-" + gentoken.slice(14, 21) + "-" + gentoken.slice(21, 28) + "-" + gentoken.slice(28, 42);

    return format_token.toUpperCase();
}

// Vérifier si l'id utilisateur exist
function checkIfUserIdExist(userId) {

}

// Générer un nouveau token
function generateNewToken(type, userId, res) {
    const tokgen = new TokenGenerator(128, TokenGenerator.BASE62);
    let gentoken = tokgen.generate();

    let format_token = gentoken.slice(0, 8) + "-" + gentoken.slice(8, 14) + "-" + gentoken.slice(14, 22);

    checkIfTokenExist(format_token, function (result) {
        if (result.content == false) {
            saveToken(userId, format_token, function (result) {
                if (result.content == true) {
                    res.send({ login: true, type: type, token: format_token });
                } else {
                    res.send({ login: false });
                }
            });
        } else {
            res.send({ login: false });
        }
    });
}

// Vérifier si un token exist
function checkIfTokenExist(token, callback) {
    Auth.getTokenExist(token, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res.exist });
        }
    });
}

// Enregistrer le token d'authentification
function saveToken(userId, token, callback) {
    Auth.saveToken(userId, token, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res.save });
        }
    });
}

// Vérifier si le compte du patient est bloqué ou non
function verifUserPaStatus(userId, callback) {
    Auth.getUserPaStatus(userId, (err, result) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: result.status });
        }
    });
}

// Vérifier si le compte du praticien est bloqué ou non
function verifUserPrStatus(userId, callback) {
    Auth.getUserPrStatus(userId, (err, result) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: result.status });
        }
    });
}

// Vérifier si un token exist
function checkIfUserExistByEmail(email, callback) {
    Auth.getUserIdByEmail(email, (err, res) => {
        if (!!err) {
            callback({ error: true, content: false });
        } else {
            callback({ error: false, content: res.userId });
        }
    });
}

// Enregistrer le token de récupération (mdp)
function saveRecoveryToken(userId, token, callback) {
    Auth.saveRecoveryToken(userId, token, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res.save });
        }
    });
}

// Générer un nouveau token de récupération
function generateRecoveryToken() {
    const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
    let gentoken = tokgen.generate();

    let format_token = gentoken.slice(0, 10);

    return format_token;
}

// Vérifier si le numéro RPPS existe
function checkIfRppsExist(rpps, callback) {
    Auth.checkRppsExist(rpps, (err, res) => {
        if (!!err) {
            callback({ error: true, content: true });
        } else {
            callback({ error: false, content: res.rpps });
        }
    });
}