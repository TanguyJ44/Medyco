function modal() {
    $('#fenetre_message').modal('show');
}

function modal_Close() {
    $('#fenetre_message').modal('hide');
}

function childOpen() {
    $('#child-modal').modal('show');
}

function childClose() {
    $('#child-modal').modal('hide');
}

function checkToken(page) {
    if (sessionStorage.getItem("token") != null) {
        $.ajax({
            url: 'http://localhost:3000/api/auth/token/' + sessionStorage.getItem("token"),
            type: 'GET',
            dataType: 'html',
            success: function (data, statut) {
                const obj = JSON.parse(data);
                if (obj.token == true) {
                    if (sessionStorage.getItem("type") == 0) {
                        loadData(page);
                    } else {
                        window.location.href = '../dashboard/praticien/profil.html';
                    }
                } else {
                    window.location.href = '../../auth/auth.html';
                }
            },
            error: function (result, statut, erreur) {
                sendError("Une erreur s'est produite, veuillez réessayer");
                $("#li-submit").prop("disabled", false);
            }
        });
    } else {
        window.location.href = '../../auth/auth.html';
    }
}

function loadData(page) {
    switch (page) {
        case 1: // profil
            getUserInfo();
            getUserCreditCard();
            break;
        case 2: // childrens
            getUserChildren();
            break;
        case 3: // rdv
            break;
        case 4: // fav
            getFavPr();
            break;
        case 5: // msg
            break;
        case 6: // covid
            break;
        default:
            break;
    }

    $('#dash-content').show();
    $('#load').hide();
}

function userInfo() {
    if ($("#update-user-info").text().indexOf("Modifier") != -1) {
        $("#user-email").prop("disabled", false);
        $("#user-email").css("border", "1px solid");
        $("#user-address").prop("disabled", false);
        $("#user-address").css("border", "1px solid");
        $("#user-zipcode").prop("disabled", false);
        $("#user-zipcode").css("border", "1px solid");
        $("#user-city").prop("disabled", false);
        $("#user-city").css("border", "1px solid");
        $("#update-user-info").text("Valider");
    } else {
        $("#user-email").prop("disabled", true);
        $("#user-email").css("border", "none");
        $("#user-address").prop("disabled", true);
        $("#user-address").css("border", "none");
        $("#user-zipcode").prop("disabled", true);
        $("#user-zipcode").css("border", "none");
        $("#user-city").prop("disabled", true);
        $("#user-city").css("border", "none");
        $("#update-user-info").text("Modifier");
        updateUserInfo();
    }
}

function viewCardDetails() {
    if ($("#eye-card").attr('class').indexOf("bi-eye-slash") != -1) {
        $("#eye-card").addClass("bi-eye");
        $("#eye-card").removeClass("bi-eye-slash");
        $("#iban-2").val("");
        $("#iban-3").val("");
    } else {
        $("#eye-card").addClass("bi-eye-slash");
        $("#eye-card").removeClass("bi-eye");
        if (numCard != null) {
            const hideNumCard = numCard.split('-');
            $("#iban-2").val(hideNumCard[1]);
            $("#iban-3").val(hideNumCard[2]);
        }
    }

}

function updateCardDetails() {
    if ($("#edit-card").attr('class').indexOf("bi-pencil") != -1) {
        $("#edit-card").addClass("bi-check2-circle");
        $("#edit-card").removeClass("bi-pencil");
        $("#eye-card").attr('onclick', '');
        $("#iban-1").prop("disabled", false);
        $("#iban-2").prop("disabled", false);
        $("#iban-3").prop("disabled", false);
        $("#iban-4").prop("disabled", false);
        $("#cc-name").prop("disabled", false);
        $("#cc-date").prop("disabled", false);
        $("#cc-ccv").prop("disabled", false);
        $("#eye-card").addClass("bi-eye");
        $("#eye-card").removeClass("bi-eye-slash");
        $("#iban-1, #iban-2, #iban-3, #iban-4, .name").css({ "border": "1px solid #fff" });
        if (numCard != null) {
            const hideNumCard = numCard.split('-');
            $("#iban-2").val(hideNumCard[1]);
            $("#iban-3").val(hideNumCard[2]);
        }
    } else {
        $("#edit-card").addClass("bi-pencil");
        $("#edit-card").removeClass("bi-check2-circle");
        $("#eye-card").attr('onclick', 'viewCardDetails()');
        $("#iban-1").prop("disabled", true);
        $("#iban-2").prop("disabled", true);
        $("#iban-3").prop("disabled", true);
        $("#iban-4").prop("disabled", true);
        $("#cc-name").prop("disabled", true);
        $("#cc-date").prop("disabled", true);
        $("#cc-ccv").prop("disabled", true);
        $("#iban-1, #iban-2, #iban-3, #iban-4, .name").css({ "border": "none" });
        updateUserCreditCard();
    }
}

function getUserInfo() {
    $.ajax({
        url: 'http://localhost:3000/api/pa/' + sessionStorage.getItem('token') + '/info',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).userInfo == null) {
                const result = JSON.parse(data);

                $("#user-picture").attr("src", result.gender == 0 ? "../assets/man.png" : "../assets/woman.png");
                $("#user-name").text(result.firstname.charAt(0).toUpperCase() + result.firstname.substring(1) + " " + result.lastname.toUpperCase());
                $("#user-birthDate").text(formatDate(result.birthDate));
                $("#user-gender").text(result.gender == 0 ? "Homme" : "Femme");
                $("#user-email").val(result.email);
                $("#user-address").val(result.address);
                $("#user-zipcode").val(result.zipcode);
                $("#user-city").val(result.city);
            } else {
                logout();
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function updateUserInfo() {
    if ($("#user-email").val().length > 1 && $("#user-address").val().length > 1 && $("#user-zipcode").val().length == 5 && $("#user-city").val().length > 1) {
        if ($("#user-email").val().match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)) {
            $("#update-user-info").prop("disabled", true);
            $.ajax({
                url: 'http://localhost:3000/api/pa/update/info',
                data: {
                    token: sessionStorage.getItem('token'),
                    email: $("#user-email").val(),
                    address: $("#user-address").val(),
                    zipcode: $("#user-zipcode").val(),
                    city: $("#user-city").val()
                },
                type: 'PUT',
                dataType: 'html',
                success: function (data, statut) {
                    if (JSON.parse(data).updateInfo == true) {
                        $("#update-user-info").prop("disabled", false);
                        getUserInfo();
                    } else {
                        document.location.reload();
                    }
                },
                error: function (result, statut, erreur) {
                    console.log("Error !");
                }
            });
        } else {
            document.location.reload();
        }
    } else {
        document.location.reload();
    }
}

function formatDate(reqDate) {
    const date = new Date(reqDate);
    let df1 = date.getDate();
    let df2 = date.getMonth();

    if (df1 < 10) {
        df1 = "0" + df1;
    }

    df2 += 1;
    if (df2 < 10) {
        df2 = "0" + df2;
    }

    return df1 + "/" + df2 + "/" + date.getFullYear();
}

var numCard = null;

function getUserCreditCard() {
    $.ajax({
        url: 'http://localhost:3000/api/pa/' + sessionStorage.getItem('token') + '/credit-card',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).creditCard == null) {
                const result = JSON.parse(data);

                numCard = result.num;
                const hideNumCard = numCard.split('-');

                $("#iban-1").val(hideNumCard[0]);
                $("#iban-2").val("");
                $("#iban-3").val("");
                $("#iban-4").val(hideNumCard[3]);
                $("#cc-name").val(result.name);
                $("#cc-date").val(result.date);
                $("#cc-ccv").val(result.ccv);
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function updateUserCreditCard() {
    if ($("#iban-1").val().length == 4 && $("#iban-2").val().length == 4 && $("#iban-3").val().length == 4 && $("#iban-4").val().length == 4) {
        if ($("#cc-name").val().length > 1 && $("#cc-ccv").val().length == 3 && $("#cc-date").val().length == 5 && $("#cc-date").val().charAt(2) == "/") {
            $("#edit-card").attr('onclick', '');
            $.ajax({
                url: 'http://localhost:3000/api/pa/update/credit-card',
                data: {
                    token: sessionStorage.getItem('token'),
                    num: $("#iban-1").val() + "-" + $("#iban-2").val() + "-" + $("#iban-3").val() + "-" + $("#iban-4").val(),
                    name: $("#cc-name").val(),
                    date: $("#cc-date").val(),
                    ccv: $("#cc-ccv").val()
                },
                type: 'PUT',
                dataType: 'html',
                success: function (data, statut) {
                    if (JSON.parse(data).updateCreditCard == true) {
                        $("#edit-card").attr('onclick', 'updateCardDetails()');
                        getUserCreditCard();
                    } else {
                        document.location.reload();
                    }
                },
                error: function (result, statut, erreur) {
                    console.log("Error !");
                }
            });
        } else {
            document.location.reload();
        }
    } else {
        document.location.reload();
    }
}

function getUserChildren() {
    $.ajax({
        url: 'http://localhost:3000/api/pa/' + sessionStorage.getItem('token') + '/children',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (data.length > 1) {
                if (JSON.parse(data).children == null) {
                    $(".child-insert").empty();
                    $.each(JSON.parse(data), function (i, obj) {
                        const childGender = obj.gender == 0 ? "Garçon" : "Fille";
                        $(".child-insert").append("<div class='card float-right'><div class='row'><div class='col-sm-3'><img class='d-block' id='img-child' src='../assets/children.png' width='170'></div><div class='col-sm-4'><div class='card-block'><h2 class='infos-users'>" + obj.firstname.charAt(0).toUpperCase() + obj.firstname.substring(1) + " " + obj.lastname.toUpperCase() + "</h2><h4 class='infos-users'>" + formatDate(obj.birthDate) + "</h4><h4 class='infos-users'>" + childGender + "</h4></div></div><div class='col-sm-1'><button class='btn btn-sm float-left pos-btn' id='removeChild-" + obj.id + "' onclick='removeUserChildren(" + obj.id + ")'>Supprimer <i class='bi bi-trash'></i></button></div></div></div>");
                    });
                }
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function addUserChildren() {
    if ($("#child-firstname").val().length > 0 && $("#child-lastname").val().length > 0 && $("#child-birthDate").val().length > 0) {
        $("#addChild").prop("disabled", true);
        $.ajax({
            url: 'http://localhost:3000/api/pa/add/children',
            data: {
                token: sessionStorage.getItem('token'),
                firstname: $("#child-firstname").val(),
                lastname: $("#child-lastname").val(),
                gender: $("#child-gender").val(),
                birthDate: $("#child-birthDate").val()
            },
            type: 'POST',
            dataType: 'html',
            success: function (data, statut) {
                $('#child-modal').modal('hide');
                getUserChildren();
                $("#addChild").prop("disabled", false);
                $("#child-firstname").val("");
                $("#child-lastname").val("");
                $("#child-gender").val(0);
                $("#child-birthDate").val("");
            },
            error: function (result, statut, erreur) {
                console.log("Error !");
            }
        });
    }
}

function removeUserChildren(id) {
    $("#removeChild-" + id).prop("disabled", true);
    $.ajax({
        url: 'http://localhost:3000/api/pa/' + sessionStorage.getItem('token') + '/remove/children/' + id,
        type: 'DELETE',
        dataType: 'html',
        success: function (data, statut) {
            document.location.reload();
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function getFavPr() {
    $.ajax({
        url: 'http://localhost:3000/api/favorite/' + sessionStorage.getItem('token'),
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).favorite != false) {
                $(".fav-insert").empty();
                $.each(JSON.parse(data), function (i, obj) {
                    $(".fav-insert").append("<div class='card card-search'><div class='row no-gutters'><div class='col-sm-4'><img class='card-img-top h-100'src='https://hellocare.com/blog/wp-content/uploads/2019/06/page_medecin.jpg' width='100' height='100'></div><div class='col-sm-8'><div class='card-body'><h5 class='card-title'>" + obj['name'] + "<i class='fav bi bi-star-fill' id='" + obj['id'] + "' data-id='fav-icon'></i></h5><p class='card-text' id='p-spe'>" + obj['specialties'] + "</p><p class='card-text'>" + obj['address'] + " - " + obj['zipcode'] + " " + obj['city'] + "</p><button type='button' class='btn btn-primary' onclick=\"window.location='../../rdv.html?id=" + obj['id'] + "'\";>Prendre rendez-vous</button></div></div></div></div>");
                });
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

$(document).on('click', '.fav', function (event) {
    removeFavPr(event.target.id);
});

function removeFavPr(prId) {
    $("#" + prId).empty();
    $.ajax({
        url: 'http://localhost:3000/api/favorite/' + sessionStorage.getItem('token') + '/remove/' + prId,
        type: 'DELETE',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).removeFavorite == true) {
                getFavPr();
            } else {
                window.location.href = 'profil.html';
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function logout() {
    $.ajax({
        url: 'http://localhost:3000/api/auth/logout/' + sessionStorage.getItem('token'),
        type: 'DELETE',
        dataType: 'html',
        success: function (data, statut) {
            const result = JSON.parse(data);
            if (result.logout == true) {
                window.location.href = '../../index.html';
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}