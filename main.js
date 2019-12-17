$(document).ready(function(){
    //----dichiaro le variabili globali
    var template_html = $("#film-template").html();
    var template_function = Handlebars.compile(template_html);

    //reazione al click
    $('#search_container button').click(nuova_ricerca);

    //reazione al INVIO
    $('#search_container input').keypress(function(event){
        if (event.which == 13) {
            nuova_ricerca();
        }
    });

    function nuova_ricerca(){
        //leggere il value dell'input
        var film_searched = $('#search_container input').val();
        console.log(film_searched);
        //controllo che sia stato digitato qualcosa
        if (film_searched.length != 0) {
            //prima di tutto devo cancellare tutte le card eventualmente già visibili (perchè se no mi aggiunge valori sotto)
            $('.card').remove();
            $('#error').remove();
            //svuoto il value dell'input
            $('#search_container input').val('');
            cerca_api(film_searched);
        } else {
            display_error();
        }
    }

    function cerca_api (film_searched) {
        var api_base = 'https://api.themoviedb.org/3';
        var api_key = '545efb8b9373f473ca0a15eafe64304c';
        //fare una chiamata API per recuperare i titoli in database
        $.ajax({
            // 'url':'https://api.themoviedb.org/3/search/movie?api_key=545efb8b9373f473ca0a15eafe64304c&query=' + film_searched,
            'url': api_base + '/search/movie',
            'data' : {
                'api_key': api_key,
                'query': film_searched
            },
            'method':'get',
            'success': function(response){
                //per ogni risultato della chiamata in lista recupera Titolo, Titolo Originale, Lingua, Voto
                var film_list = response.results;
                if (film_list.length != 0 ) {
                    stampa_risultati(film_list);
                } else {
                    display_error();
                }

            },
            'error': function(error){
                //se non inserisci nulla
                if (error.status == 422) {
                    display_error()
                }
            }
        });
    }

    function stampa_risultati(risultati){
        //estraggo info su ogni film
        for (var i = 0; i < risultati.length; i++) {
            var titolo = risultati[i].title;
            var titolo_originale = risultati[i].original_title;
            var lingua = risultati[i].original_language;
            var voto = risultati[i].vote_average;
            var numero_stelle = Math.ceil(voto/2);
            console.log(titolo + ': ' + numero_stelle);
            //uso variabile vuota perchè stringhe
            var stelle = '';
            //faccio il ciclo per il num di elementi totali
            for (var j = 0; j < 5; j++) {
                //se il num di stelle è minore del numero_stelle stampo stella piena
                if (j < numero_stelle) {
                    stelle += '<i class="fas fa-star"></i>';
                } else {
                    //se non ho raggiunto numero_stelle stampo stella vuota
                    stelle += '<i class="far fa-star"></i>';
                }
            }
            var bandiera = '';
            switch (lingua) {
              case "it":
                bandiera = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/it.svg" alt="bandiera it">';
                break;
              case "en":
                console.log("Le mele costano €0.64 al chilo.");
                break;
              case "fr":
                console.log("Le banane costano €0.92 al chilo.");
                break;
              case "pt":
                console.log("Le ciliegie costano €2.59 al chilo.");
                break;
              case "es":
                console.log("Le ciliegie costano €2.59 al chilo.");
                break;
              case "ch":
                console.log("I manghi e le papaye costano €1.79 al chilo.");
                break;
              default:
                bandiera = lingua;
            }

            var context = {
                'title':titolo,
                'original_title':titolo_originale,
                'lang':bandiera,
                'rating':stelle
            };
            var html = template_function(context);
            $('#display_container').append(html);
        }
    }

    function display_error() {
        $('#display_container').append(`<div id="error">
            <strong>Non hai inserito un titolo valido oppure il film non è presente in database</strong>
        </div>`);
    }
});
