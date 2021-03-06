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
              'Make sure you are fully prepared to cook your dishes on the spot throughout the photo session. Prep the ingredients beforehand, stack your serving plates near you - anything to save yours and the photographer???s time! As for the dishes prepared, we strongly advise against throwing the food away. How about feeding the team with it for example? Or donating it to your favorite charity?',
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
        address: 'Indirizzo, CAP, Citt??',
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
      daysOfWeek: ['Luned??', 'Marted??', 'Mercoled??', 'Gioved??', 'Venerd??', 'Sabato', 'Domenica'],
      welcomeWizard: {
        FOOD: {
          1: {
            title: '{{companyName}} TI OFFRE UN SERVIZIO FOTOGRAFICO',
            content:
              "{{companyName}} ha prenotato un servizio fotografico, <strong>completamente gratuito</strong> per la tua attivit??. Tutto quello che devi fare ?? prenotare una data e un'ora e pensare ai piatti migliori da preparare per la sessione.",
          },
          2: {
            title: "SCEGLI UNA DATA E UN'ORA",
            content:
              "Tu scegli una data e un'ora per il servizio fotografico ordinato da {{companyName}} per la tua attivit??. Noi ti invieremo un nostro fotografo per la sessione fotografica, ed il gioco ?? fatto!",
          },
          3: {
            title: 'PUOI RIPROGRAMMARE IL TUO SERVIZIO FOTOGRAFICO UNA SOLA VOLTA',
            content:
              'Hai bisogno di riprogrammare la data/ora del servizio fotografico ordinato da {{companyName}} per la tua attivit???<br /><br />Nessun problema, puoi riprogrammare il tuo servizio fotografico UNA VOLTA. Dopo di che, dovrai contattarci direttamente per modificare la tua disponibilit??.',
          },
          4: {
            title: 'LA NOSTRA POLITICA ALIMENTARE',
            content:
              'Assicurati di essere pronto a cucinare i tuoi piatti sul posto per tutta la sessione fotografica. Preparate gli ingredienti in anticipo, impilate i piatti da portata vicino a voi - qualsiasi cosa per risparmiare il vostro, ed il tempo del fotografo!<br /><br />Per quanto riguarda i piatti preparati, ti consigliamo vivamente di non gettare via il cibo. Che ne dici, ad esempio, di dare da mangiare al team? O donarlo al vostro ente di beneficenza preferito? In ogni caso vi inviamo fotografi affamati!',
          },
          5: {
            title: 'RISULTATI IMPAREGGIABILI',
            content:
              'Garantiamo contenuti unici e di alta qualit?? in base alle linee guida che avremo definito insieme. Che il servizio si svolga a Barcellona, Dubai o Denver, il risultato sar?? sempre al top!<br /><br /><strong>Consulta la nostra pagina delle FAQ per ulteriori informazioni.</strong>',
          },
        },
        REAL_ESTATE: {
          1: {
            title: '{{companyName}} TI OFFRE UN SERVIZIO FOTOGRAFICO',
            content:
              "{{companyName}} ha prenotato un servizio fotografico, <strong>completamente gratuito</strong> per la tua attivit??. Tutto quello che devi fare ?? prenotare una data e un'ora e preparare gli spazi della tua propriet?? per la sessione fotografica.",
          },
          2: {
            title: "SCEGLI UNA DATA E UN'ORA",
            content:
              "Tu scegli una data e un'ora per il servizio fotografico ordinato da {{companyName}} per la tua attivit??. Noi ti invieremo un nostro fotografo per la sessione fotografica, ed il gioco ?? fatto!",
          },
          3: {
            title: 'PUOI RIPROGRAMMARE IL TUO SERVIZIO FOTOGRAFICO UNA SOLA VOLTA',
            content:
              'Hai bisogno di riprogrammare la data/ora del servizio fotografico ordinato da {{companyName}} per la tua attivit???<br /><br />Nessun problema, puoi riprogrammare il tuo servizio fotografico UNA VOLTA. Dopo di che, dovrai contattarci direttamente per modificare la tua disponibilit??.',
          },
          4: {
            title: 'LA NOSTRE LINEE GUIDA',
            content:
              'Assicurati di preparare gli spazi della tua propriet?? per il servizio fotografico, seguendo le nostre linee guida (che scoprirai pi?? avanti).',
          },
          5: {
            title: 'RISULTATI IMPAREGGIABILI',
            content:
              'Garantiamo contenuti unici e di alta qualit?? in base alle linee guida che avremo definito insieme. Che il servizio si svolga a Barcellona, Dubai o Denver, il risultato sar?? sempre al top!<br /><br /><strong>Consulta la nostra pagina delle FAQ per ulteriori informazioni.</strong>',
          },
        },
      },
      errorPage: {
        mainTitle: "OOOps , qualcosa ?? andato storto con il tuo codice dell'ordine.",
        subTitle: 'Ti preghiamo di <contact-us>contattarci</contact-us> per prenotare il tuo ordine.',
      },
      confirmationPage: {
        congratulations: 'Congratulazioni',
        bookingConfirmedFor: 'Il tuo servizio ?? stato confermato per il {{date}} {{time}}.',
        bookingRescheduledAndConfirmedFor: 'Il tuo servizio ?? stato rischedulato e confermato per il {{date}} {{time}}.',
        photographerWillCome:
          'Un fotografo arriver?? da te il giorno della sessione e scatter?? le foto per una durata massima {{durationPhotoshoot}}.',
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
          CANCELED: 'Il tuo servizio fotografico ?? stato cancellato.',
          RESHOOT: "Il tuo servizio fotografico dev'essere riprogrammato.",
        },
        realEstateTip: {
          UNSCHEDULED: 'Mantieni la tua propriet?? in ordine e pronta per il servizio fotografico.',
          BOOKED: 'Mantieni la tua propriet?? in ordine e pronta per il servizio fotografico.',
          COMPLETED: 'Le tue foto sono state inviate a {{companyName}}.',
          CANCELED: 'Il tuo servizio fotografico ?? stato cancellato.',
          RESHOOT: "Il tuo servizio fotografico dev'essere riprogrammato.",
        },
        rescheduleTip: '*Puoi rischedulare una sola volta, senza penalit?? fino a 24 ore prima del servizio.',
        cannotRescheduleTip: 'Hai gi?? rischedulato il servizio.',
        almostStart: 'Il servizio inizier?? tra meno di 24h.',
        photosNumber: 'Foto',
        duration: 'Durata',
        dishesNumber: 'Piatti',
        guidelines: 'Linee guida',
        chooseAnotherDate: "Scegli un'altra data",
        reschedule: '*Riprogramma',
        needHelp: `Hai bisogno d'aiuto?`,
        whoIsContactOnSite: 'Chi ?? il contatto in loco?',
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
        contactOnSite: 'Sar?? il contatto in loco',
        contactOnSiteCaption: 'Se non ti troverai in loco, comunicaci chi ci sar?? quel giorno',
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
              'Jij kiest een datum en tijd voor de fotoshoot die {{companyName}} voor jouw bedrijf heeft besteld. En wij zorgen ervoor dat er op die datum en tijd een fotograaf op de stoep staat om de foto???s te maken.',
          },
          3: {
            title: 'JE KUNT JOUW FOTOSHOOT ????N KEER VERZETTEN',
            content:
              'Wil je de datum/tijd van de door {{companyName}} bestelde fotoshoot veranderen?<br /><br />Geen probleem, je kunt de fotoshoot EEN KEER verzetten. Daarna zul je rechtstreeks contact met ons moeten opnemen om de afspraak te wijzigen.',
          },
          4: {
            title: 'ONS VOEDSELBELEID',
            content:
              'Zorg ervoor dat je helemaal klaar bent om jouw gerechten tijdens de hele fotosessie ter plaatse te bereiden. Maak de ingredi??nten op voorhand klaar, zet een stapel borden naast je neer. Alles wat je kunt bedenken om jou en de fotograaf tijd te besparen, is meegenomen! Wat de klaargemaakte gerechten betreft, vragen we je met klem het voedsel niet weg te gooien. Je zou het eten bijvoorbeeld aan het team kunnen aanbieden? Of aan een goed doel kunnen geven?',
          },
          5: {
            title: 'EEN WEERGELOOS RESULTAAT',
            content:
              'Wij leveren gegarandeerd unieke en kwalitatief hoogstaande content gebaseerd op de richtlijnen die we samen hebben afgesproken. Of de fotoshoot nu in Barcelona, Dubai of Denver plaatsvindt, het resultaat zal altijd van topkwaliteit zijn!<br /><br /><strong>Raadpleeg onze pagina met FAQ???s voor extra informatie.</strong>',
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
              'Jij kiest een datum en tijd voor de fotoshoot die {{companyName}} voor jouw bedrijf heeft besteld. En wij zorgen ervoor dat er op die datum en tijd een fotograaf op de stoep staat om de foto???s te maken.',
          },
          3: {
            title: 'JE KUNT JOUW FOTOSHOOT ????N KEER VERZETTEN',
            content:
              'Wil je de datum/tijd van de door {{companyName}} bestelde fotoshoot veranderen?<br />Geen probleem, je kunt de fotoshoot EEN KEER verzetten. Daarna moet je rechtstreeks met ons contact opnemen om de afspraak te verplaatsen.',
          },
          4: {
            title: 'ONZE RICHTLIJNEN',
            content:
              'Zorg ervoor dat de ruimtes waar de foto???s worden genomen klaar zijn voor de fotoshoot. Baseer je daarbij op onze richtlijnen die je hieronder vindt.',
          },
          5: {
            title: 'EEN WEERGELOOS RESULTAAT',
            content:
              'We leveren gegarandeerd unieke en kwalitatief hoogstaande content gebaseerd op de richtlijnen die we samen hebben afgesproken. Of de fotoshoot nu in Barcelona, Dubai of Denver plaatsvindt, het resultaat zal altijd van topkwaliteit zijn!<br /><strong>Raadpleeg onze pagina met FAQ???s voor extra informatie.</strong>',
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
          'Wij zorgen ervoor dat er op de dag van de sessie een fotograaf op de stoep staat om in ongeveer {{durationPhotoshoot}} de foto???s te maken.',
        dateAndTime: 'Datum & Tijd',
        review: 'Overzicht',
        contact: 'Contactgegevens',
        yourBooking: 'Jouw boeking',
      },
      orderInfo: {
        yourPhotoshooting: 'Jouw fotoshoot',
        shootingStatus: 'Status van de fotoshoot',
        download: 'De foto???s downloaden',
        foodTip: {
          UNSCHEDULED:
            'Denk na over de gerechten die je gaat klaarmaken voor de fotosessie. Reserveer een lege tafel voor de fotoshoot op een goed verlichte plaats.',
          BOOKED:
            'Denk na over de gerechten die je gaat klaarmaken voor de fotosessie. Reserveer een lege tafel voor de fotoshoot op een goed verlichte plaats.',
          COMPLETED: 'Jouw foto???s werden verstuurd naar {{companyName}}>',
          CANCELED: 'Jouw fotoshoot werd geannuleerd.',
          RESHOOT: 'Jouw fotoshoot moet opnieuw worden gedaan.',
        },
        realEstateTip: {
          UNSCHEDULED: 'Zorg ervoor dat jouw accommodatie opgeruimd is en er perfect uitziet voor de fotoshoot.',
          BOOKED: 'Zorg ervoor dat jouw accommodatie opgeruimd is en er perfect uitziet voor de fotoshoot.',
          COMPLETED: 'Jouw foto???s werden verstuurd naar {{companyName}}.',
          CANCELED: 'Jouw fotoshoot werd geannuleerd.',
          RESHOOT: 'Jouw fotoshoot moet opnieuw worden gedaan.',
        },
        rescheduleTip: '*Je kunt de fotoshoot maar ????n keer verzetten tot 24 uur voor de afspraak.',
        cannotRescheduleTip: 'Je hebt jouw afspraak al een keer verzet.',
        almostStart: 'De fotoshoot begint over 24 uur.',
        photosNumber: 'Foto???s',
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
        additionalPhone: 'Zus??tzliches Telefoonnummer',
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
        en: 'Ingl??s',
        it: 'Italiano',
        nl: 'Holand??s',
        es: 'Espa??ol',
        fr: 'Franc??s',
      },
      form: {
        required: 'Obligatorio',
        contact: 'Contacto',
        logisticInfo: 'Informaci??n log??stica',
        contactOnSite: 'Contacto sobre el terreno',
        address: 'Direcci??n, Codigo postal, Ciudad',
        shortAddress: 'Address',
        bookYourPhotoshoot: 'Reservar la sesi??n fotogr??fica',
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
      daysOfWeek: ['Lunes', 'Martes', 'Mi??rcoles', 'Jueves', 'Viernes', 'S??bado', 'Domingo'],
      welcomeWizard: {
        FOOD: {
          1: {
            title: 'SESI??N FOTOGR??FICA POR CORTES??A DE {{companyName}}',
            content:
              '{{companyName}} nos ha encargado una sesi??n fotogr??fica para tu negocio, <strong>sin coste para ti</strong>. Lo ??nico que tienes que hacer es reservar una fecha y una hora, y pensar en los platos que vas a preparar para la sesi??n.',
          },
          2: {
            title: 'ELEGIR FECHA Y HORA',
            content:
              'Te invitamos a elegir fecha y hora para la sesi??n fotogr??fica que nos ha encargado {{companyName}} para tu negocio. Te enviaremos un fot??grafo en la fecha y hora que elijas para hacer las fotos.',
          },
          3: {
            title: 'PUEDES REPROGRAMAR TU SESI??N FOTOGR??FICA UNA VEZ.',
            content:
              '??No te va bien la fecha/hora de la sesi??n fotogr??fica que nos ha encargado {{companyName}}?<br /><br />Recuerda que puedes reprogramar tu sesi??n fotogr??fica UNA VEZ. Si necesitas reprogramarla de nuevo, ponte en contacto directamente con nosotros para confirmar tu disponibilidad.',
          },
          4: {
            title: 'NUESTRA POL??TICA SOBRE LA COMIDA',
            content:
              'Tenlo todo a punto para finalizar tus platos de inmediato durante toda la sesi??n fotogr??fica. Prepara los ingredientes de antemano, apila cerca de ti los platos que quieras usar para servir... ??todo lo que haga falta para que ni t?? ni el fot??grafo perd??is tiempo! Te rogamos que no tires la comida que prepares. ??Qu?? te parece d??rsela tu personal, por ejemplo? ??O donarla a una organizaci??n ben??fica?',
          },
          5: {
            title: 'RESULTADOS COHERENTES AL 100%',
            content:
              'Te garantizamos contenidos de alta calidad totalmente en l??nea con las directrices que definimos contigo. Da igual que la sesi??n sea en Barcelona, Dub??i o Denver: ??los resultados siempre son de primera!<br /><br /><strong>Consulta nuestra p??gina de preguntas frecuentes para m??s informaci??n.</strong>',
          },
        },
        REAL_ESTATE: {
          1: {
            title: 'SESI??N FOTOGR??FICA POR CORTES??A DE {{companyName}}',
            content:
              '{{companyName}} nos ha encargado una sesi??n fotogr??fica para tu negocio, sin coste para ti. Lo ??nico que tienes que hacer es reservar una fecha y una hora, y preparar tu propiedad para la sesi??n.',
          },
          2: {
            title: 'ELEGIR FECHA Y HORA',
            content:
              'Te invitamos a elegir fecha y hora para la sesi??n fotogr??fica que nos ha encargado {{companyName}} para tu negocio. Te enviaremos un fot??grafo en la fecha y hora que elijas para hacer las fotos.',
          },
          3: {
            title: 'PUEDES REPROGRAMAR TU SESI??N FOTOGR??FICA UNA VEZ.',
            content:
              '??No te va bien la fecha/hora de la sesi??n fotogr??fica que nos ha encargado {{companyName}}?<br /><br />Recuerda que puedes reprogramar tu sesi??n fotogr??fica UNA VEZ. Si necesitas reprogramarla de nuevo, ponte en contacto directamente con nosotros para confirmar tu disponibilidad.',
          },
          4: {
            title: 'NUESTRAS DIRECTRICES',
            content:
              'Aseg??rate de que el sitio est?? preparado y listo para la sesi??n fotogr??fica, seg??n nuestras directrices (que puedes ver m??s adelante).',
          },
          5: {
            title: 'RESULTADOS COHERENTES AL 100%',
            content:
              'Te garantizamos contenidos de alta calidad totalmente en l??nea con las directrices que definimos contigo. Da igual que la sesi??n sea en Barcelona, Dub??i o Denver: ??los resultados siempre son de primera!<br /><br /><strong>Consulta nuestra p??gina de preguntas frecuentes para m??s informaci??n.</strong>',
          },
        },
      },
      errorPage: {
        mainTitle: 'Vaya, ha habido un problema con tu c??digo de pedido.',
        subTitle: 'Ponte en <contact-us>contacto con nosotros</contact-us> para reservar tu sesi??n fotogr??fica.',
      },
      confirmationPage: {
        congratulations: '??Enhorabuena!',
        bookingConfirmedFor: 'Confirmamos tu reserva para el {{date}}/{{time}}.',
        bookingRescheduledAndConfirmedFor: 'Hemos reprogramado tu reserva y la confirmamos para el {{date}}/{{time}}.',
        photographerWillCome: 'Un fot??grafo acudir?? el d??a de la sesi??n y har?? las fotos en aproximadamente {{durationPhotoshoot}}.',
        dateAndTime: 'Fecha y hora',
        review: 'Revisar',
        contact: 'Contacto',
        yourBooking: 'Tu reserva',
      },
      orderInfo: {
        yourPhotoshooting: 'Tu sesi??n fotogr??fica',
        shootingStatus: 'Estado de la sesi??n fotogr??fica',
        download: 'Descargar las fotos',
        foodTip: {
          UNSCHEDULED:
            'Piensa en los platos que vas a preparar para la sesi??n fotogr??fica. Reserva una mesa vac??a para la sesi??n fotogr??fica y col??cala en una zona bien iluminada.',
          BOOKED:
            'Piensa en los platos que vas a preparar para la sesi??n fotogr??fica. Reserva una mesa vac??a para la sesi??n fotogr??fica y col??cala en una zona bien iluminada.',
          COMPLETED: 'Tus fotos han sido enviadas a {{companyName}}.',
          CANCELED: 'Tu sesi??n ha sido cancelada.',
          RESHOOT: 'Tu pedido necesita una otra sesi??n.',
        },
        realEstateTip: {
          UNSCHEDULED: 'Tu propiedad debe estar arreglada y lista para la sesi??n fotogr??fica.',
          BOOKED: 'Tu propiedad debe estar arreglada y lista para la sesi??n fotogr??fica.',
          COMPLETED: 'Tus fotos han sido enviadas a {{companyName}}.',
          CANCELED: 'Tu sesi??n ha sido cancelada.',
          RESHOOT: 'Tu pedido necesita una otra sesi??n.',
        },
        rescheduleTip: '*Puedes reprogramar la sesi??n una sola vez hasta 24 horas antes.',
        cannotRescheduleTip: 'Ya has cambiado la cita una vez.',
        almostStart: 'La sesi??n fotogr??fica comenzar?? dentro de 24 horas.',
        photosNumber: 'Fotograf??as',
        duration: 'Duraci??n',
        dishesNumber: 'Platos',
        guidelines: 'Directrices',
        chooseAnotherDate: 'Elegir otra fecha',
        reschedule: '*Reprogramar',
        needHelp: '??Necesitas ayuda?',
        whoIsContactOnSite: '??Qui??n es la persona de contacto sobre el terreno?',
        editContactOnSite: 'Editar',
        nameSurname: 'Nombre Apellidos',
        phone: 'Tel??fono (n??mero)',
        additionalPhone: 'N??mero de tel??fono adicional',
        email: 'Correo electr??nico',
        business: 'Empresa',
        address: 'Direcci??n',
        businessName: 'Nombre de la empresa',
        anyQuestions: '??Tienes alguna pregunta?',
        boomLocationAndVatnumber: 'Corso Magenta 85, 20123, Milano MI / P.IVA 1234565432',
        dateAndTime: 'Fecha y hora',
        photoshootDuration: 'Duraci??n de la sesi??n fotogr??fica',
      },
      editOrder: {
        editContact: 'Editar contacto',
      },
      header: {
        aboutUs: 'Sobre nosotros',
        faq: 'Faq',
        logOut: 'Cerrar sesi??n',
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
        selectDate: 'S??lectionner une date',
        selectStartingTime: 'S??lectionner l???heure de d??but',
        selectLanguage: 'Choisissez votre langue',
      },
      languages: {
        en: 'Anglais',
        it: 'Italien',
        nl: 'N??erlandais',
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
        bookYourPhotoshoot: 'R??server votre s??ance photo',
        confirm: 'Confirm',
        back: 'Back',
        nameSurname: 'Name Surname',
        phone: 'Phone',
        email: 'Email',
        businessName: 'Business Name',
        invalidEmail: 'Invalid email',
        invalidPhone: 'Invalid number',
        noOptions: 'Type to search...',
        business: 'Activit??',
      },
      orderStatus: {
        UNSCHEDULED: 'Non program??e',
        BOOKED: 'R??serv??e',
        COMPLETED: 'Compl??t??',
        CANCELED: 'Annul??',
        RESHOOT: 'Re-filmer',
      },
      daysOfWeek: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      welcomeWizard: {
        FOOD: {
          1: {
            title: 'S??ANCE PHOTO OFFERTE PAR {{companyName}}',
            content:
              '{{companyName}} a command?? une s??ance photo <strong>gratuite</strong> pour votre entreprise. Vous devez simplement r??server une date et une heure et r??fl??chir aux plats ?? pr??parer pour la s??ance.',
          },
          2: {
            title: 'CHOISIR UNE DATE ET UNE HEURE',
            content:
              'Nous vous invitons ?? choisir une date et une heure pour la s??ance photo command??e par {{companyName}} pour votre entreprise. Un photographe vous rendra visite ?? la date et ?? l???heure de votre choix pour prendre les photos.',
          },
          3: {
            title: 'VOUS POUVEZ REPROGRAMMER LA S??ANCE UNE FOIS',
            content:
              'La date ou l???heure de la s??ance command??e par {{companyName}} ne vous convient pas?<br /><br />Souvenez-vous que vous pouvez toujours reprogrammer votre s??ance UNE FOIS. Au-del??, vous devrez nous contacter directement pour modifier vos disponibilit??s.',
          },
          4: {
            title: 'NOTRE CHARTE ALIMENTAIRE',
            content:
              'Pr??parez-vous ?? cuisiner vos plats sur place durant toute la s??ance photo. Pr??parez les ingr??dients ?? l???avance, empilez vos assiettes pr??s de vous ??? tout ce qui peut faire gagner du temps au photographe et ?? vous-m??me ! Nous d??conseillons fortement de jeter les plats que vous avez pr??par??s. Pourquoi ne pas les offrir ?? l?????quipe, par exemple ? Ou en faire don aux associations de votre choix ?',
          },
          5: {
            title: 'DES R??SULTATS 100 % COH??RENTS',
            content:
              'Nous garantissons des contenus haut de gamme et coh??rents, conformes au cahier des charges d??fini ensemble. Que la s??ance photo ait lieu ?? Barcelone, Duba?? ou Denver, le r??sultat est toujours parfait!<br /><br /><strong>Consultez notre FAQ pour plus d???informations.</strong>',
          },
        },
        REAL_ESTATE: {
          1: {
            title: 'S??ANCE PHOTO OFFERTE PAR {{companyName}}',
            content:
              '{{companyName}} a command?? une s??ance photo gratuite pour votre entreprise. Il vous suffit de r??server une date et une heure et de pr??parer votre propri??t?? pour la s??ance.',
          },
          2: {
            title: 'CHOISIR UNE DATE ET UNE HEURE',
            content:
              'Nous vous invitons ?? choisir une date et une heure pour la s??ance photo command??e par {{companyName}} pour votre entreprise. Un photographe vous rendra ensuite visite ?? la date et ?? l???heure de votre choix pour prendre les photos.',
          },
          3: {
            title: 'VOUS POUVEZ REPROGRAMMER LA S??ANCE UNE FOIS',
            content:
              'La date ou l???heure de la s??ance command??e par {{companyName}} ne vous convient pas?<br /><br />Souvenez-vous que vous pouvez toujours reprogrammer votre s??ance UNE FOIS. Au-del??, vous devrez nous contacter directement pour modifier vos disponibilit??s.',
          },
          4: {
            title: 'NOS RECOMMANDATIONS',
            content:
              'Veillez ?? pr??parer les locaux pour la s??ance photo, conform??ment ?? nos recommandations (que vous d??couvrirez plus loin).',
          },
          5: {
            title: 'DES R??SULTATS 100 % COH??RENTS',
            content:
              'Nous garantissons des contenus haut de gamme et coh??rents, conformes au cahier des charges d??fini ensemble. Que la s??ance photo ait lieu ?? Barcelone, Duba?? ou Denver, le r??sultat est toujours parfait!<br /><br /><strong>Consultez notre FAQ pour plus d???informations.</strong>',
          },
        },
      },
      errorPage: {
        mainTitle: 'Ouuups, il y a eu un probl??me avec votre code de commande.',
        subTitle: 'Veuillez <contact-us>nous contacter</contact-us> pour r??server votre s??ance photo.',
      },
      confirmationPage: {
        congratulations: 'F??licitations!',
        bookingConfirmedFor: 'Votre r??servation est confirm??e pour le {{date}}/{{time}}.',
        bookingRescheduledAndConfirmedFor: 'Votre r??servation est modifi??e et confirm??e pour le {{date}}/{{time}}.',
        photographerWillCome:
          'Un photographe vous rendra visite le jour de la s??ance pour prendre les photos pendant environ  {{durationPhotoshoot}}.',
        dateAndTime: 'Date et heure',
        review: 'R??sum??',
        contact: 'Contact',
        yourBooking: 'Votre r??servation',
      },
      orderInfo: {
        yourPhotoshooting: 'Votre s??ance photo',
        shootingStatus: 'Statut de la s??ance photo',
        download: 'T??l??charger les photos',
        foodTip: {
          UNSCHEDULED:
            'R??fl??chissez aux plats ?? pr??parer pour la s??ance photo. R??servez une table vide pour la s??ance photo et placez-la dans un espace bien ??clair??.',
          BOOKED:
            'R??fl??chissez aux plats ?? pr??parer pour la s??ance photo. R??servez une table vide pour la s??ance photo et placez-la dans un espace bien ??clair??.',
          COMPLETED: 'Vos photos ont ??t?? envoy??es ?? {{companyName}}.',
          CANCELED: 'Votre s??ance a ??t?? annul??e.',
          RESHOOT: 'Votre commande n??cessite une autre s??ance.',
        },
        realEstateTip: {
          UNSCHEDULED: 'Veillez ?? ce que votre propri??t?? soit en ordre et pr??te pour la s??ance photo.',
          BOOKED: 'Veillez ?? ce que votre propri??t?? soit en ordre et pr??te pour la s??ance photo.',
          COMPLETED: 'Vos photos ont ??t?? envoy??es ?? {{companyName}}.',
          CANCELED: 'Votre s??ance a ??t?? annul??e.',
          RESHOOT: 'Votre commande n??cessite une autre s??ance.',
        },
        rescheduleTip: '*Vous pouvez modifier l???heure et la date une seule fois jusqu????? 24 heures avant la s??ance.',
        cannotRescheduleTip: 'Vous avez d??j?? reprogramm?? une fois.',
        almostStart: 'La s??ance photo commencera d???ici 24 heures',
        photosNumber: 'Photos',
        duration: 'Dur??e',
        dishesNumber: 'Plats',
        guidelines: 'Recommandations',
        chooseAnotherDate: 'Choisir une autre date',
        reschedule: '*Reprogrammer',
        needHelp: 'Besoin d???aide?',
        whoIsContactOnSite: 'Qui est la personne ?? contacter sur place ?',
        editContactOnSite: 'Modifier',
        nameSurname: 'Nom Pr??nom',
        phone: 'Num??ro de t??l??phone',
        additionalPhone: 'Num??ro de t??l??phone suppl??mentaire',
        email: 'Adresse email',
        business: 'Activit??',
        address: 'Adresse',
        businessName: 'Nom de l???entreprise',
        anyQuestions: 'Avez-vous des questions ?',
        boomLocationAndVatnumber: 'Corso Magenta 85, 20123, Milano MI / P.IVA 1234565432',
        dateAndTime: 'Date et heure',
        photoshootDuration: 'Dur??e de la s??ance photo',
      },
      editOrder: {
        editContact: 'Modifier le contact',
      },
      header: {
        aboutUs: '?? propos de nous',
        faq: 'Faq',
        logOut: 'D??connexion',
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
