/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
import './bootstrap';


/* On affiche les notifications, le tableau des tâches ainsi que le formulaire de création de tâche */
showNotifications();
showTasks();
showCreateForm();

// Ajout d'une tâche via le formulaire 
$(document).on('submit', '#createTask', function(e) {

    e.preventDefault();

    // On récupère les valeurs du formulaire
    let data = {};
    $(this).find('[name]').each(function(index, value) {
        data[$(this).attr('name')] = $(this).val(); 
    });

    // On les envoie via une requête POST à l'API
    $.ajax({
        type: 'POST',
        url: '/api/tasks',
        data: JSON.stringify(data),
        contentType: 'application/json',
        // En cas de succès, on prévient l'utilisateur et on actualise les notifications, le tableau des tâches et le formulaire
        success: function(response) {
            window.alert('Tâche créée avec succès');
            showNotifications();
            showTasks();
            showCreateForm();
        },
        error: function(response) {
            window.alert("Tâche non créée");
        }
    }); 
});

// Modification d'une tâche via le formulaire
$(document).on('submit', '#updateTask', function(e) {

    e.preventDefault();

    // On récupère les valeurs du formulaire
    let data = {};
    $(this).find('[name]').each(function(index, value) {
        data[$(this).attr('name')] = $(this).val(); 
    });

    // On les envoie via une requête PATCH à l'API
    $.ajax({
        type: 'PATCH',
        url: '/api/tasks/' + data['id'],
        data: JSON.stringify(data),
        processData: false,
        contentType: 'application/merge-patch+json',
        // En cas de succès, on prévient l'utilisateur et on actualise les notifications, le tableau des tâches et le formulaire
        success: function(response) {
            window.alert('Tâche modifiée avec succès');
            showNotifications();
            showTasks();
            showCreateForm();
        },
        error: function(response) {
            window.alert('Tâche non modifiée');
        }
    });
});


/*  Fonction permettant d'afficher le formulaire de création d'une tâche */
function showCreateForm() {
    $("#tasksForm div").html(`
        <h3>Ajouter une tâche</h3>
        <form id="createTask">
            <div>
                <label for="name">Nom*</label>
                <input type="text" required="true" name="name" placeholder="Nom de la tâche">
            </div>
            <div>
                <label for="description">Description</label>
                <input type="text" name="description" placeholder="Description">
            </div>
            <div>
                <label for="date">Date*</label>
                <input type="date" required="true" name="date">
            </div>
            <input type="submit" value="Créer">
        </form>
    `);
}

/* Fonction permettant d'afficher le formulaire de modification d'une tâche */
function showUpdateForm(task) {
    let date = task.date.substr(0,10); // On modifie la date pour qu'elle convienne au format du fomulaire
    $("#tasksForm div").html(`
        <h3>Modifier une tâche</h3>
        <form id="updateTask">
            <div>
                <input type="hidden" required="true" name="id" value="` + task.id + `">
            </div>
            <div>
                <label for="name">Nom*</label>
                <input type="text" required="true" name="name" value="` + task.name + `">
            </div>
            <div>
                <label for="description">Description</label>
                <input type="text" name="description" value="` + task.description + `">
            </div>
            <div>
                <label for="date">Date*</label>
                <input type="date" required="true" name="date" value="` + date + `">
            </div>
            <input type="submit" value="Modifier">
        </form>
    `);
}

/* Fonction permettant d'afficher les notifications (haut de page) */
function showNotifications() {
    // On envoie une requête GET à l'API qui nous retourne les tâches du jour
    $.ajax({
        url: '/api/tasks/notifications',
        contentType: "application/json",
        dataType: 'json',
        success: function(notifications) {
            if(Object.keys(notifications).length > 0) {
                $("#notifications div").html(`
                    <h2>Notifications</h2>
                `);
                $('#notifications div').append(document.createElement('ul'));
                $.each(notifications, function(i, notification) {
                    $('#notifications ul').append('<li>' + notification.name + ' - ' + notification.description + '</li>');
                });
            }
            else {
                $("#notifications div").html(`<h2>Pas de notifications aujourd'hui !</h2>`);
            }
        }
    })
}

/* Fonction permettant d'afficher les tâches (gauche de la page) */
function showTasks(){
    // On envoie une requête GET à l'API qui nous retourne toutes les tâches présentes en BDD, triées par date la plus récente
    $.ajax({
        url: '/api/tasks',
        contentType: "application/json",
        dataType: 'json',
        success: function(tasks) {
            if(Object.keys(tasks).length > 0) {
                $("#listTasks div").html(`
                    <h2>Liste des tâches</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Tâche</th>
                                <th>Commentaire</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                `);
                $.each(tasks, function(i, task) {
                    let date = new Date(task.date);
                    let realDate = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();
                    $('#listTasks div table tbody').append('<tr><td>' + task.name + '</td><td>' + task.description + '</td><td>' + realDate + '</td><td><button value="' + task.id + '" id="updateTask">Modifier</button><button value="' + task.id + '" id="deleteTask">Supprimer</button></td></tr');
                });
            }
            else {
                $("#listTasks div").html(`<h2>Aucune tâche déjà ajoutée</h2>`);
            }
        }
    })
}

/*
    Fonction permettant d'afficher le formulaire de modification d'une tâche 
    Appelée lors de l'appui du bouton "Modifier" du tableau
*/
$(document).on('click', '#updateTask', function() {

    // On envoie une requête GET à l'API qui nous retourne la tâche selon son ID puis on affiche le formulaire avec les valeurs retournées 
    $.ajax({
        url: '/api/tasks/' + $(this).val(),
        contentType: "application/json",
        dataType: 'json',
        success: function(task) {
            showUpdateForm(task);
        },
        error: function() {
            window.alert('Erreur');
        }
    })
})

/*
    Fonction permettant de supprimer une tâche 
    Appelée lors de l'appui du bouton "Supprimer du tableau"
*/
$(document).on('click', '#deleteTask', function() {
    // Après confirmation par l'utilisation, on envoie une requête DELETE à l'API de la Task selon son ID
    if(window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')){
        $.ajax({
            url: '/api/tasks/' + $(this).val(),
            contentType: "application/json",
            type: 'DELETE',
            success: function() {
                // Une fois la suppression faites, on prévient l'utilisateur et on met à jour les notifications ainsi que le tableau des tâches
                window.alert('Suppression réussie');
                showNotifications();
                showTasks();
            },
            error: function() {
                window.alert('Élément non supprimé');
            }
        })
    }
})