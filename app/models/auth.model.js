const sql = require("./db.js");

// constructeur de la table
const Auth = function (auth) {
    this.userId = auth.userId;
    this.email = auth.email;
    this.password = auth.password;
    this.rpps = auth.rpps;
};

// Vérifier si la BDD ping
Auth.isOnline = (result) => {
    sql.query('SELECT id FROM admin', (err, res) => {
        if (err) {
            result(null, { password: 0 });
            return;
        }
        result(null, true);
    });
};

// Récupérer le mdp de l'utilisateur
Auth.getUserPassword = (email, result) => {
    sql.query('SELECT * FROM auth WHERE email = ?', email, (err, res) => {
        if (err) {
            result(null, { password: 0 });
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result(null, { password: 0 });
    });
};

// Vérifier la validité d'un token
Auth.checkToken = (token, result) => {
    sql.query('SELECT id FROM tokens WHERE token = ?', token, (err, res) => {
        if (err) {
            result(null, { token: false });
            return;
        }
        if (res.length) {
            result(null, { token: true });
            return;
        }
        result(null, { token: false });
    });
};

// Récupérer le statut d'un patient
Auth.getUserPaStatus = (userId, result) => {
    sql.query('SELECT status FROM clients WHERE userId = ?', userId, (err, res) => {
        if (err) {
            result(null, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result(null, null);
    });
};

// Récupérer le statut d'un praticien
Auth.getUserPrStatus = (userId, result) => {
    sql.query('SELECT status FROM professionals WHERE userId = ?', userId, (err, res) => {
        if (err) {
            result(null, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result(null, null);
    });
};

// Vérifier si le token exist
Auth.getTokenExist = (token, result) => {
    sql.query('SELECT token FROM tokens WHERE token = ?', token, (err, res) => {
        if (err) {
            result(null, null);
            return;
        }
        if (res.length) {
            result(null, { exist: true });
            return;
        }
        result(null, { exist: false });
    });
};

// Enregistrer le token d'authentification
Auth.saveToken = (userId, token, result) => {
    sql.query('DELETE FROM tokens WHERE userId = ?', userId, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        let current_date = new Date().toJSON().slice(0, 10);
        sql.query('INSERT INTO tokens (userId, token, issued) VALUES (?, ?, ?)', [userId, token, current_date], (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, { save: true });
        });

    });
};

// Supprime un token d'authentification existant
Auth.removeToken = (token, result) => {
    sql.query('DELETE FROM tokens WHERE token = ?', token, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result(null, { delete: false });
            return;
        }
        result(null, { delete: true });
    });
};

// Récupérer l'id utilisateur avec une email
Auth.getUserIdByEmail = (email, result) => {
    sql.query('SELECT userId FROM clients WHERE email = ?', email, (err, res) => {
        if (err) {
            result(null, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result(null, { userId: false });
    });
};

// Enregistrer le token de récupération
Auth.saveRecoveryToken = (userId, token, result) => {
    let current_date = new Date().toJSON().slice(0, 10);
    sql.query('INSERT INTO recovery (userId, token, issued) VALUES (?, ?, ?)', [userId, token, current_date], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, { save: true });
    });
};

// Récupérer le userId de l'email à valider 
Auth.getUserIdConfirmEmail = (token, result) => {
    sql.query('SELECT userId FROM confirm_email WHERE token = ?', token, (err, res) => {
        if (err) {
            result(null, { userId: false });
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result(null, { userId: false });
    });
};

// Mettre à jour le statut d'un utilisateur
Auth.updateUserStatus = (userId) => {
    sql.query('UPDATE clients SET status = 1 WHERE userId = ?', userId);
    sql.query('DELETE FROM confirm_email WHERE userId = ?', userId);
};

// Récupérer le userId du compte à mettre à jour 
Auth.getUserIdUpdatePassword = (token, result) => {
    sql.query('SELECT userId FROM recovery WHERE token = ?', token, (err, res) => {
        if (err) {
            result(null, { userId: false });
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result(null, { userId: false });
    });
};

// Mettre à jour le mot de passe d'un utilisateur
Auth.updateUserPassword = (userId, password, result) => {
    sql.query('UPDATE auth SET password = ? WHERE userId = ?', [password, userId]);
    sql.query('DELETE FROM recovery WHERE userId = ?', userId);
};

// Vérifier si l'email patient exsite déjà
Auth.checkPaEmailExist = (email, result) => {
    sql.query('SELECT email FROM clients WHERE email = ?', email, (err, res) => {
        if (err) {
            result(null, { email: true });
            return;
        }
        if (res.length) {
            result(null, { email: true });
            return;
        }
        result(null, { email: false });
    });
};

// Vérifier si l'email praticien exsite déjà
Auth.checkPrEmailExist = (email, result) => {
    sql.query('SELECT email FROM professionals WHERE email = ?', email, (err, res) => {
        if (err) {
            result(null, { email: true });
            return;
        }
        if (res.length) {
            result(null, { email: true });
            return;
        }
        result(null, { email: false });
    });
};

// Vérifier si le numéro RPPS exsite déjà
Auth.checkRppsExist = (rpps, result) => {
    sql.query('SELECT RPPS FROM professionals WHERE RPPS = ?', rpps, (err, res) => {
        if (err) {
            result(null, { rpps: true });
            return;
        }
        if (res.length) {
            result(null, { rpps: true });
            return;
        }
        result(null, { rpps: false });
    });
};

// Enregistrer le compte PA
Auth.savePaAccount = (client) => {
    sql.query('INSERT INTO clients (userId, email, gender, firstname, lastname, address, city, zipcode, birthDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [client.userId, client.email, client.gender, client.firstname, client.lastname, client.address, client.city, client.zipcode, client.birth, 0]);
    sql.query('INSERT INTO auth (userId, email, password) VALUES (?, ?, ?)', [client.userId, client.email, client.password]);
};

// Enregistrer le token de confirmation
Auth.saveConfirmToken = (userId, token) => {
    let current_date = new Date().toJSON().slice(0, 10);
    sql.query('INSERT INTO confirm_email (userId, token, issued) VALUES (?, ?, ?)', [userId, token, current_date]);
};

// Enregistrer le compte PR
Auth.savePrAccount = (professional) => {
    sql.query('INSERT INTO professionals (userId, email, gender, name, address, city, zipcode, RPPS, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [professional.userId, professional.email, professional.gender, professional.name.toUpperCase(), professional.address.toUpperCase(), professional.city.toUpperCase(), professional.zipcode, professional.rpps, 0]);
    sql.query('INSERT INTO auth (userId, email, password, rpps) VALUES (?, ?, ?, ?)', [professional.userId, professional.email, professional.password, professional.rpps]);
};

module.exports = Auth;
