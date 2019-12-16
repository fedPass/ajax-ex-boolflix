$(document).ready(function(){

    //reazione al click
    $('#search_container button').click(function () {
        cerca_film();
    });

    //reazione al INVIO
    $('#search_container input').keypress(function(event){
        //verifico se ha cliccato enter e se ha digitato qualcosa
        if (event.which == 13) {
            cerca_film();
        }
    });

});

function cerca_film () {
    //prima di tutto devo cancellare tutte le card eventualmente già visibili (perchè se no mi aggiunge valori sotto)
    $('.card').remove();
    $('#error').remove();
    //leggere il value dell'input
    var film_searched = $('#search_container input').val();
    console.log(film_searched);
    //fare una chiamata API per recuperare i titoli in database
    $.ajax({
        'url':'https://api.themoviedb.org/3/search/movie?api_key=545efb8b9373f473ca0a15eafe64304c&query=' + film_searched,
        'method':'get',
        'success': function(response){
            //per ogni risultato della chiamata in lista recupera Titolo, Titolo Originale, Lingua, Voto
            var film_list = response.results;
            for (var i = 0; i < film_list.length; i++) {
                var titolo = film_list[i].title;
                var titolo_originale = film_list[i].original_title;
                var lingua = film_list[i].original_language;
                var voto = film_list[i].vote_average;
                //mostramelo in pagina
                $('#display_container').append(`<div class="card">
                    <ul>
                        <li>Titolo: `+ titolo + `</li>
                        <li>Titolo originale: `+ titolo_originale + `</li>
                        <li>Lingua: `+ lingua + `</li>
                        <li>Voto: `+ voto + `</li>
                    </ul>
                </div>`);
            }
            //svuoto il value dell'input
            $('#search_container input').val('');
        },
        'error': function(error){
            //se non inserisci nulla
            if (error.status == 422) {
                $('#display_container').append(`<div id="error">
                    <strong>Non ha inserito qualcosa di valido</strong>
                </div>`);
            }
        }
    });
}
