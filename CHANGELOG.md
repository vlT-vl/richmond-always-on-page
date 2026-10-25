# Changelog

Le funzionalità principali della pagina, in ordine cronologico inverso.

## 2026-10-27 — 0.1.0 / R271026

Prima versione di RICHMOND always on page, derivata da S2E AlwaysOn page.

- Titolo dell'evento animato al posto del DCO: logo Richmond ricostruito in SVG con la scritta RICHMOND e «IT Director Forum» su una sola riga, con linea che si disegna; lo stesso logo animato è nella modale Info.
- Meteo su Rimini e orologio Europe/Rome; l'ora dell'agenda si allinea a un servizio di rete con ripiego sull'orologio del dispositivo.
- Agenda dell'evento (26 e 27 ottobre) con tutti gli appuntamenti: meeting, sessioni, pranzo, aperitivo e cena, ciascuno con icona contestuale.
- Sezione «Diamo il benvenuto a:» con il partecipante in corso (o il prossimo), in orizzontale con badge, nome, ruolo, azienda e orario; per pranzo, sessioni e altri slot diventa «Adesso in programma:» o «A seguire:» con l'icona del tipo.
- Scheda di benvenuto che, per i meeting, si alterna ogni 30 secondi (impostabile da `.env`) tra due layout con transizione fluida: nome con icona utente, oppure azienda in primo piano con icona edificio, nome e ruolo con le loro icone separati da un pipe e solo l'orario a destra.
- Pillola in alto a sinistra, accanto all'orologio: totale dei partecipanti, meeting del giorno e carosello ogni 15 secondi sullo slot in corso e su quelli successivi (mai quelli già passati), con ingresso a cascata.
- Colonna «In agenda» accanto alle card del team con lo slot in corso e il successivo; titoli di sezione animati «A questo evento per S2E» e «In agenda».
- Modale Agenda dal bottone calendario in alto a destra: una scheda per giornata, filtri per tipo, righe animate con orari e icone, slot in corso evidenziato.
- Team ridotto a due persone, con foto ritoccate e ruoli aggiornati; ruoli, email e contatti nelle card.
- Carosello delle card espanse del team: foto ed emblema volano dalla card piccola a quella grande, che mostra tutti i dati compresa l'email, la descrizione del ruolo e un QR code che salva il contatto sul telefono; entra e esce sempre nello stesso ordine (foto e dati, ruolo, QR).
- Bottone schermo intero, visibile fin dal primo istante dell'animazione di ingresso (attivabile da `.env`).
- Ciclo automatico: ogni 180 secondi (impostabile da `.env`) la pagina esce con un'animazione, alterna tema chiaro e scuro e riparte dall'inizio, senza ricaricare e senza uscire dallo schermo intero. Il bottone di debug, spento nella configurazione, riavvia allo stesso modo.
- Layout per smartphone e tablet in verticale (fino a 900 px): una sola colonna scorrevole con testi leggibili, barra in alto impilata (orologio, pillola agenda, meteo e bottoni), sezioni una sotto l'altra senza sovrapposizioni, modali adattate; tutti i caroselli e le animazioni restano attivi, compreso quello delle card espanse (l'area si allarga in altezza per contenerle).
- Correzione del flip clock che non si vedeva nella versione pubblicata.
- Correzione della banda bianca o nera ai bordi dello schermo su smartphone a schermo intero: la pagina occupa tutta l'area (`viewport-fit=cover`) e rispetta i margini di sicurezza del dispositivo.
- Correzione di card e sezioni tagliate in basso su desktop: l'adattamento alla finestra viene ricalcolato anche quando il contenuto cambia dopo il primo calcolo (arrivo dei dati, cambio di layout del benvenuto, riavvio del ciclo).
- Scala dell'interfaccia in proporzione allo schermo e «We are making the shift» sempre al centro della pagina, con SHIFT non più in grassetto.
- Team e agenda in un unico file mascherato, `alwaysondata.dat`, senza dati leggibili nel codice o nella repository.
- Pubblicazione su GitHub Pages con un workflow sul solo ramo `sourcecode`.
- Controllo di sicurezza prima della pubblicazione: nessun segreto nella repository, nessuna vulnerabilità nota nelle dipendenze.
