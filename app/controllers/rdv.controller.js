const Rdv = require('../models/rdv.model.js');
const TokenGenerator = require('uuid-token-generator');
const { Time } = require('time-value');
const Mail = require("../models/mail.js");
const fs = require('fs');
const path = require("path");

// Renvoie l'état du service de rendez-vous
exports.info = (req, res) => {
    res.send({ message: "[UP] The rdv service works normally" });
};

// Récupérer les utilisateurs rattaché au compte
exports.paName = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            let userRdv = [];

            getPaInfo(result.content.userId, function (result2) {
                if (result2.content != false) {
                    userRdv.push(result2.content[0].firstname + ' ' + result2.content[0].lastname);

                    getPaChildren(result.content.userId, function (result3) {
                        if (result3.content != false) {
                            if (result3.content != null) {
                                for (let i = 0; i < result3.content.length; i++) {
                                    userRdv.push(result3.content[i].firstname + ' ' + result3.content[i].lastname);
                                }
                            }
                            res.send(userRdv);
                        } else {
                            res.send({ paName: false });
                        }
                    });

                } else {
                    res.send({ paName: false });
                }
            });
        } else {
            res.send({ paName: false });
        }
    });
};

// Prendre un nouveau rendez-vous
exports.new = (req, res) => {
    checkToken(req.body.token, function (result) {
        if (result.content != false) {
            getPrUserId(req.body.speId, function (result2) {
                if (result2.content != null) {
                    patientUserId = null;

                    if (req.body.patientId == "owner") {
                        patientUserId = result.content.userId;
                    } else {
                        patientUserId = req.body.patientId;
                    }

                    var format_token = null;
                    if (req.body.type == 1) {
                        const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
                        let gentoken = tokgen.generate();
                        format_token = gentoken.slice(0, 14) + "-" + gentoken.slice(14, 21);
                    }

                    const newRdv = ({
                        userId: result.content.userId,
                        speId: result2.content.userId,
                        type: req.body.type,
                        consulted: req.body.consulted,
                        reason: req.body.reason,
                        date: req.body.date,
                        time: req.body.time,
                        patientId: patientUserId,
                        room: format_token
                    });

                    Rdv.newRdv(newRdv);

                    getPaEmail(newRdv.userId, function (result3) {
                        if (result3.content != null) {
                            let mailContent = fs.readFileSync(path.resolve(__dirname, '../res/rdv-mail.html'), 'utf8');
                            mailContent = mailContent.toString().replace('{{PR}}', req.body.prName);
                            mailContent = mailContent.toString().replace('{{DATE}}', newRdv.date);
                            mailContent = mailContent.toString().replace('{{TIME}}', newRdv.time.substring(0, 5).replace(":", "h"));

                            Mail({
                                from: 'Medyco <contact@medyco.fr>',
                                to: result3.content[0].email,
                                subject: 'Confirmation de rendez-vous | Medyco.fr',
                                html: mailContent
                            });
                        }
                    });

                    res.send({ rdv: true });

                } else {
                    res.send({ rdv: false });
                }
            });
        } else {
            res.send({ rdv: false });
        }
    });
};

// Récupérer informations sur praticien
exports.prInfo = (req, res) => {
    Rdv.getPrInfo(req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({ info: null });
            console.log("error: ", err);
        } else {
            res.send(data);
        }
    });
};

// Récupérer les créneaux disponibles à une date
exports.prSlots = (req, res) => {
    getPrUserId(req.params.id, function (result) {
        if (result.content != null) {
            getSchedulesDay(result.content.userId, dateConvert(req.params.date), function (result2) {
                if (result2.content == 1) {
                    getVacationsDay(result.content.userId, req.params.date, function (result3) {
                        if (result3.content == false) {
                            getSchedulesInfo(result.content.userId, dateConvert(req.params.date), function (result4) {
                                if (result4.content != false) {
                                    getSlotsReserved(result.content.userId, req.params.date, function (result5) {
                                        const slots = generateRdvSlots(result4.content[dateConvert(req.params.date) + 'AM'], result4.content[dateConvert(req.params.date) + 'PM'], result4.content['meetingTime']);

                                        if (result5.content == false) {
                                            res.send(slots);
                                        } else {
                                            let nextReservedSlot;
                                            let formatSlot;

                                            for (let i = 0; i < slots.length; i++) {
                                                for (let j = 0; j < result5.content.length; j++) {
                                                    nextReservedSlot = Time.parse(result5.content[j].time);
                                                    formatSlot = nextReservedSlot['_hours'] + 'h' + nextReservedSlot['_minutes'];

                                                    if (slots[i] == formatSlot) {
                                                        slots.splice(i, 1);
                                                    }
                                                }
                                            }
                                            res.send(slots);
                                        }
                                    });
                                } else {
                                    res.send({ rdvSlots: false });
                                }
                            });
                        } else {
                            res.send({ rdvSlots: false });
                        }
                    });
                } else {
                    res.send({ rdvSlots: false });
                }
            });
        } else {
            res.send({ rdvSlots: false });
        }
    });
};

// Récupérer le nom d'un utilisateur en visio
exports.displayName = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Rdv.getDisplayName(result.content.userId, req.params.type, (err, data) => {
                if (err) {
                    res.status(500).send({ displayName: false });
                    console.log("error: ", err);
                } else {
                    res.send(data);
                }
            });
        } else {
            res.send({ displayName: false });
        }
    });
};

// Vérifier le token utilisateur
function checkToken(token, callback) {
    Rdv.getUserId(token, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res.userId });
        }
    });
}

// Récupérer les informations du patient
function getPaInfo(userId, callback) {
    Rdv.getPaInfo(userId, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res });
        }
    });
}

// Récupérer les enfants rattachés au patient
function getPaChildren(tutorId, callback) {
    Rdv.getPaChildren(tutorId, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res });
        }
    });
}

// Récupérer le userId du praticien
function getPrUserId(id, callback) {
    Rdv.getPrUserId(id, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res });
        }
    });
}

// Vérifier si un jour est un jour de travail
function getSchedulesDay(userId, day, callback) {
    Rdv.getSchedulesDay(userId, day, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res });
        }
    });
}

// Vérifier si un jour est un jour de vacances
function getVacationsDay(userId, date, callback) {
    Rdv.getVacationsDay(userId, date, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res });
        }
    });
}

// Récupérer la tranche horaire d'un jour de travail
function getSchedulesInfo(userId, day, callback) {
    Rdv.getSchedulesInfo(userId, day, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res });
        }
    });
}

// Récupérer les rendez-vous existant du PR à une date
function getSlotsReserved(userId, date, callback) {
    Rdv.getSlotsReserved(userId, date, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res });
        }
    });
}

// Récupérer l'e-mail du patient
function getPaEmail(userId, callback) {
    Rdv.getPaEmail(userId, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res });
        }
    });
}

// Calcul des créneaux de rendez-vous
function generateRdvSlots(timeStart, timeEnd, interval) {
    let loop = true;
    let rdvSlots = [];

    const end = Time.parse(timeEnd);
    const inter = Time.parse(interval);

    let start = Time.parse(timeStart);
    let nextTime = start.add(inter);

    while (loop) {
        if (nextTime <= end) {
            rdvSlots.push(start['_hours'] + 'h' + start['_minutes']);
            start = start.add(inter);
            nextTime = nextTime.add(inter);
        } else {
            loop = false;
        }
    }

    return rdvSlots;
}

// Convertir les jours au format anglais (String)
function dateConvert(date) {
    let formatDate = new Date(date);

    switch (formatDate.getDay()) {
        case 0:
            return "sunday";
        case 1:
            return "monday";
        case 2:
            return "tuesday";
        case 3:
            return "wednesday";
        case 4:
            return "thursday";
        case 5:
            return "friday";
        case 6:
            return "saturday";
        default:
            return "Error";
    }
}