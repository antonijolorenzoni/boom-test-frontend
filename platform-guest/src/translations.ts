export const resources = {
  en: {
    translation: {
      general: {
        next: 'Next',
        back: 'Back',
        date: 'Date',
        time: 'Time',
        confirm: 'Confirm',
        read: 'Read',
        hour: 'hour',
        hour_plural: 'hours',
        minute: 'minute',
        minute_plural: 'minutes',
        hourShort: 'h',
        minuteShort: 'm',
        selectDate: 'Select a date',
        selectStartingTime: 'Select starting time',
        selectLanguage: 'Choose your language',
      },
      languages: {
        en: 'English',
        it: 'Italian',
        nl: 'Dutch',
        es: 'Spanish',
        fr: 'French',
      },
      form: {
        required: 'Required',
        contact: 'Contact',
        logisticInfo: 'Logistic info',
        contactOnSite: 'Contact on site',
        address: 'Address, ZIP Code, City',
        shortAddress: 'Address',
        bookYourPhotoshoot: 'Book your photoshoot',
        confirm: 'Confirm',
        back: 'Back',
        nameSurname: 'Name Surname',
        phone: 'Phone',
        email: 'Email',
        businessName: 'Business Name',
        invalidEmail: 'Invalid email',
        invalidPhone: 'Invalid number',
        noOptions: 'Type to search...',
        business: 'Business',
      },
      orderStatus: {
        UNSCHEDULED: 'Unscheduled',
        BOOKED: 'Booked',
        COMPLETED: 'Completed',
        CANCELED: 'Canceled',
        RESHOOT: 'Reshoot',
      },
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      welcomeWizard: {
        FOOD: {
          1: {
            title: 'PHOTOSHOOT OFFERED BY {{companyName}}',
            content:
              '{{companyName}} has ordered a <strong>complimentary</strong> photoshoot for your business. All you have to do is book a date and time and think of the dishes to prepare for the session.',
          },
          2: {
            title: 'PICK A DATE AND TIME',
            content:
              'We invite you to pick a date and time for the photoshoot ordered by {{companyName}} for your business. A photographer will then come to your door on the date/time of your choice to snap pictures.',
          },
          3: {
            title: 'YOU CAN RESCHEDULE YOUR PHOTOSHOOT ONCE',
            content:
              'Is the date/time of the photoshoot ordered by {{companyName}} not convenient for you?<br /><br />Remember that you can always reschedule your photoshoot ONCE. After that, you will need to contact us directly to change your availability.',
          },
          4: {
            title: 'OUR FOOD POLICY',
            content:
              'Make sure you are fully prepared to cook your dishes on the spot throughout the photo session. Prep the ingredients beforehand, stack your serving plates near you - anything to save yours and the photographer’s time! As for the dishes prepared, we strongly advise against throwing the food away. How about feeding the team with it for example? Or donating it to your favorite charity?',
          },
          5: {
            title: '100% CONSISTENT RESULTS',
            content:
              'We guarantee consistent, high-quality content based on guidelines defined together. Whether the photoshoot is in Barcelona, Dubai or Denver, the result will always be best-in-class!<br /><br /><strong>Check out our FAQ page for additional information!</strong>',
          },
        },
        REAL_ESTATE: {
          1: {
            title: 'PHOTOSHOOT OFFERED BY {{companyName}}',
            content:
              '{{companyName}} has ordered a complimentary photoshoot for your business. All you have to do is book a date and time and get your property ready for the session.',
          },
          2: {
            title: 'PICK A DATE AND TIME',
            content:
              'We invite you to pick a date and time for the photoshoot ordered by {{companyName}} for your business. A photographer will then come to your door on the date/time of your choice to snap pictures.',
          },
          3: {
            title: 'YOU CAN RESCHEDULE YOUR PHOTOSHOOT ONCE',
            content:
              'Is the date/time of the photoshoot ordered by {{companyName}} not convenient for you?<br />Remember that you can always reschedule your photoshoot ONCE. After that, you will need to contact us directly to change your availability.',
          },
          4: {
            title: 'OUR GUIDELINES',
            content:
              'Make sure the premises of the photoshoot are prepared and ready for the session, as per our guidelines (which you will discover further ahead).',
          },
          5: {
            title: '100% CONSISTENT RESULTS',
            content:
              'We guarantee consistent, high-quality content based on guidelines defined together. Whether the photoshoot is in Barcelona, Dubai or Denver, the result will always be best-in-class!<br /><strong>Check out our FAQ page for additional information!</strong>',
          },
        },
      },
      errorPage: {
        mainTitle: 'OOOps , something went wrong with your order code.',
        subTitle: 'Please <contact-us>contact us</contact-us> to book your photoshoot.',
      },
      confirmationPage: {
        congratulations: 'Congratulations',
        bookingConfirmedFor: 'Your booking has been confirmed for {{date}} at {{time}}.',
        bookingRescheduledAndConfirmedFor: 'Your booking has been rescheduled and confirmed for {{date}} at {{time}}.',
        photographerWillCome:
          'A photographer will come to your door on the day of the session and will snap the pictures in about {{durationPhotoshoot}}.',
        dateAndTime: 'Date & Time',
        review: 'Review',
        contact: 'Contact',
        yourBooking: 'Your booking',
      },
      orderInfo: {
        yourPhotoshooting: 'Your photoshooting',
        shootingStatus: 'Photoshoot status',
        download: 'Download the photos',
        foodTip: {
          UNSCHEDULED:
            'Think of the dishes to prepare for the photo session. Reserve an empty table for the photoshoot and place it in a well-lit area.',
          BOOKED:
            'Think of the dishes to prepare for the photo session. Reserve an empty table for the photoshoot and place it in a well-lit area.',
          COMPLETED: 'Your photos have been sent to {{companyName}}.',
          CANCELED: 'Your photoshoot has been deleted.',
          RESHOOT: 'Your photoshoot needs to be reshoot.',
        },
        realEstateTip: {
          UNSCHEDULED: 'Keep your property tidy and picture-ready for the photoshoot.',
          BOOKED: 'Keep your property tidy and picture-ready for the photoshoot.',
          COMPLETED: 'Your photos have been sent to {{companyName}}.',
          CANCELED: 'Your photoshoot has been deleted.',
          RESHOOT: 'Your photoshoot needs to be reshoot.',
        },
        rescheduleTip: '*You can Reschedule only once, without penalty up to 24 hours before the photoshoot.',
        cannotRescheduleTip: 'You already rescheduled once.',
        almostStart: 'The photoshoot will begin within 24h.',
        photosNumber: 'Photos',
        duration: 'Duration',
        dishesNumber: 'Dishes',
        guidelines: 'Guidelines',
        chooseAnotherDate: 'Choose another date',
        reschedule: '*Reschedule',
        needHelp: 'Need help?',
        whoIsContactOnSite: 'Who is the contact on site?',
        editContactOnSite: 'Edit',
        nameSurname: 'Name Surname',
        phone: 'Phone',
        additionalPhone: 'Additional Phone',
        email: 'Email',
        business: 'Business',
        address: 'Address',
        businessName: 'Business Name',
        anyQuestions: 'Do you have any questions?',
        boomLocationAndVatnumber: 'Corso Magenta 85, 20123, Milano MI / P.IVA 1234565432',
        dateAndTime: 'Date and time',
        photoshootDuration: 'Photoshoot duration',
      },
      editOrder: {
        editContact: 'Edit contact',
        contactOnSite: 'I will be the contact person on site',
        contactOnSiteCaption: 'If you are not on site, tell us the contact in charge',
      },
      header: {
        aboutUs: 'About us',
        faq: 'Faq',
        logOut: 'Log out',
      },
      faq: {
        FOOD: 'https://boom.co/businesses/faq-business-owner-food/',
        REAL_ESTATE: 'https://boom.co/businesses/faq-business-owner-real-estate/',
      },
      guidelines: {
        FOOD: 'https://sites.google.com/boom.co/guidelines-bo-food-en/home',
        REAL_ESTATE: 'https://sites.google.com/boom.co/guidelines-bo-re-en/home',
      },
    },
  },
  it: {
    translation: {
      general: {
        next: 'Avanti',
        back: 'Indietro',
        date: 'Data',
        time: 'Tempo',
        confirm: 'Conferma',
        read: 'Leggi',
        hour: 'ora',
        hour_plural: 'ore',
        minute: 'minuto',
        minute_plural: 'minuti',
        hourShort: 'h',
        minuteShort: 'm',
        selectDate: 'Seleziona una data',
        selectStartingTime: 'Seleziona la data di inizio',
        selectLanguage: 'Seleziona la tua lingua',
      },
      languages: {
        en: 'Inglese',
        it: 'Italiano',
        nl: 'Olandese',
        es: 'Spagnolo',
        fr: 'Francese',
      },
      form: {
        required: 'Richiesto',
        contact: 'Contatto',
        logisticInfo: 'Info logistiche',
        contactOnSite: 'Contatto in loco',
        address: 'Indirizzo, CAP, Città',
        shortAddress: 'Indirizzo',
        bookYourPhotoshoot: 'Prenota il tuo shooting',
        confirm: 'Conferma',
        back: 'Indietro',
        nameSurname: 'Nome Cognome',
        phone: 'Telefono',
        email: 'Email',
        businessName: 'Nome Business',
        invalidEmail: 'Email invalida',
        invalidPhone: 'Numero non valido',
        noOptions: 'Scrivi qualcosa per cercare...',
        business: 'Business',
      },
      orderStatus: {
        UNSCHEDULED: 'Non programmato',
        BOOKED: 'Prenotato',
        COMPLETED: 'Completato',
        CANCELED: 'Cancellato',
        RESHOOT: 'Da rifare',
      },
      daysOfWeek: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'],
      welcomeWizard: {
        FOOD: {
          1: {
            title: '{{companyName}} TI OFFRE UN SERVIZIO FOTOGRAFICO',
            content:
              "{{companyName}} ha prenotato un servizio fotografico, <strong>completamente gratuito</strong> per la tua attività. Tutto quello che devi fare è prenotare una data e un'ora e pensare ai piatti migliori da preparare per la sessione.",
          },
          2: {
            title: "SCEGLI UNA DATA E UN'ORA",
            content:
              "Tu scegli una data e un'ora per il servizio fotografico ordinato da {{companyName}} per la tua attività. Noi ti invieremo un nostro fotografo per la sessione fotografica, ed il gioco è fatto!",
          },
          3: {
            title: 'PUOI RIPROGRAMMARE IL TUO SERVIZIO FOTOGRAFICO UNA SOLA VOLTA',
            content:
              'Hai bisogno di riprogrammare la data/ora del servizio fotografico ordinato da {{companyName}} per la tua attività?<br /><br />Nessun problema, puoi riprogrammare il tuo servizio fotografico UNA VOLTA. Dopo di che, dovrai contattarci direttamente per modificare la tua disponibilità.',
          },
          4: {
            title: 'LA NOSTRA POLITICA ALIMENTARE',
            content:
              'Assicurati di essere pronto a cucinare i tuoi piatti sul posto per tutta la sessione fotografica. Preparate gli ingredienti in anticipo, impilate i piatti da portata vicino a voi - qualsiasi cosa per risparmiare il vostro, ed il tempo del fotografo!<br /><br />Per quanto riguarda i piatti preparati, ti consigliamo vivamente di non gettare via il cibo. Che ne dici, ad esempio, di dare da mangiare al team? O donarlo al vostro ente di beneficenza preferito? In ogni caso vi inviamo fotografi affamati!',
          },
          5: {
            title: 'RISULTATI IMPAREGGIABILI',
            content:
              'Garantiamo contenuti unici e di alta qualità in base alle linee guida che avremo definito insieme. Che il servizio si svolga a Barcellona, Dubai o Denver, il risultato sarà sempre al top!<br /><br /><strong>Consulta la nostra pagina delle FAQ per ulteriori informazioni.</strong>',
          },
        },
        REAL_ESTATE: {
          1: {
            title: '{{companyName}} TI OFFRE UN SERVIZIO FOTOGRAFICO',
            content:
              "{{companyName}} ha prenotato un servizio fotografico, <strong>completamente gratuito</strong> per la tua attività. Tutto quello che devi fare è prenotare una data e un'ora e preparare gli spazi della tua proprietà per la sessione fotografica.",
          },
          2: {
            title: "SCEGLI UNA DATA E UN'ORA",
            content:
              "Tu scegli una data e un'ora per il servizio fotografico ordinato da {{companyName}} per la tua attività. Noi ti invieremo un nostro fotografo per la sessione fotografica, ed il gioco è fatto!",
          },
          3: {
            title: 'PUOI RIPROGRAMMARE IL TUO SERVIZIO FOTOGRAFICO UNA SOLA VOLTA',
            content:
              'Hai bisogno di riprogrammare la data/ora del servizio fotografico ordinato da {{companyName}} per la tua attività?<br /><br />Nessun problema, puoi riprogrammare il tuo servizio fotografico UNA VOLTA. Dopo di che, dovrai contattarci direttamente per modificare la tua disponibilità.',
          },
          4: {
            title: 'LA NOSTRE LINEE GUIDA',
            content:
              'Assicurati di preparare gli spazi della tua proprietà per il servizio fotografico, seguendo le nostre linee guida (che scoprirai più avanti).',
          },
          5: {
            title: 'RISULTATI IMPAREGGIABILI',
            content:
              'Garantiamo contenuti unici e di alta qualità in base alle linee guida che avremo definito insieme. Che il servizio si svolga a Barcellona, Dubai o Denver, il risultato sarà sempre al top!<br /><br /><strong>Consulta la nostra pagina delle FAQ per ulteriori informazioni.</strong>',
          },
        },
      },
      errorPage: {
        mainTitle: "OOOps , qualcosa è andato storto con il tuo codice dell'ordine.",
        subTitle: 'Ti preghiamo di <contact-us>contattarci</contact-us> per prenotare il tuo ordine.',
      },
      confirmationPage: {
        congratulations: 'Congratulazioni',
        bookingConfirmedFor: 'Il tuo servizio è stato confermato per il {{date}} {{time}}.',
        bookingRescheduledAndConfirmedFor: 'Il tuo servizio è stato rischedulato e confermato per il {{date}} {{time}}.',
        photographerWillCome:
          'Un fotografo arriverà da te il giorno della sessione e scatterà le foto per una durata massima {{durationPhotoshoot}}.',
        dateAndTime: 'Data e Ora',
        review: 'Revisione',
        contact: 'Contatti',
        yourBooking: 'La tua prenotazione',
      },
      orderInfo: {
        yourPhotoshooting: 'Il tuo servizio fotografico',
        shootingStatus: 'Stato ordine',
        download: 'Scarica il pacchetto',
        foodTip: {
          UNSCHEDULED:
            "Pensa ai piatti da preparare per il servizio fotografico. Prenota un tavolo vuoto per il servizio fotografico e posizionalo in un'area ben illuminata.",
          BOOKED:
            "Pensa ai piatti da preparare per il servizio fotografico. Prenota un tavolo vuoto per il servizio fotografico e posizionalo in un'area ben illuminata.",
          COMPLETED: 'Le tue foto sono state inviate a {{companyName}}.',
          CANCELED: 'Il tuo servizio fotografico è stato cancellato.',
          RESHOOT: "Il tuo servizio fotografico dev'essere riprogrammato.",
        },
        realEstateTip: {
          UNSCHEDULED: 'Mantieni la tua proprietà in ordine e pronta per il servizio fotografico.',
          BOOKED: 'Mantieni la tua proprietà in ordine e pronta per il servizio fotografico.',
          COMPLETED: 'Le tue foto sono state inviate a {{companyName}}.',
          CANCELED: 'Il tuo servizio fotografico è stato cancellato.',
          RESHOOT: "Il tuo servizio fotografico dev'essere riprogrammato.",
        },
        rescheduleTip: '*Puoi rischedulare una sola volta, senza penalità fino a 24 ore prima del servizio.',
        cannotRescheduleTip: 'Hai già rischedulato il servizio.',
        almostStart: 'Il servizio inizierà tra meno di 24h.',
        photosNumber: 'Foto',
        duration: 'Durata',
        dishesNumber: 'Piatti',
        guidelines: 'Linee guida',
        chooseAnotherDate: "Scegli un'altra data",
        reschedule: '*Riprogramma',
        needHelp: `Hai bisogno d'aiuto?`,
        whoIsContactOnSite: 'Chi è il contatto in loco?',
        editContactOnSite: 'Modifica',
        nameSurname: 'Nome Cognome',
        phone: 'Telefono',
        additionalPhone: 'Contatto Aggiuntivo',
        email: 'Email',
        business: 'Business',
        address: 'Address',
        businessName: 'Nome Business',
        anyQuestions: 'Hai qualche domanda?',
        boomLocationAndVatnumber: 'Corso Magenta 85, 20123, Milano MI / P.IVA 1234565432',
        dateAndTime: 'Data e ora',
        photoshootDuration: 'Durata servizio',
      },
      editOrder: {
        editContact: 'Modifica contatto',
        contactOnSite: 'Sarò il contatto in loco',
        contactOnSiteCaption: 'Se non ti troverai in loco, comunicaci chi ci sarà quel giorno',
      },
      header: {
        aboutUs: 'Su di noi',
        faq: 'Faq',
        logOut: 'Esci',
      },
      faq: {
        FOOD: 'https://boom.co/it/business/faq-business-owner-food/',
        REAL_ESTATE: 'https://boom.co/it/business/faq-business-owner-real-estate/',
      },
      guidelines: {
        FOOD: 'https://sites.google.com/boom.co/guidelines-bo-food-it/home',
        REAL_ESTATE: 'https://sites.google.com/boom.co/guidelines-bo-re-it/home',
      },
    },
  },
  nl: {
    translation: {
      general: {
        next: 'Volgende',
        back: 'Terug',
        date: 'Datum',
        time: 'Tijd',
        confirm: 'Bevestigen',
        read: 'Lezen',
        hour: 'uur',
        hour_plural: 'uur',
        minute: 'minuut',
        minute_plural: 'minuten',
        hourShort: 'h',
        minuteShort: 'm',
        selectDate: 'Datum selecteren',
        selectStartingTime: 'Begintijd selecteren',
        selectLanguage: 'Kies jouw taal',
      },
      languages: {
        en: 'Engels',
        it: 'Italiaans',
        nl: 'Nederlands',
        es: 'Spaans',
        fr: 'Frans',
      },
      form: {
        required: 'Required',
        contact: 'Contactpersoon',
        logisticInfo: 'Logistieke informatie',
        contactOnSite: 'Contactpersoon ter plaatse',
        address: 'Adres',
        shortAddress: 'Address',
        bookYourPhotoshoot: 'Jouw fotoshoot boeken',
        confirm: 'Confirm',
        back: 'Back',
        nameSurname: 'Name Surname',
        phone: 'Phone',
        email: 'Email',
        businessName: 'Business Name',
        invalidEmail: 'Invalid email',
        invalidPhone: 'Invalid number',
        noOptions: 'Type to search...',
        business: 'Bedrijf',
      },
      orderStatus: {
        UNSCHEDULED: 'Niet gepland',
        BOOKED: 'Geboekt',
        COMPLETED: 'Voltooid',
        CANCELED: 'Geannuleerd',
        RESHOOT: 'Opnieuw doen',
      },
      daysOfWeek: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'],
      welcomeWizard: {
        FOOD: {
          1: {
            title: 'FOTOSHOOT AANGEBODEN DOOR {{companyName}}',
            content:
              '{{companyName}} heeft een <strong>gratis</strong> fotoshoot voor jouw bedrijf besteld. Je hoeft alleen maar een datum en tijd te boeken en na te denken over de gerechten die je gaat bereiden voor de sessie.',
          },
          2: {
            title: 'KIES EEN DATUM EN TIJD',
            content:
              'Jij kiest een datum en tijd voor de fotoshoot die {{companyName}} voor jouw bedrijf heeft besteld. En wij zorgen ervoor dat er op die datum en tijd een fotograaf op de stoep staat om de foto’s te maken.',
          },
          3: {
            title: 'JE KUNT JOUW FOTOSHOOT ÉÉN KEER VERZETTEN',
            content:
              'Wil je de datum/tijd van de door {{companyName}} bestelde fotoshoot veranderen?<br /><br />Geen probleem, je kunt de fotoshoot EEN KEER verzetten. Daarna zul je rechtstreeks contact met ons moeten opnemen om de afspraak te wijzigen.',
          },
          4: {
            title: 'ONS VOEDSELBELEID',
            content:
              'Zorg ervoor dat je helemaal klaar bent om jouw gerechten tijdens de hele fotosessie ter plaatse te bereiden. Maak de ingrediënten op voorhand klaar, zet een stapel borden naast je neer. Alles wat je kunt bedenken om jou en de fotograaf tijd te besparen, is meegenomen! Wat de klaargemaakte gerechten betreft, vragen we je met klem het voedsel niet weg te gooien. Je zou het eten bijvoorbeeld aan het team kunnen aanbieden? Of aan een goed doel kunnen geven?',
          },
          5: {
            title: 'EEN WEERGELOOS RESULTAAT',
            content:
              'Wij leveren gegarandeerd unieke en kwalitatief hoogstaande content gebaseerd op de richtlijnen die we samen hebben afgesproken. Of de fotoshoot nu in Barcelona, Dubai of Denver plaatsvindt, het resultaat zal altijd van topkwaliteit zijn!<br /><br /><strong>Raadpleeg onze pagina met FAQ’s voor extra informatie.</strong>',
          },
        },
        REAL_ESTATE: {
          1: {
            title: 'FOTOSHOOT AANGEBODEN DOOR {{companyName}}',
            content:
              '{{companyName}} heeft een gratis fotoshoot voor jouw bedrijf besteld. Je hoeft alleen maar een datum en tijd te boeken en jouw accommodatie klaar te maken voor de sessie.',
          },
          2: {
            title: 'KIES EEN DATUM EN TIJD',
            content:
              'Jij kiest een datum en tijd voor de fotoshoot die {{companyName}} voor jouw bedrijf heeft besteld. En wij zorgen ervoor dat er op die datum en tijd een fotograaf op de stoep staat om de foto’s te maken.',
          },
          3: {
            title: 'JE KUNT JOUW FOTOSHOOT ÉÉN KEER VERZETTEN',
            content:
              'Wil je de datum/tijd van de door {{companyName}} bestelde fotoshoot veranderen?<br />Geen probleem, je kunt de fotoshoot EEN KEER verzetten. Daarna moet je rechtstreeks met ons contact opnemen om de afspraak te verplaatsen.',
          },
          4: {
            title: 'ONZE RICHTLIJNEN',
            content:
              'Zorg ervoor dat de ruimtes waar de foto’s worden genomen klaar zijn voor de fotoshoot. Baseer je daarbij op onze richtlijnen die je hieronder vindt.',
          },
          5: {
            title: 'EEN WEERGELOOS RESULTAAT',
            content:
              'We leveren gegarandeerd unieke en kwalitatief hoogstaande content gebaseerd op de richtlijnen die we samen hebben afgesproken. Of de fotoshoot nu in Barcelona, Dubai of Denver plaatsvindt, het resultaat zal altijd van topkwaliteit zijn!<br /><strong>Raadpleeg onze pagina met FAQ’s voor extra informatie.</strong>',
          },
        },
      },
      errorPage: {
        mainTitle: 'Oeps, er is iets misgegaan met je bestelcode. NEEM CONTACT MET ONS OP OM JOUW FOTOSHOOT TE BOEKEN.',
        subTitle: 'Neem <contact-us>contact met</contact-us> ons op om jouw fotoshoot te boeken.',
      },
      confirmationPage: {
        congratulations: 'Proficiat!',
        bookingConfirmedFor: 'Jouw fotosessie is geboekt voor {{date}}/{{time}}.',
        bookingRescheduledAndConfirmedFor: 'Jouw fotosessie is verzet en geboekt voor {{date}}/{{time}}.',
        photographerWillCome:
          'Wij zorgen ervoor dat er op de dag van de sessie een fotograaf op de stoep staat om in ongeveer {{durationPhotoshoot}} de foto’s te maken.',
        dateAndTime: 'Datum & Tijd',
        review: 'Overzicht',
        contact: 'Contactgegevens',
        yourBooking: 'Jouw boeking',
      },
      orderInfo: {
        yourPhotoshooting: 'Jouw fotoshoot',
        shootingStatus: 'Status van de fotoshoot',
        download: 'De foto’s downloaden',
        foodTip: {
          UNSCHEDULED:
            'Denk na over de gerechten die je gaat klaarmaken voor de fotosessie. Reserveer een lege tafel voor de fotoshoot op een goed verlichte plaats.',
          BOOKED:
            'Denk na over de gerechten die je gaat klaarmaken voor de fotosessie. Reserveer een lege tafel voor de fotoshoot op een goed verlichte plaats.',
          COMPLETED: 'Jouw foto’s werden verstuurd naar {{companyName}}>',
          CANCELED: 'Jouw fotoshoot werd geannuleerd.',
          RESHOOT: 'Jouw fotoshoot moet opnieuw worden gedaan.',
        },
        realEstateTip: {
          UNSCHEDULED: 'Zorg ervoor dat jouw accommodatie opgeruimd is en er perfect uitziet voor de fotoshoot.',
          BOOKED: 'Zorg ervoor dat jouw accommodatie opgeruimd is en er perfect uitziet voor de fotoshoot.',
          COMPLETED: 'Jouw foto’s werden verstuurd naar {{companyName}}.',
          CANCELED: 'Jouw fotoshoot werd geannuleerd.',
          RESHOOT: 'Jouw fotoshoot moet opnieuw worden gedaan.',
        },
        rescheduleTip: '*Je kunt de fotoshoot maar één keer verzetten tot 24 uur voor de afspraak.',
        cannotRescheduleTip: 'Je hebt jouw afspraak al een keer verzet.',
        almostStart: 'De fotoshoot begint over 24 uur.',
        photosNumber: 'Foto’s',
        duration: 'Duur',
        dishesNumber: 'Gerechten',
        guidelines: 'Richtlijnen',
        chooseAnotherDate: 'Een andere datum kiezen',
        reschedule: '*Afspraak verzetten',
        needHelp: 'Hulp nodig?',
        whoIsContactOnSite: 'Wie is de contactpersoon ter plaatse?',
        editContactOnSite: 'Bewerken',
        nameSurname: 'Voornaam Achternaam',
        phone: 'Telefoonnummer',
        additionalPhone: 'Zusätzliches Telefoonnummer',
        email: 'Email',
        business: 'Bedrijf',
        address: 'Adres',
        businessName: 'Naam van het bedrijf',
        anyQuestions: 'Heb je vragen?',
        boomLocationAndVatnumber: 'Corso Magenta 85, 20123, Milano MI / P.IVA 1234565432',
        dateAndTime: 'Datum en Tijd',
        photoshootDuration: 'Duur van de fotoshoot',
      },
      editOrder: {
        editContact: 'Contactgegevens bewerken',
      },
      header: {
        aboutUs: 'Over ons',
        faq: 'Faq',
        logOut: 'Uitloggen',
      },
      faq: {
        FOOD: 'https://boom.co/businesses/faq-business-owner-food/',
        REAL_ESTATE: 'https://boom.co/businesses/faq-business-owner-real-estate/',
      },
      guidelines: {
        FOOD: 'https://sites.google.com/boom.co/guidelines-bo-food-nl/home',
        REAL_ESTATE: 'https://sites.google.com/boom.co/guidelines-bo-re-en/home',
      },
    },
  },
  es: {
    translation: {
      general: {
        next: 'Siguiente',
        back: 'Volver',
        date: 'Fecha',
        time: 'Hora',
        confirm: 'Confirmar',
        read: 'Leer',
        hour: 'hora',
        hour_plural: 'houras',
        minute: 'minuto',
        minute_plural: 'minutos',
        hourShort: 'h',
        minuteShort: 'm',
        selectDate: 'Seleccionar una fecha',
        selectStartingTime: 'Seleccionar hora de inicio',
        selectLanguage: 'Elige tu idioma',
      },
      languages: {
        en: 'Inglés',
        it: 'Italiano',
        nl: 'Holandés',
        es: 'Español',
        fr: 'Francés',
      },
      form: {
        required: 'Obligatorio',
        contact: 'Contacto',
        logisticInfo: 'Información logística',
        contactOnSite: 'Contacto sobre el terreno',
        address: 'Dirección, Codigo postal, Ciudad',
        shortAddress: 'Address',
        bookYourPhotoshoot: 'Reservar la sesión fotográfica',
        confirm: 'Confirm',
        back: 'Back',
        nameSurname: 'Name Surname',
        phone: 'Phone',
        email: 'Email',
        businessName: 'Business Name',
        invalidEmail: 'Invalid email',
        invalidPhone: 'Invalid number',
        noOptions: 'Type to search...',
        business: 'Empresa',
      },
      orderStatus: {
        UNSCHEDULED: 'No programado',
        BOOKED: 'Reservado',
        COMPLETED: 'Completo',
        CANCELED: 'Cancelado',
        RESHOOT: 'Rehacer',
      },
      daysOfWeek: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      welcomeWizard: {
        FOOD: {
          1: {
            title: 'SESIÓN FOTOGRÁFICA POR CORTESÍA DE {{companyName}}',
            content:
              '{{companyName}} nos ha encargado una sesión fotográfica para tu negocio, <strong>sin coste para ti</strong>. Lo único que tienes que hacer es reservar una fecha y una hora, y pensar en los platos que vas a preparar para la sesión.',
          },
          2: {
            title: 'ELEGIR FECHA Y HORA',
            content:
              'Te invitamos a elegir fecha y hora para la sesión fotográfica que nos ha encargado {{companyName}} para tu negocio. Te enviaremos un fotógrafo en la fecha y hora que elijas para hacer las fotos.',
          },
          3: {
            title: 'PUEDES REPROGRAMAR TU SESIÓN FOTOGRÁFICA UNA VEZ.',
            content:
              '¿No te va bien la fecha/hora de la sesión fotográfica que nos ha encargado {{companyName}}?<br /><br />Recuerda que puedes reprogramar tu sesión fotográfica UNA VEZ. Si necesitas reprogramarla de nuevo, ponte en contacto directamente con nosotros para confirmar tu disponibilidad.',
          },
          4: {
            title: 'NUESTRA POLÍTICA SOBRE LA COMIDA',
            content:
              'Tenlo todo a punto para finalizar tus platos de inmediato durante toda la sesión fotográfica. Prepara los ingredientes de antemano, apila cerca de ti los platos que quieras usar para servir... ¡todo lo que haga falta para que ni tú ni el fotógrafo perdáis tiempo! Te rogamos que no tires la comida que prepares. ¿Qué te parece dársela tu personal, por ejemplo? ¿O donarla a una organización benéfica?',
          },
          5: {
            title: 'RESULTADOS COHERENTES AL 100%',
            content:
              'Te garantizamos contenidos de alta calidad totalmente en línea con las directrices que definimos contigo. Da igual que la sesión sea en Barcelona, Dubái o Denver: ¡los resultados siempre son de primera!<br /><br /><strong>Consulta nuestra página de preguntas frecuentes para más información.</strong>',
          },
        },
        REAL_ESTATE: {
          1: {
            title: 'SESIÓN FOTOGRÁFICA POR CORTESÍA DE {{companyName}}',
            content:
              '{{companyName}} nos ha encargado una sesión fotográfica para tu negocio, sin coste para ti. Lo único que tienes que hacer es reservar una fecha y una hora, y preparar tu propiedad para la sesión.',
          },
          2: {
            title: 'ELEGIR FECHA Y HORA',
            content:
              'Te invitamos a elegir fecha y hora para la sesión fotográfica que nos ha encargado {{companyName}} para tu negocio. Te enviaremos un fotógrafo en la fecha y hora que elijas para hacer las fotos.',
          },
          3: {
            title: 'PUEDES REPROGRAMAR TU SESIÓN FOTOGRÁFICA UNA VEZ.',
            content:
              '¿No te va bien la fecha/hora de la sesión fotográfica que nos ha encargado {{companyName}}?<br /><br />Recuerda que puedes reprogramar tu sesión fotográfica UNA VEZ. Si necesitas reprogramarla de nuevo, ponte en contacto directamente con nosotros para confirmar tu disponibilidad.',
          },
          4: {
            title: 'NUESTRAS DIRECTRICES',
            content:
              'Asegúrate de que el sitio esté preparado y listo para la sesión fotográfica, según nuestras directrices (que puedes ver más adelante).',
          },
          5: {
            title: 'RESULTADOS COHERENTES AL 100%',
            content:
              'Te garantizamos contenidos de alta calidad totalmente en línea con las directrices que definimos contigo. Da igual que la sesión sea en Barcelona, Dubái o Denver: ¡los resultados siempre son de primera!<br /><br /><strong>Consulta nuestra página de preguntas frecuentes para más información.</strong>',
          },
        },
      },
      errorPage: {
        mainTitle: 'Vaya, ha habido un problema con tu código de pedido.',
        subTitle: 'Ponte en <contact-us>contacto con nosotros</contact-us> para reservar tu sesión fotográfica.',
      },
      confirmationPage: {
        congratulations: '¡Enhorabuena!',
        bookingConfirmedFor: 'Confirmamos tu reserva para el {{date}}/{{time}}.',
        bookingRescheduledAndConfirmedFor: 'Hemos reprogramado tu reserva y la confirmamos para el {{date}}/{{time}}.',
        photographerWillCome: 'Un fotógrafo acudirá el día de la sesión y hará las fotos en aproximadamente {{durationPhotoshoot}}.',
        dateAndTime: 'Fecha y hora',
        review: 'Revisar',
        contact: 'Contacto',
        yourBooking: 'Tu reserva',
      },
      orderInfo: {
        yourPhotoshooting: 'Tu sesión fotográfica',
        shootingStatus: 'Estado de la sesión fotográfica',
        download: 'Descargar las fotos',
        foodTip: {
          UNSCHEDULED:
            'Piensa en los platos que vas a preparar para la sesión fotográfica. Reserva una mesa vacía para la sesión fotográfica y colócala en una zona bien iluminada.',
          BOOKED:
            'Piensa en los platos que vas a preparar para la sesión fotográfica. Reserva una mesa vacía para la sesión fotográfica y colócala en una zona bien iluminada.',
          COMPLETED: 'Tus fotos han sido enviadas a {{companyName}}.',
          CANCELED: 'Tu sesión ha sido cancelada.',
          RESHOOT: 'Tu pedido necesita una otra sesión.',
        },
        realEstateTip: {
          UNSCHEDULED: 'Tu propiedad debe estar arreglada y lista para la sesión fotográfica.',
          BOOKED: 'Tu propiedad debe estar arreglada y lista para la sesión fotográfica.',
          COMPLETED: 'Tus fotos han sido enviadas a {{companyName}}.',
          CANCELED: 'Tu sesión ha sido cancelada.',
          RESHOOT: 'Tu pedido necesita una otra sesión.',
        },
        rescheduleTip: '*Puedes reprogramar la sesión una sola vez hasta 24 horas antes.',
        cannotRescheduleTip: 'Ya has cambiado la cita una vez.',
        almostStart: 'La sesión fotográfica comenzará dentro de 24 horas.',
        photosNumber: 'Fotografías',
        duration: 'Duración',
        dishesNumber: 'Platos',
        guidelines: 'Directrices',
        chooseAnotherDate: 'Elegir otra fecha',
        reschedule: '*Reprogramar',
        needHelp: '¿Necesitas ayuda?',
        whoIsContactOnSite: '¿Quién es la persona de contacto sobre el terreno?',
        editContactOnSite: 'Editar',
        nameSurname: 'Nombre Apellidos',
        phone: 'Teléfono (número)',
        additionalPhone: 'Número de teléfono adicional',
        email: 'Correo electrónico',
        business: 'Empresa',
        address: 'Dirección',
        businessName: 'Nombre de la empresa',
        anyQuestions: '¿Tienes alguna pregunta?',
        boomLocationAndVatnumber: 'Corso Magenta 85, 20123, Milano MI / P.IVA 1234565432',
        dateAndTime: 'Fecha y hora',
        photoshootDuration: 'Duración de la sesión fotográfica',
      },
      editOrder: {
        editContact: 'Editar contacto',
      },
      header: {
        aboutUs: 'Sobre nosotros',
        faq: 'Faq',
        logOut: 'Cerrar sesión',
      },
      faq: {
        FOOD: 'https://boom.co/businesses/faq-business-owner-food/',
        REAL_ESTATE: 'https://boom.co/businesses/faq-business-owner-real-estate/',
      },
      guidelines: {
        FOOD: 'https://sites.google.com/boom.co/guidelines-bo-food-es/home',
        REAL_ESTATE: 'https://sites.google.com/boom.co/guidelines-bo-re-en/home',
      },
    },
  },
  fr: {
    translation: {
      general: {
        next: 'Suivant',
        back: 'Retour',
        date: 'Date',
        time: 'Heure',
        confirm: 'Confirmer',
        read: 'Lire',
        hour: 'heure',
        hour_plural: 'heures',
        minute: 'minute',
        minute_plural: 'minutes',
        hourShort: 'h',
        minuteShort: 'm',
        selectDate: 'Sélectionner une date',
        selectStartingTime: 'Sélectionner l’heure de début',
        selectLanguage: 'Choisissez votre langue',
      },
      languages: {
        en: 'Anglais',
        it: 'Italien',
        nl: 'Néerlandais',
        es: 'Espagnol',
        fr: 'Frances',
      },
      form: {
        required: 'Requis',
        contact: 'Contact',
        logisticInfo: 'Informations logistiques',
        contactOnSite: 'Contact sur place',
        address: 'Adresse, Code postal, Ville',
        shortAddress: 'Address',
        bookYourPhotoshoot: 'Réserver votre séance photo',
        confirm: 'Confirm',
        back: 'Back',
        nameSurname: 'Name Surname',
        phone: 'Phone',
        email: 'Email',
        businessName: 'Business Name',
        invalidEmail: 'Invalid email',
        invalidPhone: 'Invalid number',
        noOptions: 'Type to search...',
        business: 'Activité',
      },
      orderStatus: {
        UNSCHEDULED: 'Non programée',
        BOOKED: 'Réservée',
        COMPLETED: 'Complété',
        CANCELED: 'Annulé',
        RESHOOT: 'Re-filmer',
      },
      daysOfWeek: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      welcomeWizard: {
        FOOD: {
          1: {
            title: 'SÉANCE PHOTO OFFERTE PAR {{companyName}}',
            content:
              '{{companyName}} a commandé une séance photo <strong>gratuite</strong> pour votre entreprise. Vous devez simplement réserver une date et une heure et réfléchir aux plats à préparer pour la séance.',
          },
          2: {
            title: 'CHOISIR UNE DATE ET UNE HEURE',
            content:
              'Nous vous invitons à choisir une date et une heure pour la séance photo commandée par {{companyName}} pour votre entreprise. Un photographe vous rendra visite à la date et à l’heure de votre choix pour prendre les photos.',
          },
          3: {
            title: 'VOUS POUVEZ REPROGRAMMER LA SÉANCE UNE FOIS',
            content:
              'La date ou l’heure de la séance commandée par {{companyName}} ne vous convient pas?<br /><br />Souvenez-vous que vous pouvez toujours reprogrammer votre séance UNE FOIS. Au-delà, vous devrez nous contacter directement pour modifier vos disponibilités.',
          },
          4: {
            title: 'NOTRE CHARTE ALIMENTAIRE',
            content:
              'Préparez-vous à cuisiner vos plats sur place durant toute la séance photo. Préparez les ingrédients à l’avance, empilez vos assiettes près de vous – tout ce qui peut faire gagner du temps au photographe et à vous-même ! Nous déconseillons fortement de jeter les plats que vous avez préparés. Pourquoi ne pas les offrir à l’équipe, par exemple ? Ou en faire don aux associations de votre choix ?',
          },
          5: {
            title: 'DES RÉSULTATS 100 % COHÉRENTS',
            content:
              'Nous garantissons des contenus haut de gamme et cohérents, conformes au cahier des charges défini ensemble. Que la séance photo ait lieu à Barcelone, Dubaï ou Denver, le résultat est toujours parfait!<br /><br /><strong>Consultez notre FAQ pour plus d’informations.</strong>',
          },
        },
        REAL_ESTATE: {
          1: {
            title: 'SÉANCE PHOTO OFFERTE PAR {{companyName}}',
            content:
              '{{companyName}} a commandé une séance photo gratuite pour votre entreprise. Il vous suffit de réserver une date et une heure et de préparer votre propriété pour la séance.',
          },
          2: {
            title: 'CHOISIR UNE DATE ET UNE HEURE',
            content:
              'Nous vous invitons à choisir une date et une heure pour la séance photo commandée par {{companyName}} pour votre entreprise. Un photographe vous rendra ensuite visite à la date et à l’heure de votre choix pour prendre les photos.',
          },
          3: {
            title: 'VOUS POUVEZ REPROGRAMMER LA SÉANCE UNE FOIS',
            content:
              'La date ou l’heure de la séance commandée par {{companyName}} ne vous convient pas?<br /><br />Souvenez-vous que vous pouvez toujours reprogrammer votre séance UNE FOIS. Au-delà, vous devrez nous contacter directement pour modifier vos disponibilités.',
          },
          4: {
            title: 'NOS RECOMMANDATIONS',
            content:
              'Veillez à préparer les locaux pour la séance photo, conformément à nos recommandations (que vous découvrirez plus loin).',
          },
          5: {
            title: 'DES RÉSULTATS 100 % COHÉRENTS',
            content:
              'Nous garantissons des contenus haut de gamme et cohérents, conformes au cahier des charges défini ensemble. Que la séance photo ait lieu à Barcelone, Dubaï ou Denver, le résultat est toujours parfait!<br /><br /><strong>Consultez notre FAQ pour plus d’informations.</strong>',
          },
        },
      },
      errorPage: {
        mainTitle: 'Ouuups, il y a eu un problème avec votre code de commande.',
        subTitle: 'Veuillez <contact-us>nous contacter</contact-us> pour réserver votre séance photo.',
      },
      confirmationPage: {
        congratulations: 'Félicitations!',
        bookingConfirmedFor: 'Votre réservation est confirmée pour le {{date}}/{{time}}.',
        bookingRescheduledAndConfirmedFor: 'Votre réservation est modifiée et confirmée pour le {{date}}/{{time}}.',
        photographerWillCome:
          'Un photographe vous rendra visite le jour de la séance pour prendre les photos pendant environ  {{durationPhotoshoot}}.',
        dateAndTime: 'Date et heure',
        review: 'Résumé',
        contact: 'Contact',
        yourBooking: 'Votre réservation',
      },
      orderInfo: {
        yourPhotoshooting: 'Votre séance photo',
        shootingStatus: 'Statut de la séance photo',
        download: 'Télécharger les photos',
        foodTip: {
          UNSCHEDULED:
            'Réfléchissez aux plats à préparer pour la séance photo. Réservez une table vide pour la séance photo et placez-la dans un espace bien éclairé.',
          BOOKED:
            'Réfléchissez aux plats à préparer pour la séance photo. Réservez une table vide pour la séance photo et placez-la dans un espace bien éclairé.',
          COMPLETED: 'Vos photos ont été envoyées à {{companyName}}.',
          CANCELED: 'Votre séance a été annulée.',
          RESHOOT: 'Votre commande nécessite une autre séance.',
        },
        realEstateTip: {
          UNSCHEDULED: 'Veillez à ce que votre propriété soit en ordre et prête pour la séance photo.',
          BOOKED: 'Veillez à ce que votre propriété soit en ordre et prête pour la séance photo.',
          COMPLETED: 'Vos photos ont été envoyées à {{companyName}}.',
          CANCELED: 'Votre séance a été annulée.',
          RESHOOT: 'Votre commande nécessite une autre séance.',
        },
        rescheduleTip: '*Vous pouvez modifier l’heure et la date une seule fois jusqu’à 24 heures avant la séance.',
        cannotRescheduleTip: 'Vous avez déjà reprogrammé une fois.',
        almostStart: 'La séance photo commencera d’ici 24 heures',
        photosNumber: 'Photos',
        duration: 'Durée',
        dishesNumber: 'Plats',
        guidelines: 'Recommandations',
        chooseAnotherDate: 'Choisir une autre date',
        reschedule: '*Reprogrammer',
        needHelp: 'Besoin d’aide?',
        whoIsContactOnSite: 'Qui est la personne à contacter sur place ?',
        editContactOnSite: 'Modifier',
        nameSurname: 'Nom Prénom',
        phone: 'Numéro de téléphone',
        additionalPhone: 'Numéro de téléphone supplémentaire',
        email: 'Adresse email',
        business: 'Activité',
        address: 'Adresse',
        businessName: 'Nom de l’entreprise',
        anyQuestions: 'Avez-vous des questions ?',
        boomLocationAndVatnumber: 'Corso Magenta 85, 20123, Milano MI / P.IVA 1234565432',
        dateAndTime: 'Date et heure',
        photoshootDuration: 'Durée de la séance photo',
      },
      editOrder: {
        editContact: 'Modifier le contact',
      },
      header: {
        aboutUs: 'À propos de nous',
        faq: 'Faq',
        logOut: 'Déconnexion',
      },
      faq: {
        FOOD: 'https://boom.co/businesses/faq-business-owner-food/',
        REAL_ESTATE: 'https://boom.co/businesses/faq-business-owner-real-estate/',
      },
      guidelines: {
        FOOD: 'https://sites.google.com/boom.co/guidelines-bo-food-fr/home',
        REAL_ESTATE: 'https://sites.google.com/boom.co/guidelines-bo-re-en/home',
      },
    },
  },
};
