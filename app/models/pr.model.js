const sql = require("./db.js");

// constructeur de la table
const Pr = function (pr) {
    this.pr = pr.req;
};

// Récupérer le userId de l'utilisateur
Pr.getUserId = (token, result) => {
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

// Récupérer les informations du praticien
Pr.getUserInfo = (userId, result) => {
    sql.query('SELECT email, gender, name, address, city, zipcode, specialties, visio, RPPS FROM professionals WHERE userId = ?', userId, (err, res) => {
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

// Récupérer les heures de travail
Pr.getWorkTime = (userId, result) => {
    sql.query('SELECT mondayAM, mondayPM, tuesdayAM, tuesdayPM, wednesdayAM, wednesdayPM, thursdayAM, thursdayPM, fridayAM, fridayPM, saturdayAM, saturdayPM, sundayAM, sundayPM, meetingTime FROM schedules WHERE userId = ?', userId, (err, res) => {
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

// Récupérer les jours de repos
Pr.getVacationsDays = (userId, result) => {
    let today = new Date();

    today = today.getFullYear() + '-' +
        ('00' + (today.getMonth() + 1)).slice(-2) + '-' +
        ('00' + today.getDate()).slice(-2);
    sql.query('SELECT id, date FROM vacations WHERE date >= ? AND userId = ?', [today, userId], (err, res) => {
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

// Récupérer la liste des patients du praticien
Pr.getPaList = (userId, result) => {
    sql.query('SELECT DISTINCT clients.id, clients.firstname, clients.lastname FROM meetings INNER JOIN clients ON meetings.userId = clients.userId WHERE meetings.speId = ?', userId, (err, res) => {
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

// Récupérer les informations d'un patient du praticien
Pr.getPaInfo = (id, result) => {
    sql.query('SELECT firstname, lastname, birthDate, gender, email FROM clients WHERE id = ?', id, (err, res) => {
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

// Récupérer l'historique des rendez-vous d'un patient
Pr.getPaRdv = (userId, id, result) => {
    sql.query('SELECT meetings.date, meetings.time, meetings.type FROM meetings INNER JOIN clients ON meetings.userId = clients.userId WHERE meetings.speId = ? AND clients.id = ?', [userId, id], (err, res) => {
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

// Récupérer l'historique des rendez-vous de la journée
Pr.getTodayRdv = (userId, result) => {
    let date = new Date();

    date = date.getFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2);

    sql.query('SELECT meetings.date, meetings.time, clients.firstname, clients.lastname FROM meetings INNER JOIN clients ON meetings.userId = clients.userId WHERE meetings.speId = ? AND meetings.date = ?', [userId, date], (err, res) => {
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

// Récupérer les messages du praticien
Pr.getUserMsg = (userId, result) => {
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

// Récupérer la liste des créneaux de rdv du praticien à une date
Pr.getRdvSlot = (userId, date, result) => {
    sql.query('SELECT id, time, type FROM meetings WHERE speId = ? AND date = ?', [userId, date], (err, res) => {
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

// Récupérer les informations d'un rendez-vous praticien
Pr.getRdvInfo = (userId, rdvId, result) => {
    sql.query('SELECT meetings.date, meetings.time, meetings.type, meetings.consulted, meetings.reason, meetings.patientId, meetings.room, clients.firstname, clients.lastname FROM meetings INNER JOIN clients ON meetings.userId = clients.userId WHERE meetings.id = ?', rdvId, (err, res) => {
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

// Ajouter un jour de repos
Pr.addVacation = (userId, date, result) => {
    sql.query('SELECT date FROM vacations WHERE date = ? AND userId = ?', [date, userId], (err, res) => {
        if (!err && !res.length) {
            sql.query('INSERT INTO vacations (userId, date) VALUES (?, ?)', [userId, date]);
        }
    });
};

// Mettre à jour les informations du praticien
Pr.updateUserInfo = (userId, userInfo, result) => {
    sql.query('UPDATE professionals SET specialties = ?, email = ?, address = ?, zipcode = ?, city = ?, visio = ? WHERE userId = ?', [userInfo.spe.toUpperCase(), userInfo.email, userInfo.address.toUpperCase(), userInfo.zipcode, userInfo.city.toUpperCase(), userInfo.visio, userId]);
};

// Mettre à jour les heures de travail
Pr.updateWorkTime = (userId, userWorkTime, result) => {
    if (userWorkTime.newData == 'true') {
        sql.query('INSERT INTO schedules (userId, monday, tuesday, wednesday, thursday, friday, saturday, sunday, mondayAM, mondayPM, tuesdayAM, tuesdayPM, wednesdayAM, wednesdayPM, thursdayAM, thursdayPM, fridayAM, fridayPM, saturdayAM, saturdayPM, sundayAM, sundayPM, meetingTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [userId, userWorkTime.monday, userWorkTime.tuesday, userWorkTime.wednesday, userWorkTime.thursday, userWorkTime.friday, userWorkTime.saturday, userWorkTime.sunday, userWorkTime.mondayAM, userWorkTime.mondayPM, userWorkTime.tuesdayAM, userWorkTime.tuesdayPM, userWorkTime.wednesdayAM, userWorkTime.wednesdayPM, userWorkTime.thursdayAM, userWorkTime.thursdayPM, userWorkTime.fridayAM, userWorkTime.fridayPM, userWorkTime.saturdayAM, userWorkTime.saturdayPM, userWorkTime.sundayAM, userWorkTime.sundayPM, userWorkTime.workTime]);
    } else {
        sql.query('UPDATE schedules SET monday = ?, tuesday = ?, wednesday = ?, thursday = ?, friday = ?, saturday = ?, sunday = ?, mondayAM = ?, mondayPM = ?, tuesdayAM = ?, tuesdayPM = ?, wednesdayAM = ?, wednesdayPM = ?, thursdayAM = ?, thursdayPM = ?, fridayAM = ?, fridayPM = ?, saturdayAM = ?, saturdayPM = ?, sundayAM = ?, sundayPM = ?, meetingTime = ? WHERE userId = ?', [userWorkTime.monday, userWorkTime.tuesday, userWorkTime.wednesday, userWorkTime.thursday, userWorkTime.friday, userWorkTime.saturday, userWorkTime.sunday, userWorkTime.mondayAM, userWorkTime.mondayPM, userWorkTime.tuesdayAM, userWorkTime.tuesdayPM, userWorkTime.wednesdayAM, userWorkTime.wednesdayPM, userWorkTime.thursdayAM, userWorkTime.thursdayPM, userWorkTime.fridayAM, userWorkTime.fridayPM, userWorkTime.saturdayAM, userWorkTime.saturdayPM, userWorkTime.sundayAM, userWorkTime.sundayPM, userWorkTime.workTime, userId]);
    }
};

// Supprimer un jour de repos
Pr.removeVacation = (userId, id, result) => {
    sql.query('DELETE FROM vacations WHERE userId = ? AND id = ?', [userId, id]);
};

// Supprimer un rendez-vous praticien
Pr.removeRdv = (userId, rdvId, result) => {
    sql.query('SELECT meetings.userId, meetings.date, meetings.time, professionals.name FROM meetings INNER JOIN professionals ON meetings.speId = professionals.userId WHERE meetings.id = ?', rdvId, (err, res) => {
        if (!err && res.length) {
            let formatName = String(res[0].name).toUpperCase();
            const msgDate = new Date(res[0].date);
            let formatDate = ('00' + msgDate.getDate()).slice(-2) + "/" + ('00' + (msgDate.getMonth()+1)).slice(-2) + "/" + msgDate.getFullYear();
            let formatTime = String(res[0].time).substring(0, 5).replace(":", "h");

            sql.query('INSERT INTO messaging (userId, name, date, time) VALUES (?, ?, ?, ?)', [res[0].userId, formatName, formatDate, formatTime]);
            sql.query('DELETE FROM meetings WHERE speId = ? AND id = ?', [userId, rdvId]);
        }
    });
};

// Supprimer un message du praticien
Pr.removeUserMsg = (userId, msgId, result) => {
    sql.query('DELETE FROM messaging WHERE userId = ? AND id = ?', [userId, msgId]);
};

module.exports = Pr;
