$(document).ready(function(){
    //----dichiaro le variabili globali
    var template_html = $("#film-template").html();
    var template_function = Handlebars.compile(template_html);
    var api_base = 'https://api.themoviedb.org/3';
    var api_key = '545efb8b9373f473ca0a15eafe64304c';
    var link_base_locandina = 'https://image.tmdb.org/t/p/w342';

    //reazione al click
    $('#search_container button').click(nuova_ricerca);

    //reazione al INVIO
    $('#search_container input').keypress(function(event){
        if (event.which == 13) {nuova_ricerca();}
    });

    $(document).on('click','.card',function(){
        console.log('click su card');
        $(this).children('.locandina').toggle();
        $(this).children('.box_info_film').toggle();
    });

    function nuova_ricerca(){
        //leggere il value dell'input
        var typed_text = $('#search_container input').val();
        console.log(typed_text);
        //controllo che sia stato digitato qualcosa
        if (typed_text.length != 0) {
            //prima di tutto devo cancellare tutte le card eventualmente già visibili (perchè se no mi aggiunge valori sotto)
            $('.card').remove();
            $('#error').remove();
            //svuoto il value dell'input
            $('#search_container input').val('');
            cerca_film(typed_text);
            cerca_serie(typed_text);
        } else {
            alert('Digita qualcosa da cercare');
        }
    }

    function cerca_film (typed_text) {
        //fare una chiamata API per recuperare i titoli dei film in database
        $.ajax({
            // 'url':'https://api.themoviedb.org/3/search/movie?api_key=545efb8b9373f473ca0a15eafe64304c&query=' + typed_text,
            'url': api_base + '/search/movie',
            'data' : {
                'api_key': api_key,
                'query': typed_text
            },
            'method':'get',
            'success': function(response){
                //per ogni risultato della chiamata in lista recupera Titolo, Titolo Originale, Lingua, Voto
                var film_list = response.results;
                if (film_list.length != 0 ) {
                    stampa_risultati(film_list);
                } else {
                    //se non trova nulla
                    $('#display_film').append(`<div id="error">
                        <strong>Film non presente in database</strong>
                    </div>`);
                }
            },
            'error': function(error){
                //se non inserisci nulla
                if (error.status == 422) {
                    alert('Digita qualcosa da cercare');
                }
            }
        });
    }

    function cerca_serie (typed_text) {
        //fare una chiamata API per recuperare i titoli delle serie in database
        $.ajax({
            // 'url':'https://api.themoviedb.org/3/search/movie?api_key=545efb8b9373f473ca0a15eafe64304c&query=' + typed_text,
            'url': api_base + '/search/tv',
            'data' : {
                'api_key': api_key,
                'query': typed_text,
            },
            'method':'get',
            'success': function(response){
                //per ogni risultato della chiamata in lista recupera Titolo, Titolo Originale, Lingua, Voto
                var serieTv_list = response.results;
                if (serieTv_list.length != 0 ) {
                    stampa_risultati(serieTv_list);
                } else {
                    //se non trova nulla
                    $('#display_serieTv').append(`<div id="error">
                        <strong>Serie non presente in database</strong>
                    </div>`);
                }
            },
            'error': function(error){
                //se non inserisci nulla
                if (error.status == 422) {
                    alert('Digita qualcosa da cercare');
                }
            }
        });
    }

    function stampa_risultati(risultati){
        $('.etichetta_sezione h2').show();
        //estraggo info su ogni film o serie
        for (var i = 0; i < risultati.length; i++) {
            var titoli = restituisci_titoli(risultati[i]);
            var contenitore = titoli.tipologia;
            var lingua = risultati[i].original_language;
            var bandiera = seleziona_bandiera(lingua);
            var voto = risultati[i].vote_average;
            var numero_stelle = Math.ceil(voto/2);
            var stelle = crea_stelle(numero_stelle);
            var trama = risultati[i].overview;
            if (risultati[i].poster_path != null) {
                var img_locandina = link_base_locandina + risultati[i].poster_path;
            } else {
                var img_locandina = 'http://www.cinemaedera.it/images/no_locandina.jpg';
            }
            var context = {
                'locandina': img_locandina,
                'title':titoli.titolo,
                'original_title':titoli.titolo_originale,
                'lang':bandiera,
                'rating':stelle,
                'overview':trama
            };
            var html_film = template_function(context);
            contenitore.append(html_film);
        }
    }

    function restituisci_titoli(elemente_esaminato) {
        var titoli = {
            'titolo':'',
            'titolo_originale':'',
            'tipologia':''
        };
        //se ha title è film
        if(elemente_esaminato.hasOwnProperty('title')) {
            titoli.titolo = elemente_esaminato.title;
            // definisco il contenitore dove poi appenderò (film)
            titoli.tipologia = $('#display_film');
        } else {
            //altrimenti ha name ed è serie
            titoli.titolo = elemente_esaminato.name;
            titoli.tipologia = $('#display_serieTv');
        }
        if (elemente_esaminato.hasOwnProperty('original_title')) {
            titoli.titolo_originale = elemente_esaminato.original_title;
            titoli.tipologia = $('#display_film');
        } else {
            titoli.titolo_originale = elemente_esaminato.original_name;
            titoli.tipologia = $('#display_serieTv');
        }
        return titoli;
    }

    function crea_stelle(numero_stelle) {
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
        return stelle;
    }

    function seleziona_bandiera(lingua) {
        //prendi la bandiera in base alla lingua
        var bandiera = '';
        switch (lingua) {
          case "it":
            bandiera = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/it.svg" alt="bandiera it">';
            break;
          case "de":
            bandiera = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/de.svg" alt="bandiera it">';
            break;
          case "ja":
            bandiera = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/jp.svg" alt="bandiera it">';
          break;
          case "en":
            bandiera = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/gb.svg" alt="bandiera it">';
            break;
          case "fr":
            bandiera = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/fr.svg" alt="bandiera it">';
            break;
          case "pt":
            bandiera = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/pt.svg" alt="bandiera it">';
            break;
          case "es":
            bandiera = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/es.svg" alt="bandiera it">';
            break;
          case "cn":
            bandiera = '<img src="https://lipis.github.io/flag-icon-css/flags/4x3/cn.svg" alt="bandiera it">';
            break;
          default:
            bandiera = lingua;
        }
        return bandiera;
    }
});
