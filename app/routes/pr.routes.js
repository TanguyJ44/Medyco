module.exports = app => {
    const pr = require("../controllers/pr.controller.js");

    // Vérifier l'état du service praticien
    app.get("/api/pr", pr.info);

    // Récupérer les informations du praticien
    app.get("/api/pr/:token/info", pr.userInfo);

    // Récupérer les heures de travail
    app.get("/api/pr/:token/work-time", pr.workTime);

    // Récupérer les jours de repos
    app.get("/api/pr/:token/vacations-days", pr.vacationsDays);

    // Récupérer l'historique des rendez-vous de la journée
    app.get("/api/pr/:token/today-rdv", pr.todayRdv);

    // Récupérer la liste des patients du praticien
    app.get("/api/pr/:token/pa-list", pr.paList);

    // Récupérer les informations d'un patient du praticien
    app.get("/api/pr/:token/pa-info/:id", pr.paInfo);

    // Récupérer l'historique des rendez-vous d'un patient
    app.get("/api/pr/:token/pa-rdv/:id", pr.paRdv);

    // Récupérer les messages du praticien
    app.get("/api/pr/:token/msg", pr.msg);

    // Récupérer la liste des créneaux de rdv du praticien à une date
    app.get("/api/pr/:token/rdv-slot/:date", pr.rdvSlot);

    // Récupérer les informations d'un rendez-vous praticien
    app.get("/api/pr/:token/rdv-info/:id", pr.rdvInfo);

    // Ajouter un jour de repos
    app.post("/api/pr/add/vacation-day", pr.addVacation);

    // Mettre à jour les informations du praticien
    app.put("/api/pr/update/info", pr.updateInfo);

    // Mettre à jour les heures de travail
    app.put("/api/pr/update/work-time", pr.updateWorkTime);

    // Supprimer un jour de repos
    app.delete("/api/pr/:token/remove/vacation/:id", pr.removeVacation);

    // Supprimer un rendez-vous praticien
    app.delete("/api/pr/:token/remove/rdv/:id", pr.removeRdv);

    // Supprimer un message du praticien
    app.delete("/api/pr/:token/remove/msg/:id", pr.removeMsg);
};