function modal_Close() {
    $('#valid-med').modal('hide');
}

function checkToken() {
    if (sessionStorage.getItem("token") != null) {
        $.ajax({
            url: 'http://localhost:3000/api/auth/token/' + sessionStorage.getItem("token"),
            type: 'GET',
            dataType: 'html',
            success: function (data, statut) {
                const obj = JSON.parse(data);
                if (obj.token == true) {
                    if (sessionStorage.getItem("type") == 0) {
                        checkIfUserIsAdmin();
                    } else {
                        window.location.href = '../praticien/profil.html';
                    }
                } else {
                    window.location.href = '../../auth/auth.html';
                }
            },
            error: function (result, statut, erreur) {
                console.log(erreur);
            }
        });
    } else {
        window.location.href = '../../auth/auth.html';
    }
}

function checkIfUserIsAdmin() {
    $.ajax({
        url: 'http://localhost:3000/api/admin/' + sessionStorage.getItem("token") + '/verif',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            const result = JSON.parse(data);

            if (result.admin == true) {
                getNewPr();
            } else {
                window.location.href = '../patient/profil.html';
            }
        },
        error: function (result, statut, erreur) {
            console.log(erreur);
        }
    });
}

function getNewPr() {
    $.ajax({
        url: 'http://localhost:3000/api/admin/' + sessionStorage.getItem("token") + '/new-pr',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).newPr != false) {
                $("#insert-newpr").empty();
                $.each(JSON.parse(data), function (i, obj) {
                    $("#insert-newpr").append("<p class='name-new-med' onclick='getInfoNewPr(" + obj.id + ")'>Dr. " + obj.name + "</p>");
                });
            } 
            $('#dash-content').show();
            $('#load').hide();
        },
        error: function (result, statut, erreur) {
            console.log(erreur);
        }
    });
}

function getInfoNewPr(id) {
    $.ajax({
        url: 'http://localhost:3000/api/admin/' + sessionStorage.getItem("token") + '/info-pr/' + id,
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).infoPr != false) {
                const result = JSON.parse(data);

                $('#pr-rpps').text(result[0].RPPS);
                $('#pr-name').text(result[0].name);
                $('#pr-spe').text(result[0].specialties);
                if (result[0].gender == 0) {
                    $('#pr-gender').text("Homme");
                } else {
                    $('#pr-gender').text("Femme");
                }
                $('#pr-email').text(result[0].email);
                $('#pr-address').text(result[0].address);
                $('#pr-zccity').text(result[0].zipcode + ", " + result[0].city);
                $('#pr-dep').text(result[0].department);
                $('#pr-reg').text(result[0].region);
                if (result[0].visio == 0) {
                    $('#pr-visio').text("NON");
                } else {
                    $('#pr-visio').text("OUI");
                }

                $('#valid-med').modal("show");
            }
        },
        error: function (result, statut, erreur) {
            console.log(erreur);
        }
    });
}

function confirmNewPr() {

}

function removeNewPr() {

}