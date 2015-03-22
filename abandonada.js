// abandonada.js
/*
 *      Abandonada
 *      (c) baltasarq@gmail.com MIT License
 *
 *      Aventura de texto en una casa abandonada.
 *
 */

ctrl.ponTitulo( "Abandonada" );
ctrl.ponIntro( "<p align='justify'>Como agente de Psico-investigaciones, \
                tu labor consiste en descartar \
                los rumores sobre el encantamiento de esta gran casa. \
                Así, tus clientes podr&aacute;n comprarla sin temor.</p>" );
ctrl.ponImg( "res/abandonada.png" );
ctrl.ponAutor( "Baltasarq" );
ctrl.ponVersion( "20150322" );

// Luz ----------------------------------------------------------------
Loc.prototype.luz = true;
Loc.prototype.hayLuz = function() {
        return ( this.luz || jugador.llevaLuz() );
}

// *** Locs --

var locExterior = ctrl.lugares.creaLoc(
    "Pequeño claro en el bosque",
    [ "claro", "bosque" ],
    "Frente a ti, una ${casa, ex casa} ha tenido mejores momentos, aunque \
    a&uacute;n se yergue como una especie de antiguo castillo. \
    Al ${oeste, oeste}, lo que queda \
    de un ${garaje, oeste} asoma entre la ${vegetación, ex vegetacion}. \
    Aqu&iacute; est&aacute tu ${furgoneta, ex furgoneta}."
);
locExterior.pic = "res/abandonada.png";

var objCasa = ctrl.creaObj(
        "casa",
        [ "edificio", "mansion", "palacio", "ruinas" ],
        "Se encuentra entre varios &aacute;rboles, hacia el ${sur, sur}. \
         No invita a adrentarse en su interior. Es comprensible que \
         circulen todo tipo de leyendas sobre estar encantada. La pinta, \
         con el abandono y el bosque a su alrededor, la tiene toda.",
        locExterior,
        Ent.Escenario
);

var objFurgona = ctrl.creaObj(
        "furgoneta",
        [ "furgoneta", "furgona", "van", "coche" ],
        "Tu furgoneta de trabajo, blanca con el logo en grandes letras \
        negras a lo largo del lateral trasero: 'Psico-investigaciones'.",
        locExterior,
        Ent.Escenario
);
objFurgona.ponContenedor();
objFurgona.arranque = 0;
objFurgona.preStart = function() {
    var toret = "";

    if ( objFurgona.arranque == 0 ) {
        toret = "Giras el contacto y... ¡no arranca! Parece como si se \
                 hubiera quedado sin batería... ¡y has tardado como media \
                 hora desde la carretera aquí!";
        objFurgona.arranque = 1;
    } else {
        toret = "Vuelves a girar el contacto... no hay nada que hacer.";
    }

    return toret;
}

objFurgona.preShutdown = function() {
    return "Para eso, deber&iacute;a intentar arrancarla... ¡y no lo hace!";
}

objFurgona.prePush = function() {
    return "¿La media hora de camino hasta aqu&iacute;? Si a&uacute;n \
            hubiera una cuesta abajo... pero no la hay.";
}

objFurgona.preAttack = function() {
    return "Le das una buena patada en una de las ruedas. Te sientes un poco mejor.";
}

objFurgona.preOpen = function() {
    return "Ya est&aacute; abierto.";
}

objFurgona.preExamine = function() {
    var toret = objFurgona.desc;

    if ( ctrl.lugares.limbo.has( objMaletero ) ) {
        objMaletero.mueveA( locExterior );
        toret += " En la parte trasera está el portón del ${maletero, ex maletero}.";
    }

    return toret
            + " Pegado al parabrisas, puedes ver un ${portapapeles, ex portapapeles}.";
}

var objMaletero = ctrl.creaObj(
        "maletero",
        [ "maletero", "porton" ],
        "El maletero de la furgoneta: se accede a través de un portón.",
        ctrl.lugares.limbo,
        Ent.Escenario
);
objMaletero.ponContenedor();
objMaletero.cerrado = true;

objMaletero.preOpen = function() {
    var toret = "";

    if ( objMaletero.cerrado ) {
        toret = "Lo has abierto.";
        objMaletero.cerrado = false;
    } else {
        toret = "Ya estaba abierto.";
    }

    return toret;
}

objMaletero.preClose = function() {
    var toret = "Mejor queda abierto, por si hace falta algo más.";

    if ( objMaletero.cerrado ) {
        toret = "Pero si ya está cerrado...";
    }

    return toret;
}

objMaletero.preExamine = function() {
    if ( objMaletero.cerrado ) {
        return objMaletero.desc;
    } else {
        if ( ctrl.lugares.limbo.has( objLinterna ) ) {
            objLinterna.mueveA( objMaletero );
            objAceite.mueveA( objMaletero );
        }

        return examineAction.exe( parser.sentence );
    }

    return;
}

var objAceite = ctrl.creaObj(
        "aceite",
        [ "aceite", "desengrasante", "bote" ],
        "Pues sí, un bote de aceite desengrasante.",
        ctrl.lugares.limbo,
        Ent.Portable
);

var objLinterna = ctrl.creaObj(
        "linterna",
        [ "linterna", "lampara" ],
        "Pues sí, una linterna, ",
        ctrl.lugares.limbo,
        Ent.Portable
);
objLinterna.encendida = false;
objLinterna.preStart = function() {
    var toret = "Pulsas el interruptor de la linterna.";

    if ( !objLinterna.encendida ) {
        toret += " Ahora está encendida.";
        objLinterna.encendida = true;
    } else {
        toret += " Ya estaba encendida.";
    }

    return toret;
}

objLinterna.preShutdown = function() {
    var toret = "Pulsas el interruptor de la linterna.";

    if ( objLinterna.encendida ) {
        toret += " Ahora está apagada.";
        objLinterna.encendida = false;
    } else {
        toret += " Ya estaba apagada.";
    }

    return toret;
}

objLinterna.preExamine = function() {
    var toret = objLinterna.desc;

    if ( objLinterna.encendida ) {
        toret += "encendida.";
    } else {
        toret += "apagada.";
    }

    return toret;
}

var objVegetacion = ctrl.creaObj(
        "vegetación",
        [ "vegetacion", "arboles", "arbustos", "arbol", "arbusto",
          "verdin", "musgo", "enredaderas", "enredadera" ],
        "Demasiados arbustos y árboles, húmedos y frondosos, rodeándote.",
        locExterior,
        Ent.Escenario
);

objCasa.preEnter = function() {
    action.execute( "go", "s" );
}

var objPortapapeles = ctrl.creaObj(
        "portapapeles",
        [ "papeles", "porta", "documentos", "parabrisas", "ventosa" ],
        "Pegado al parabrisas mediante una ventosa, un portapapeles sujeta \
        los términos de tu misión: descartar embrujamientos, encantamientos, \
        y cualquier tipo de fantasmas, en general, de esta propiedad.",
        objFurgona,
        Ent.Escenario
);


var locGaraje = ctrl.lugares.creaLoc(
    "Garaje derruído",
    [ "garaje", "ruinas" ],
    "Al ${este, este} se encuentra la explanada junto a la casa. \
     El garaje ha pasado definitivamente días mejores: los arbustos lo \
     han invadido todo, junto con el musgo y las enredaderas. \
     Parece como si hubiera querido devorar el ${coche, ex coche} en su \
     ya verde interior."
);
locGaraje.objs.push( objVegetacion );
locGaraje.pic = "res/coche.jpg";
locGaraje.ponSalidaBi( "este", locExterior );


var objCoche = ctrl.creaObj(
        "coche",
        [ "coche", "citroen", "ds", "puerta", "portezuela" ],
        "Probablemente un Citröen DS. Bueno, lo que quedaría de él, si \
        pudieses quitar el musgo y el verdín.",
        locGaraje,
        Ent.Escenario
);

objCoche.prePush = function() {
    return "Eso no hay ya quien lo mueva del sitio.";
}

objCoche.preAttack = function() {
    return "Ya est&aacute; hecho polvo...";
}

objCoche.preStart = function() {
    return "Sí, claro.";
}

objCoche.preShutdown = function() {
    return "¡Si ni siquiera va a arrancar!";
}

objCoche.abierto = false;
objCoche.preOpen = function() {
    var toret = "";

    if ( !objCoche.abierto ) {
        toret = "Con dificultad, tiras de la portezuela y... sorprendentemente \
            esta cede con un chirrido.";
        objCoche.abierto = true;
    } else {
        toret = "Est&aacute; abierto.";
    }

    return toret;
}

objCoche.preClose = function() {
    var toret =  "La portezuela tiene pinta de caerse encima de tu pie si te \
            dedicas a moverla más.";


    if ( !objCoche.abierto ) {
        toret = "Pero si ya está cerrado...";
    }

    return toret;
}

objLlaves =  ctrl.creaObj(
        "llaves",
        [ "llaves", "llave" ],
        "Herrumbosas llaves. Parece que hay más aparte de las del coche.",
        ctrl.lugares.limbo,
        Ent.Portable
);

objCoche.ponContenedor();
objCoche.preExamine = function() {
    var toret = objCoche.desc;

    if ( objCoche.abierto
      && ctrl.lugares.limbo.has( objLlaves ) )
    {
        objLlaves.mueveA( objCoche );
        toret += " En su interior puedes ver unas ${llaves, coge llaves}.";
    }

    return toret;
}

locPorche = ctrl.lugares.creaLoc(
    "Entrada a la casa",
    [ "entrada", "porche" ],
    "La desvencijada ${puerta, ex puerta} preside la entrada de la casa, \
     que está que se cae."
);
locPorche.pic = "res/entrada.jpg";
locPorche.ponSalidaBi( "norte", locExterior );

var objPuerta = ctrl.creaObj(
        "puerta",
        [ "porton", "hoja", "marco" ],
        "Hecha polvo. La hoja está abierta.",
        locPorche,
        Ent.Escenario
);

objPuerta.preClose = function() {
    return "Nadie podría volver a hacerla encajar en el marco.";
}

objPuerta.preOpen = function() {
    return "Tiras un poco de ella... nah, ya está tan abierta como es posible.";
}

objPuerta.preAttack = function() {
    return "Tus golpes rebotan contra la podrida puerta, inútilmente.";
}

objPuerta.prePush = function() {
    return actions.execute( "close", "puerta" );
}

objPuerta.prePull = function() {
    return actions.execute( "open", "puerta" );
}

locCocina = ctrl.lugares.creaLoc(
    "Cocina",
    [ "habitacion", "sala", "estancia" ],
    "Una cocina llena de ${cascotes, ex cascotes}. La luz entra por un \
     par de ${ventanas, ex ventanas}, que alegran una estancia un tanto \
     desolada. Una ${despensa, ex despensa}, una ${encimera, ex encimera} \
     con ${horno, ex horno}, y un ${radiador, ex radiador} es lo \
     poco que queda en pie."
);
locCocina.pic = "res/cocina.jpg";
locCocina.ponSalidaBi( "norte", locPorche );

var objCascotes = ctrl.creaObj(
	"cascotes",
	[ "cascotes", "piedras", "piedra", "cemento", "yeso" ],
	"Cascotes de todo tipo, piedras, cemento trozos de yeso... lo que \
     el tiempo ha ido arrancando de techo y paredes.",
    locCocina,
	Ent.Escenario
);

objVentanas = ctrl.creaObj(
	"ventanas",
	[ "ventana", "ventanuco" ],
	"Un par de ventanas permiten que entre la luz del exterior. Bueno, \
     en realidad, el techo también lo permite.",
    locCocina,
	Ent.Escenario
);

objRadiador = ctrl.creaObj(
	"radiador",
	[ "calefactor", "valvula", "llave" ],
	"Un viejo radiador, probablemente calentado por agua. Quizás la \
     caldera aún se pueda encontrar en algún sitio, pero seguro que \
     está inservible.",
    locCocina,
	Ent.Escenario
);

objRadiador.preStart = function() {
    return "Giras la válvula, aún sabiendo que no tendrá ningún efecto.";
}

objRadiador.preShutdown = function() {
    return actions.execute( "start", "radiador" );
}

objEncimera = ctrl.creaObj(
	"encimera",
	[ "mesado" ],
	"Una vieja y rota encimera de mármol blanco.",
    locCocina,
	Ent.Escenario
);

objHorno = ctrl.creaObj(
	"horno",
	[ "mando", "mandos", "portezuela", "porton" ],
	"El viejo horno aún tiene los mandos y la portezuela, pero poco \
     más. Falta toda la instalación de gas, aunque, ¿quién sabe?, puede \
     haber sido eléctrico.",
    locCocina,
	Ent.Escenario
);

objHorno.preOpen = function() {
    return "Tiras con todas tus fuerzas, pero... ¡no se abre!";
}

objHorno.prePull = function() {
    return actions.execute( "open", "horno" );
}

objHorno.preStart = function() {
    return "Ni de broma va a volver esto a la vida.";
}

objHorno.preShutdown = function() {
    return actions.execute( "start", "horno" );
}

locEscalerasInteriores = ctrl.lugares.creaLoc(
    "Escaleras interiores",
    [ "escaleras" ],
    "Unas escaleras."
);
locEscalerasInteriores.pic = "res/escaleras_interiores.jpg";
locEscalerasInteriores.ponSalidaBi( "norte", locCocina );

locSalon = ctrl.lugares.creaLoc(
    "Salón",
    [ "salon", "sala", "habitacion", "estancia" ],
    "Las ${ventanas, ex ventanas} iluminan un salón en franca \
     decadencia. Algunos ${cascotes, ex cascotes}, \
     ${papeles, ex papeles} por el suelo, un mohoso ${sofá, ex sofa}, \
     una vieja ${silla de ruedas, ex silla} \
     e incluso un viejo ${baúl, ex caja}, son el triste reflejo de lo \
     que un día debieron ser. La lejanía de la carretera sin duda ha \
     evitado que estas cosas desaparecieran completamente, aunque hoy \
     ya no tienen valor."
);
locSalon.pic = "res/salon.jpg";
locSalon.ponSalidaBi( "norte", locEscalerasInteriores );
locSalon.objs.push( objCascotes );
locSalon.objs.push( objVentanas );

var objSofa = ctrl.creaObj(
	"sofá",
	[ "sofa", "tresillo", "sillon" ],
	"El sofá ha visto, sin duda, mejores días. Podrido y mohoso, \
     no invita ni a sentarse ni a hacer nada con él.",
    locSalon,
	Ent.Escenario
);

var objGuante = ctrl.creaObj(
	"guante",
	[ "guante" ],
	"Está asqueroso de podrido y miserable.",
    locSalon,
	Ent.Portable
);

objGuante.ponPrenda();
objGuante.preTake = function() {
    return "Pero si está asqueroso... mejor lo dejo donde está.";
}

objGuante.preWear = function() {
    return "Que no, que no, ¡qué asco!... yo no me pongo eso.";
}

var objSillaRuedas = ctrl.creaObj(
	"silla",
	[],
	"Está sucia y asquerosa, como todo por aquí.",
    locSalon,
	Ent.Escenario
);

objSillaRuedas.prePull = function() {
    return "Está tan mohosa y oxidada que ni se mueve.";
}

objSillaRuedas.prePush = function() {
    return actions.execute( "pull", "silla" );
}

var objPapeles = ctrl.creaObj(
	"papeles",
	[ "papel", "páginas", "página" ],
	"Papeles de todo tipo: antiguas facturas, páginas de viejos libros... inservibles.",
    locSalon,
	Ent.Escenario
);

var objCaja = ctrl.creaObj(
    "baúl",
	[ "caja", "baul" ],
	"Un pequeño baúl, hecho polvo, como todo por aquí.",
    locSalon,
	Ent.Escenario
);
objCaja.abierta = false;
objCaja.ponContenedor();

objCaja.preOpen = function() {
    var toret = "";

    if ( !objCaja.abierta ) {
        toret = "Abres el baúl, levantando la tapa... todo se llena de polvo.";
        objCaja.abierta = true;
    } else {
        toret = "Est&aacute; abierto.";
    }

    return toret;
}

objCaja.preClose = function() {
    var toret = "¿Para qué? Quizás se rompa si lo vuelves a manipular.";

    if ( !objCaja.abierta ) {
        toret = "Ya está cerrado.";
    }

    return toret;
}

objCaja.preExamine = function() {
    var toret = objCaja.desc;

    if ( objCaja.abierta ) {
        if ( ctrl.lugares.limbo.has( objBarra ) ) {
            objBarra.moveTo( objCaja );
        }

        toret = examineAction.exe( parser.sentence );
    }

    return toret;
}

objEnredaderas = ctrl.creaObj(
	"enredaderas",
	[ "enredadera", "vegetacion" ],
	"Varias enredaderas se descuelgan de un agujero en el techo.",
    locSalon,
	Ent.Escenario
);

var objBarra = ctrl.creaObj(
	"barra",
	[ "barra", "hierro", "cayado" ],
	"Una barra de hierro, pesada y oxidada.",
    ctrl.lugares.limbo,
	Ent.Portable
);

// --- Jugador ---------------------------------------------------------
var jugador = ctrl.personas.creaPersona( "Alguien",
                    [ "hombre", "agente", "anacleto" ],
                    "Anacleto, agente de psico-investigaciones.",
                    locExterior
);

jugador.llevaLuz = function() {
        return ( jugador.has( objLinterna ) && objLinterna.encendida );
}

var objBrujula = ctrl.creaObj(
	"brújula",
	[ "compas", "brujula", "reloj" ],
	"Tu fiable reloj con br&uacute;jula.",
    jugador,
	Ent.Portable
);

var objMovil = ctrl.creaObj(
	"móvil",
	[ "telefono", "movil", "celular", "motorola" ],
	"Tu recién adquirido Motorola. Indica que no hay cobertura.",
    jugador,
	Ent.Portable
);

objMovil.preDrop = function() {
    return "De eso, nada. Quinientos y pico mil puntos que te costó. \
            Y eso que no tiene ni cámara.";
}

objMovil.preTalk = function() {
    return "Ni Siri, ni Cortana, ni un mísero asistente sin nombre... nada.";
}

objMovil.preAttack = function() {
    objMovil.mueveA();
    return "Frustrado, lo rompes en mil pedazos lanzándolo con todas tus \
            fuerzas contra el suelo. En fin, ahí van quinientos y pico mil \
            puntos...";
}

objMovil.preStart = function() {
    return "Ya está encendido, solo que no hay cobertura.";
}

objMovil.preShutdown = function() {
    return "No veo para qué...";
}

objBrujula.preAttack = function() {
    return "No te atreves, es demasiado útil.";
}

objBrujula.preStart = function() {
    return "Siempre está encendida, no es necesario.";
}

objBrujula.preShutdown = function() {
    return "Como no le saque la pila... además, ¡me perdería!";
}

objBrujula.preDrop = function() {
    return "No puedes hacer eso: necesitas orientarte.";
}

objBrujula.preExamine = function() {
    var loc = ctrl.lugares.devLocActual();
    return objBrujula.desc + " " + actions.getAction( "exits" ).exe();
}

// Arranque ------------------------------------------------------------
ctrl.personas.cambiaJugador( jugador );
ctrl.lugares.ponInicio( locExterior );
