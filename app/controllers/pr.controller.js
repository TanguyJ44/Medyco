const algoliasearch = require('algoliasearch');
const Pr = require('../models/pr.model.js');

const client = algoliasearch('KWUHKVKTP4', '366dc991ebb3e4ecd667e89705b5ba42');
const index = client.initIndex('spe_v1');

// Vérifier l'état du service praticien
exports.info = (req, res) => {
    res.send({ message: "[UP] The praticien service works normally" });
};

// Récupérer les informations du praticien
exports.userInfo = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.getUserInfo(result.content.userId, (err, data) => {
                if (err) {
                    res.status(500).send({ userInfo: false });
                    console.log("error: ", err);
                } else {
                    if (data == null) {
                        res.send({ userInfo: false });
                    } else {
                        res.send(data);
                    }
                }
            });
        } else {
            res.send({ userInfo: false });
        }
    });
};

// Récupérer les heures de travail
exports.workTime = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.getWorkTime(result.content.userId, (err, data) => {
                if (err) {
                    res.status(500).send({ workTime: false });
                    console.log("error: ", err);
                } else {
                    if (data == null) {
                        res.send({ workTime: false });
                    } else {
                        res.send(data);
                    }
                }
            });
        } else {
            res.send({ workTime: false });
        }
    });
};

// Récupérer les jours de repos
exports.vacationsDays = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.getVacationsDays(result.content.userId, (err, data) => {
                if (err) {
                    res.status(500).send({ vacationsDays: false });
                    console.log("error: ", err);
                } else {
                    if (data == null) {
                        res.send({ vacationsDays: false });
                    } else {
                        res.send(data);
                    }
                }
            });
        } else {
            res.send({ vacationsDays: false });
        }
    });
};

// Récupérer l'historique des rendez-vous de la journée
exports.todayRdv = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.getTodayRdv(result.content.userId, (err, data) => {
                if (err) {
                    res.status(500).send({ todayRdv: false });
                    console.log("error: ", err);
                } else {
                    if (data == null) {
                        res.send({ todayRdv: false });
                    } else {
                        res.send(data);
                    }
                }
            });
        } else {
            res.send({ todayRdv: false });
        }
    });
};

// Récupérer la liste des patients du praticien
exports.paList = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.getPaList(result.content.userId, (err, data) => {
                if (err) {
                    res.status(500).send({ paList: false });
                    console.log("error: ", err);
                } else {
                    if (data == null) {
                        res.send({ paList: false });
                    } else {
                        res.send(data);
                    }
                }
            });
        } else {
            res.send({ paList: false });
        }
    });
};

// Récupérer les informations d'un patient du praticien
exports.paInfo = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.getPaInfo(req.params.id, (err, data) => {
                if (err) {
                    res.status(500).send({ paInfo: false });
                    console.log("error: ", err);
                } else {
                    if (data == null) {
                        res.send({ paInfo: false });
                    } else {
                        res.send(data);
                    }
                }
            });
        } else {
            res.send({ paInfo: false });
        }
    });
};

// Récupérer l'historique des rendez-vous d'un patient
exports.paRdv = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.getPaRdv(result.content.userId, req.params.id, (err, data) => {
                if (err) {
                    res.status(500).send({ paRdv: false });
                    console.log("error: ", err);
                } else {
                    if (data == null) {
                        res.send({ paRdv: false });
                    } else {
                        res.send(data);
                    }
                }
            });
        } else {
            res.send({ paRdv: false });
        }
    });
};

// Récupérer les messages du praticien
exports.msg = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.getUserMsg(result.content.userId, (err, data) => {
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

// Récupérer la liste des créneaux de rdv du praticien à une date
exports.rdvSlot = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.getRdvSlot(result.content.userId, req.params.date, (err, data) => {
                if (err) {
                    res.status(500).send({ rdvSlot: false });
                    console.log("error: ", err);
                } else {
                    if (data == null) {
                        res.send({ rdvSlot: false });
                    } else {
                        res.send(data);
                    }
                }
            });
        } else {
            res.send({ rdvSlot: false });
        }
    });
};

// Récupérer les informations d'un rendez-vous praticien
exports.rdvInfo = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.getRdvInfo(result.content.userId, req.params.id, (err, data) => {
                if (err) {
                    res.status(500).send({ rdvInfo: false });
                    console.log("error: ", err);
                } else {
                    if (data == null) {
                        res.send({ rdvInfo: false });
                    } else {
                        res.send(data);
                    }
                }
            });
        } else {
            res.send({ rdvInfo: false });
        }
    });
};

// Ajouter un jour de repos
exports.addVacation = (req, res) => {
    checkToken(req.body.token, function (result) {
        if (result.content != false) {
            Pr.addVacation(result.content.userId, req.body.date);

            res.send({ addVacation: true });
        } else {
            res.send({ addVacation: false });
        }
    });
};

// Mettre à jour les informations du praticien
exports.updateInfo = (req, res) => {
    checkToken(req.body.token, function (result) {
        if (result.content != false) {
            const userInfo = ({
                spe: req.body.spe,
                email: req.body.email,
                address: req.body.address,
                zipcode: req.body.zipcode,
                city: req.body.city,
                visio: req.body.visio
            });

            Pr.updateUserInfo(result.content.userId, userInfo);

            index.search(result.content.userId, {
                restrictSearchableAttributes: 'userId'
            }).then(({ hits }) => {
                index.partialUpdateObject({
                    specialties: req.body.spe.toUpperCase(),
                    email: req.body.email,
                    address: req.body.address.toUpperCase(),
                    zipcode: req.body.zipcode,
                    city: req.body.city.toUpperCase(),
                    visio: req.body.visio,
                    objectID: hits[0].objectID
                }).then(({ objectID }) => { });
            });

            res.send({ updateInfo: true });
        } else {
            res.send({ updateInfo: false });
        }
    });
};

// Mettre à jour les heures de travail
exports.updateWorkTime = (req, res) => {
    checkToken(req.body.token, function (result) {
        if (result.content != false) {
            const userWorkTime = ({
                newData: req.body.newData,
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 0,
                sunday: 0,
                mondayAM: req.body.mondayAM,
                mondayPM: req.body.mondayPM,
                tuesdayAM: req.body.tuesdayAM,
                tuesdayPM: req.body.tuesdayPM,
                wednesdayAM: req.body.wednesdayAM,
                wednesdayPM: req.body.wednesdayPM,
                thursdayAM: req.body.thursdayAM,
                thursdayPM: req.body.thursdayPM,
                fridayAM: req.body.fridayAM,
                fridayPM: req.body.fridayPM,
                saturdayAM: req.body.saturdayAM,
                saturdayPM: req.body.saturdayPM,
                sundayAM: req.body.sundayAM,
                sundayPM: req.body.sundayPM,
                workTime: '00:' + req.body.workTime + ':00'
            });

            if (userWorkTime.mondayAM != userWorkTime.mondayPM) {
                userWorkTime.monday = 1;
            }
            if (userWorkTime.tuesdayAM != userWorkTime.tuesdayPM) {
                userWorkTime.tuesday = 1;
            }
            if (userWorkTime.wednesdayAM != userWorkTime.wednesdayPM) {
                userWorkTime.wednesday = 1;
            }
            if (userWorkTime.thursdayAM != userWorkTime.thursdayPM) {
                userWorkTime.thursday = 1;
            }
            if (userWorkTime.fridayAM != userWorkTime.fridayPM) {
                userWorkTime.friday = 1;
            }
            if (userWorkTime.saturdayAM != userWorkTime.saturdayPM) {
                userWorkTime.saturday = 1;
            }
            if (userWorkTime.sundayAM != userWorkTime.sundayPM) {
                userWorkTime.sunday = 1;
            }

            Pr.updateWorkTime(result.content.userId, userWorkTime);

            res.send({ updateWorkTime: true });
        } else {
            res.send({ updateWorkTime: false });
        }
    });
};

// Supprimer un jour de repos
exports.removeVacation = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.removeVacation(result.content.userId, req.params.id);

            res.send({ removeVacation: true });
        } else {
            res.send({ removeVacation: false });
        }
    });
};

// Supprimer un rendez-vous praticien
exports.removeRdv = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.removeRdv(result.content.userId, req.params.id);

            res.send({ removeRdv: true });
        } else {
            res.send({ removeRdv: false });
        }
    });
};

// Supprimer un message du praticien
exports.removeMsg = (req, res) => {
    checkToken(req.params.token, function (result) {
        if (result.content != false) {
            Pr.removeUserMsg(result.content.userId, req.params.id);

            res.send({ removeMsg: true });
        } else {
            res.send({ removeMsg: false });
        }
    });
};

// Vérifier le token utilisateur
function checkToken(token, callback) {
    Pr.getUserId(token, (err, res) => {
        if (!!err) {
            callback({ error: true });
        } else {
            callback({ error: false, content: res.userId });
        }
    });
}