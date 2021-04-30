var refDate = null;

function initDate() {
    refDate = new Date();
    displayDate();
    getPrInfo();
    getPaChildrenInfo();
}

function changeDate(type) {
    const ref = new Date();
    if (type == 0) {
        if (!(refDate.getDate() == ref.getDate() && refDate.getMonth() == ref.getMonth())) {
            refDate.setDate(refDate.getDate() - 6);
        }
    } else {
        refDate.setDate(refDate.getDate() + 6);
    }
    displayDate();
}

function displayDate() {
    let nextDay = new Date(refDate);

    $('#rdv-day1').text(getDayName(refDate.getDay()));
    $('#rdv-date-day1').text(refDate.getDate() + " " + getMonthName(refDate.getMonth()));

    nextDay.setDate(refDate.getDate() + 1);
    $('#rdv-day2').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day2').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));

    nextDay.setDate(nextDay.getDate() + 1);
    $('#rdv-day3').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day3').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));

    nextDay.setDate(nextDay.getDate() + 1);
    $('#rdv-day4').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day4').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));

    nextDay.setDate(nextDay.getDate() + 1);
    $('#rdv-day5').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day5').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));

    nextDay.setDate(nextDay.getDate() + 1);
    $('#rdv-day6').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day6').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));
}

$("#regular-yes").on("click", function () {
    $("#regular-yes").removeClass("btn-outline-secondary");
    $("#regular-yes").addClass("btn-primary");
    $("#regular-no").removeClass("btn-primary");
    $("#regular-no").addClass("btn-outline-secondary");
});

$("#regular-no").on("click", function () {
    $("#regular-no").removeClass("btn-outline-secondary");
    $("#regular-no").addClass("btn-primary");
    $("#regular-yes").removeClass("btn-primary");
    $("#regular-yes").addClass("btn-outline-secondary");
});

function getPrInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    $.ajax({
        url: 'http://localhost:3000/api/rdv/pr/' + urlParams.get('id') + '/info',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            const result = JSON.parse(data);
            $("#pr-info-name").text(result[0].name);
            $("#pr-info-spe").text(result[0].specialties);
            $("#pr-info-addr").text(result[0].address);
            $("#pr-info-city").text(result[0].zipcode + ' ' + result[0].city);
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function getPaChildrenInfo() {
    $.ajax({
        url: 'http://localhost:3000/api/rdv/pa/' + sessionStorage.getItem('token') + '/name',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            const result = JSON.parse(data);

            if (result.paName != false) {
                for (let i = 0; i < result.length; i++) {
                    if (i == 0) {
                        $("#pa-children").append("<option value='" + result[i] + "' selected>" + result[i] + "</option>");
                    } else {
                        $("#pa-children").append("<option value='" + result[i] + "'>" + result[i] + "</option>");
                    }
                }
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function getDayName(day) {
    switch (day) {
        case 0:
            return "Dimanche";
        case 1:
            return "Lundi";
        case 2:
            return "Mardi";
        case 3:
            return "Mercredi";
        case 4:
            return "Jeudi";
        case 5:
            return "Vendredi";
        case 6:
            return "Samedi";
        default:
            return "Error";
    }
}

function getMonthName(month) {
    switch (month) {
        case 0:
            return "Janvier";
        case 1:
            return "Février";
        case 2:
            return "Mars";
        case 3:
            return "Avril";
        case 4:
            return "Mai";
        case 5:
            return "Juin";
        case 6:
            return "Juillet";
        case 7:
            return "Août";
        case 8:
            return "Septembre";
        case 9:
            return "Octobre";
        case 10:
            return "Novembre";
        case 11:
            return "Décembre";
        default:
            return "Error";
    }
}