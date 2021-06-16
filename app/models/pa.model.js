const sql = require("./db.js");

// constructeur de la table
const Pa = function (pa) {
    this.pa = pa.req;
};

// Récupérer le userId de l'utilisateur
Pa.getUserId = (token, result) => {
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

// Récupérer les informations du patient
Pa.getUserInfo = (userId, result) => {
    sql.query('SELECT * FROM clients WHERE userId = ?', userId, (err, res) => {
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

// Récupérer les informations bancaire du patient
Pa.getUserCreditCard = (userId, result) => {
    sql.query('SELECT * FROM credit_card WHERE userId = ?', userId, (err, res) => {
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

// Récupérer les enfants du patient
Pa.getUserChildren = (userId, result) => {
    sql.query('SELECT * FROM children WHERE tutorId = ?', userId, (err, res) => {
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

// Récupérer les messages du patient
Pa.getUserMsg = (userId, result) => {
    sql.query('SELECT id, name, date, time FROM messaging WHERE userId = ?', userId, (err, res) => {
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

// Récupérer les futurs rendez-vous patient
Pa.getNextRdv = (userId, result) => {
    let date = new Date();
    let time = new Date();

    date = date.getFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2);
    time = ('00' + time.getHours()).slice(-2) + ':' +
        ('00' + (time.getMinutes()-10)).slice(-2) + ':' +
        ('00' + time.getSeconds()).slice(-2);

    sql.query('SELECT meetings.id, meetings.date, meetings.time, meetings.type, meetings.room, professionals.name, professionals.specialties, professionals.address, professionals.city, professionals.zipcode, professionals.email FROM meetings INNER JOIN professionals ON meetings.speId = professionals.userId WHERE meetings.userId = ? AND meetings.date = ? AND meetings.time >= ?', [userId, date, time], (err1, res1) => {
        sql.query('SELECT meetings.id, meetings.date, meetings.time, meetings.type, meetings.room, professionals.name, professionals.specialties, professionals.address, professionals.city, professionals.zipcode, professionals.email FROM meetings INNER JOIN professionals ON meetings.speId = professionals.userId WHERE meetings.userId = ? AND meetings.date > ?', [userId, date], (err2, res2) => {
            if (!err1 && !err2 && res1.length || res2.length) {
                let allRes = {
                    res1,
                    res2
                };
                result(null, allRes);
                return;
            } else {
                result(null, null);
                return;
            }
        });
    });
};

// Récupérer l'historique des rendez-vous du patient
Pa.getLastRdv = (userId, result) => {
    let date = new Date();
    let time = new Date();

    date = date.getFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2);
    time = ('00' + time.getHours()).slice(-2) + ':' +
        ('00' + (time.getMinutes()-10)).slice(-2) + ':' +
        ('00' + time.getSeconds()).slice(-2);

    sql.query('SELECT meetings.date, meetings.time, meetings.type, professionals.name, professionals.specialties, professionals.address, professionals.city, professionals.zipcode, professionals.email FROM meetings INNER JOIN professionals ON meetings.speId = professionals.userId WHERE meetings.userId = ? AND meetings.date = ? AND meetings.time < ?', [userId, date, time], (err1, res1) => {
        sql.query('SELECT meetings.date, meetings.time, meetings.type, professionals.name, professionals.specialties, professionals.address, professionals.city, professionals.zipcode, professionals.email FROM meetings INNER JOIN professionals ON meetings.speId = professionals.userId WHERE meetings.userId = ? AND meetings.date < ?', [userId, date], (err2, res2) => {
            if (!err1 && !err2 && res1.length || res2.length) {
                let allRes = {
                    res1,
                    res2
                };
                result(null, allRes);
                return;
            } else {
                result(null, null);
                return;
            }
        });
    });
};

// Mettre à jour les informations du patient
Pa.updateUserInfo = (userId, userInfo, result) => {
    sql.query('UPDATE clients SET email = ?, address = ?, zipcode = ?, city = ? WHERE userId = ?', [userInfo.email, userInfo.address, userInfo.zipcode, userInfo.city, userId]);
};

// Mettre à jour les informations bancaire du patient
Pa.updateCreditCard = (type, userId, updateCC, result) => {
    if (type == 0) {
        sql.query('UPDATE credit_card SET num = ?, name = ?, date = ?, ccv = ? WHERE userId = ?', [updateCC.num, updateCC.name, updateCC.date, updateCC.ccv, userId]);
    } else {
        sql.query('INSERT INTO credit_card (userId, num, name, date, ccv) VALUES (?, ?, ?, ?, ?)', [userId, updateCC.num, updateCC.name, updateCC.date, updateCC.ccv]);
    }
};

// Ajouter un enfant au patient
Pa.newUserChildren = (userId, newChildren, result) => {
    sql.query('INSERT INTO children (tutorId, firstname, lastname, gender, birthDate) VALUES (?, ?, ?, ?, ?)', [userId, newChildren.firstname, newChildren.lastname, newChildren.gender, newChildren.birthDate]);
};

// Supprimer un enfant du patient
Pa.removeUserChildren = (userId, childrenId, result) => {
    sql.query('DELETE FROM children WHERE tutorId = ? AND id = ?', [userId, childrenId]);
};

// Supprimer un rendez-vous patient
Pa.removeUserRdv = (userId, rdvId, result) => {
    sql.query('SELECT meetings.speId, meetings.date, meetings.time, clients.firstname, clients.lastname FROM meetings INNER JOIN clients ON meetings.userId = clients.userId WHERE meetings.id = ?', rdvId, (err, res) => {
        if (!err && res.length) {
            let formatName = String(res[0].firstname).charAt(0).toUpperCase() + String(res[0].firstname).substring(1) + " " + String(res[0].lastname).toUpperCase();
            const msgDate = new Date(res[0].date);
            let formatDate = ('00' + msgDate.getDate()).slice(-2) + "/" + ('00' + (msgDate.getMonth()+1)).slice(-2) + "/" + msgDate.getFullYear();
            let formatTime = String(res[0].time).substring(0, 5).replace(":", "h");

            sql.query('INSERT INTO messaging (userId, name, date, time) VALUES (?, ?, ?, ?)', [res[0].speId, formatName, formatDate, formatTime]);
            sql.query('DELETE FROM meetings WHERE userId = ? AND id = ?', [userId, rdvId]);
        }
    });
};

// Supprimer un message du patient
Pa.removeUserMsg = (userId, msgId, result) => {
    sql.query('DELETE FROM messaging WHERE userId = ? AND id = ?', [userId, msgId]);
};

module.exports = Pa;
