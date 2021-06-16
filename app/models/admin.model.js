const algoliasearch = require('algoliasearch');
const axios = require('axios');
const sql = require("./db.js");

const client = algoliasearch('KWUHKVKTP4', '366dc991ebb3e4ecd667e89705b5ba42');
const index = client.initIndex('spe_v1');

// constructeur de la table
const Admin = function (admin) {
    this.admin = admin.req;
};

// Récupérer le userId de l'utilisateur
Admin.getUserId = (token, result) => {
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

// Vérifier si l'utilisateur est admin
Admin.getUserIsAdmin = (userId, result) => {
    sql.query('SELECT * FROM admin WHERE userId = ?', userId, (err, res) => {
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

// Récupérer la liste des nouveaux praticiens en attente
Admin.getNewPr = (result) => {
    sql.query('SELECT id, name FROM professionals WHERE status = 0', (err, res) => {
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

// Récupérer les infos d'un praticiens en attente
Admin.getInfoPr = (id, result) => {
    sql.query('SELECT email, gender, name, address, city, zipcode, department, region, specialties, RPPS, visio FROM professionals WHERE id = ?', id, (err, res) => {
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

// Récupérer l'e-mail du praticien
Admin.getPrEmail = (id, result) => {
    sql.query('SELECT email FROM professionals WHERE id = ?', id, (err, res) => {
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

// Accepter un praticien en attente
Admin.confirmPr = (id, result) => {
    sql.query('UPDATE professionals SET status = 1 WHERE id = ?', id);

    sql.query('SELECT * FROM professionals WHERE id = ?', id, (err, res) => {
        if (!err && res.length) {

            axios.get('https://geo.api.gouv.fr/departements?code=' + res[0].zipcode.substring(0, 2) + '&limit=1')
                .then(response => {
                    axios.get('https://geo.api.gouv.fr/regions?code=' + response.data[0].codeRegion + '&limit=1')
                        .then(response2 => {
                            const objects = [{
                                id: res[0].id,
                                userId: res[0].userId,
                                email: res[0].email,
                                gender: res[0].gender,
                                name: res[0].name,
                                address: res[0].address,
                                city: res[0].city,
                                zipcode: res[0].zipcode,
                                department: response.data[0].nom.toUpperCase(),
                                region: response2.data[0].nom.toUpperCase(),
                                specialties: res[0].specialties,
                                picture: res[0].picture,
                                RPPS: res[0].RPPS,
                                visio: res[0].visio,
                                tarif: res[0].tarif,
                                status: 1
                            }];

                            index.saveObjects(objects, { autoGenerateObjectIDIfNotExist: true })
                                .then(({ objectIDs }) => { });

                            sql.query('UPDATE professionals SET department = ?, region = ? WHERE id = ?', [response.data[0].nom.toUpperCase(), response2.data[0].nom.toUpperCase(), res[0].id]);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    });
};

// Supprimer un praticien en attente
Admin.removePr = (id, result) => {
    sql.query('DELETE FROM professionals WHERE id = ?', id);
};


module.exports = Admin;