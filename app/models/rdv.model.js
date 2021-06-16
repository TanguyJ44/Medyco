const sql = require("./db.js");

// constructeur de la table
const Rdv = function (rdv) {
    this.req = rdv.req;
};

// Récupérer le userId de l'utilisateur
Rdv.getUserId = (token, result) => {
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

// Récupérer les informations d'un praticien
Rdv.getPrInfo = (id, result) => {
    sql.query('SELECT * FROM professionals WHERE id = ?', id, (err, res) => {
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

// Récupérer les informations du patient
Rdv.getPaInfo = (userId, result) => {
    sql.query('SELECT firstname, lastname FROM clients WHERE userId = ?', userId, (err, res) => {
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

// Récupérer les enfants rattachés au patient
Rdv.getPaChildren = (tutorId, result) => {
    sql.query('SELECT firstname, lastname FROM children WHERE tutorId = ?', tutorId, (err, res) => {
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

// Récupérer le userId du praticien
Rdv.getPrUserId = (id, result) => {
    sql.query('SELECT userId FROM professionals WHERE id = ?', id, (err, res) => {
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

// Vérifier si un jour est un jour de travail
Rdv.getSchedulesDay = (userId, day, result) => {
    sql.query('SELECT ' + day + ' FROM schedules WHERE userId = ?', userId, (err, res) => {
        if (err) {
            result(null, 0);
            return;
        }
        if (res.length) {
            result(null, res[0][day]);
            return;
        }
        result(null, 0);
    });
};

// Vérifier si un jour est un jour de vacances
Rdv.getVacationsDay = (userId, date, result) => {
    sql.query('SELECT * FROM vacations WHERE userId = ? AND date = ?', [userId, date], (err, res) => {
        if (err) {
            result(null, false);
            return;
        }
        if (res.length) {
            result(null, true);
            return;
        }
        result(null, false);
    });
};

// Récupérer la tranche horaire d'un jour de travail
Rdv.getSchedulesInfo = (userId, day, result) => {
    sql.query('SELECT ' + day + 'AM, ' + day + 'PM, meetingTime FROM schedules WHERE userId = ?', userId, (err, res) => {
        if (err) {
            result(null, false);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result(null, false);
    });
};

// Récupérer les rendez-vous existant du PR à une date
Rdv.getSlotsReserved = (userId, date, result) => {
    sql.query('SELECT time FROM meetings WHERE speId = ? AND date = ?', [userId, date], (err, res) => {
        if (err) {
            result(null, false);
            return;
        }
        if (res.length) {
            result(null, res);
            return;
        }
        result(null, false);
    });
};

// Récupérer l'e-mail du patient
Rdv.getPaEmail = (userId, result) => {
    sql.query('SELECT email FROM clients WHERE userId = ?', userId, (err, res) => {
        if (err) {
            result(null, false);
            return;
        }
        if (res.length) {
            result(null, res);
            return;
        }
        result(null, false);
    });
};

// Récupérer le nom d'un utilisateur en visio
Rdv.getDisplayName = (userId, type, result) => {
    if (type == 0) {
        sql.query('SELECT firstname, lastname FROM clients WHERE userId = ?', userId, (err, res) => {
            if (err) {
                result(null, false);
                return;
            }
            if (res.length) {
                result(null, res);
                return;
            }
            result(null, false);
        });
    } else {
        sql.query('SELECT name FROM professionals WHERE userId = ?', userId, (err, res) => {
            if (err) {
                result(null, false);
                return;
            }
            if (res.length) {
                result(null, res);
                return;
            }
            result(null, false);
        });
    }
};

// Enregistrer un nouveau rendez-vous
Rdv.newRdv = (newRdv) => {
    sql.query('INSERT INTO meetings (userId, speId, type, consulted, reason, date, time, patientId, room) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [newRdv.userId, newRdv.speId, newRdv.type, newRdv.consulted, newRdv.reason, newRdv.date, newRdv.time, newRdv.patientId, newRdv.room]);
};

module.exports = Rdv;
