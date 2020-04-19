$(document).ready(function(){
    //----dichiaro le variabili globali
    var template_html = $("#film-template").html();
    var template_function = Handlebars.compile(template_html);
    var api_base = 'https://api.themoviedb.org/3';
    var api_key = '545efb8b9373f473ca0a15eafe64304c';
    var link_base_locandina = 'https://image.tmdb.org/t/p/w342';

    //chiamata ajax per recuperare l'elenco genere film
    var lista_generi_film = '';
    //https://api.themoviedb.org/3/genre/movie/list?api_key=e99307154c6dfb0b4750f6603256716d
    $.ajax({
        'url': api_base + '/genre/movie/list',
        'data' : {
            'api_key': api_key,
        },
        'method':'get',
        'success': function(response_genre_film){
            //mi restituisce un array con dentro l'elenco dei generi id e name
            lista_generi_film = response_genre_film.genres;
            console.log(lista_generi_film);
        },
        'error': function(error){
                alert('error');
        }
    });

    //chiamata ajax per recuperare l'elenco genere serie
    var lista_generi_serie = '';
    //https://api.themoviedb.org/3/genre/tv/list?api_key=e99307154c6dfb0b4750f6603256716d
    $.ajax({
        'url': api_base + '/genre/tv/list',
        'data' : {
            'api_key': api_key,
        },
        'method':'get',
        'success': function(response_genre_serie){
            //mi restituisce un array con dentro l'elenco dei generi id e name
            lista_generi_serie = response_genre_serie.genres;
            console.log(lista_generi_serie);
        },
        'error': function(error){
                alert('error');
        }
    });

    //chiamata ajax per recuperare i trends
    var lista_trend = '';
    $.ajax({
        'url': api_base + '/trending/all/day',
        'data' : {
            'api_key': api_key,
        },
        'method':'get',
        'success': function(response_trend){
            //mi restituisce un array con dentro i trend
            // console.log(response_trend);
            lista_trend = response_trend.results;
            console.log(lista_trend);
            if (lista_trend.length != 0 ) {
                //passo l'array alla funzione di stampa
                stampa_risultati(lista_trend);
            }
        },
        'error': function(error){
                alert('error');
        }
    });

    //reazione al click sl bottone di ricerca
    $('#search_container button').click(function() {
        //cambio testo etichetta
        $('.etichetta').text('Risultati');
        //avvio ricerca
        nuova_ricerca();
    });

    //reazione al INVIO sul bottone di ricerca
    $('#search_container input').keypress(function(event){
        //cambio testo etichetta
        $('.etichetta').text('Risultati');
        if (event.which == 13) {nuova_ricerca();}
    });

    //al click sulla card appare/scompare tab info
    $('#display_film, #display_serieTv').on('click','.card',function(){
        $('.locandina').show();
        $('.box_info_film').hide();
        // $('.card').not('this').attr('opacity','0.2');
        $(this).children('.locandina').toggle();
        $(this).children('.box_info_film').toggle();
    });

    //al muoseleenter sulla card appare/scompare tab info
    $('#display_film, #display_serieTv').on('mouseenter','.card',function(){
        $('.locandina').show();
        $('.box_info_film').hide();
        $(this).children('.locandina').toggle();
        $(this).children('.box_info_film').toggle();
    });

    //al muoseleave sulla card appare/scompare tab info
    $('#display_film, #display_serieTv').on('mouseleave','.card',function(){
        $(this).children('.locandina').toggle();
        $(this).children('.box_info_film').toggle();
    });

    //click su etichetta film per visualizzare lista film_list
    $('header').on('click','#see_film', function(){
        //nascondi serie tv e mostra film_list
        $('#see_film').addClass('activeButton');
        $('#see_serieTv').removeClass('activeButton');
        $('.strip.serietv').hide();
        $('.strip.film').show();
    });

    //click su etichetta serietv per lsta serietv
    $('header').on('click','#see_serieTv', function(){
        //nascondi serie tv e mostra film_list
        $('#see_film').removeClass('activeButton');
        $('#see_serieTv').addClass('activeButton');
        $('.strip.film').hide();
        $('.strip.serietv').show();

    });

    //----------funzioni-----------

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
            //leggi il valore della Lingua
            var select_lang = $('#select_lang').val()
            //chiama funzioni per ricerca film e serietv
            cerca_film(typed_text, select_lang);
            cerca_serie(typed_text, select_lang);
        } else {
            alert('Digita qualcosa da cercare');
        }
    }

    function cerca_film (typed_text, lang) {
        //fare una chiamata API per recuperare i titoli dei film in database
        $.ajax({
            // 'url':'https://api.themoviedb.org/3/search/movie?api_key=545efb8b9373f473ca0a15eafe64304c&query=' + typed_text,
            'url': api_base + '/search/movie',
            'data' : {
                'api_key': api_key,
                'query': typed_text,
                'language': lang
            },
            'method':'get',
            'success': function(response){
                //se ricevo qualcosa come risultato
                var film_list = response.results;
                if (film_list.length != 0 ) {
                    //passo l'array alla funzione di stampa
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

    function cerca_serie (typed_text, lang) {
        //fare una chiamata API per recuperare i titoli delle serie in database
        $.ajax({
            // 'url':'https://api.themoviedb.org/3/search/tv?api_key=545efb8b9373f473ca0a15eafe64304c&query=' + typed_text,
            'url': api_base + '/search/tv',
            'data' : {
                'api_key': api_key,
                'query': typed_text,
                'language': lang
            },
            'method':'get',
            'success': function(response){
                //se mi restituisce qualcosa
                var serieTv_list = response.results;
                if (serieTv_list.length != 0 ) {
                    //mando in stampa
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

    //estraggo info e le stampo in div apposito
    function stampa_risultati(risultati){
        //rendi visibile il menù film/serietv
        $('#type_nav').css('visibility','visible');
        //estraggo info su ogni film o serie
        for (var i = 0; i < risultati.length; i++) {

            //creo un array in cui inserisco alcune info e stabilisco il contenitore
            var info = restituisci_titoli_tipologia_linkCast(risultati[i]);
            //predispongo una variabile con cui assegnare il contenitore (film o serie)
            var contenitore = info.tipologia;
            var linkCast = info.link;

            //estraggo la lingua e uso funzione per trovare bandiera
            var lingua = risultati[i].original_language;
            var bandiera = seleziona_bandiera(lingua);

            //estraggo il voto in base 10, lo trasformo in base 5 e uso funzione per convertire in stelle
            var voto = risultati[i].vote_average;
            var numero_stelle = Math.ceil(voto/2);
            var stelle = crea_stelle(numero_stelle);

            //estraggo trama
            var trama = risultati[i].overview;

            //verifico se esiste locandina
            if (risultati[i].poster_path != null) {
                var img_locandina = link_base_locandina + risultati[i].poster_path;
                //eventualmente uso una standard
            } else {
                var img_locandina = 'http://www.cinemaedera.it/images/no_locandina.jpg';
            }

            //estraggo il codice del film/serie
            var codice_film = risultati[i].id;

            //estraggo i codici dei generi e uso una funzione per convertirli in lettere
            var id_generi = risultati[i].genre_ids;
            var stringa_generi = recupera_generi(id_generi, contenitore);

            //creo un oggetto che contenga le informazioni estratte
            var context = {
                'id':codice_film,
                'locandina': img_locandina,
                'title':info.titolo,
                'original_title':info.titolo_originale,
                'generi': stringa_generi,
                'lang':bandiera,
                'rating':stelle,
                'overview':trama
            };
            //uso le info per compilare il template
            var html_film = template_function(context);
            //appendo il template nel relativo contenitore
            contenitore.append(html_film);
            //attivo sezione dei film
            $('#see_film').addClass('activeButton');
            //disattivo sezione delle serie
            $('#see_serieTv').removeClass('activeButton');
            $('.strip.serietv').hide();
            //funzione a cui passo tipologia(per link) e id per recuperare il cast
            recupera_cast(codice_film, linkCast);
        }
    }

    //chiamata ajax per recuperare cast film
    function recupera_cast(id_elemento, tipologia) {
        $.ajax({
            //https://api.themoviedb.org/3/tv/{tv_id}/credits?api_key=<<api_key>>&language=en-US
            //chiamata cast film --> /movie/{tv_id}/credits
            //chiamata cast serie --> /tv/{tv_id}/credits
            'url': api_base + tipologia,
            'data' : {
                'api_key': api_key,
            },
            'method':'get',
            'success': function(response_cast){
                // stampa_risultati(risultati);
                //mi restituisce un array con la lista del cast del fiml
                var lista_cast = response_cast.cast;
                //inserisci in una lista ogni attore
                //devo creare un oggetto così gli do i valori data-id/codice_film e nomi cast
                var nomi_cast = '';
                if (lista_cast.length == 0) {
                    console.log('Info cast non presenti');
                    $('.card[data-id="' + id_elemento + '"]').find('.cast').text('Info cast non presenti');
                } else {
                    //scorri gli elementi della lista e prendi il nome
                    for (var k = 0; k < lista_cast.length && k < 5; k++) {
                        nomi_cast += lista_cast[k].name + ', ';
                    }
                    console.log(nomi_cast);
                    //prendi la card che ha data-id uguale a codice, prendi suo figlio cast e riempilo con nomi_cast
                    $('.card[data-id="' + id_elemento + '"]').find('.cast').text('Cast: ' + nomi_cast);
                    // $('.card').find('.cast').text('Cast: ' + nomi_cast);
                }
            },
            'error':function(){
                alert('error');
            }
        });
    }

    function recupera_generi(id_generi, contenitore) {
        //sto passando a questa funzione un array con dentri i codici dei generi del film /serie
        //creo una variabile vuota in cui inserisco il name del genere se l'id coindice con l'id esaminato
        var nomi_generi = '';
        if (id_generi.length == 0) {
            nomi_generi = 'Info non presenti';
            console.log('Info non presenti');
        } else {
            //gli dico in quale array cercare
            if (contenitore == $('#display_film')) {
                var arrayGeneri = lista_generi_film;
            } else {
                var arrayGeneri = lista_generi_serie;
            }
            //scorro l'array id_generi che ti passo
            for (var i = 0; i < id_generi.length; i++) {
                //prendi id in esame
                var current_id = id_generi[i];
                //cicla l'elenco dei generi
                for(var k = 0; k < arrayGeneri.length; k++) {
                    //se questo id è uguale ad uno di quelli che trovi dentro l'elenco prendi il name del genere
                    if (current_id == arrayGeneri[k].id) {
                        var nomeGenere = arrayGeneri[k].name;
                        nomi_generi += nomeGenere +', ';
                    }
                }
            }
        }
        console.log('Generi Film: ' + nomi_generi);
        return nomi_generi;
    }

    function restituisci_titoli_tipologia_linkCast(elemente_esaminato) {
        var info_elemento_esaminato = {
            'titolo':'',
            'titolo_originale':'',
            'tipologia':'',
            'link':''
        };
        //se ha title è film
        if(elemente_esaminato.hasOwnProperty('title')) {
            info_elemento_esaminato.titolo = elemente_esaminato.title;
            // definisco il contenitore dove poi appenderò
            info_elemento_esaminato.tipologia = $('#display_film');
            //definisco con quale link cercare il cast
            info_elemento_esaminato.link = '/movie/'+ elemente_esaminato.id +'/credits';

        } else {
            //altrimenti ha name ed è serie
            info_elemento_esaminato.titolo = elemente_esaminato.name;
            info_elemento_esaminato.tipologia = $('#display_serieTv');
            info_elemento_esaminato.link = '/tv/'+ elemente_esaminato.id +'/credits';
        }
        if (elemente_esaminato.hasOwnProperty('original_title')) {
            info_elemento_esaminato.titolo_originale = elemente_esaminato.original_title;
            info_elemento_esaminato.tipologia = $('#display_film');
        } else {
            info_elemento_esaminato.titolo_originale = elemente_esaminato.original_name;
            info_elemento_esaminato.tipologia = $('#display_serieTv');
        }
        return info_elemento_esaminato;
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
