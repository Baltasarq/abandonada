// abandonada.js
/*
 *      Abandonada
 *      (c) baltasarq@gmail.com MIT License
 *
 *      Aventura de texto en una casa abandonada.
 *
 */

ctrl.ponTitulo( "Abandonada" );
ctrl.ponIntro( "Como agente de Psico-investigaciones, \
                tu labor consiste en descartar \
                los rumores sobre el encantamiento de esta gran casa. \
                Así, tus clientes podr&aacute;n comprarla sin temor." );
ctrl.ponImg( "res/abandonada.jpg" );
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
locExterior.pic = "res/abandonada.jpg";

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
        [ "furgoneta", "furgona", "van", "coche", "barro" ],
        "Tu furgoneta de trabajo, blanca con el logo en grandes letras \
        negras a lo largo del lateral trasero: 'Psico-investigaciones'. \
        El trayecto hasta aquí ha teñido los bajos de barro.",
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
    var toret = "Has pulsado el interruptor de la linterna.";

    if ( !objLinterna.encendida ) {
        toret += " Ahora está encendida.";
        objLinterna.encendida = true;

        // Redescribe
        acciones.ejecuta( "look" );
	parser.sentencia.obj1 = objLinterna;
    } else {
        toret += " Ya estaba encendida.";
    }

    return toret;
}

objLinterna.preShutdown = function() {
    var toret = "Has pulsado el interruptor de la linterna.";

    if ( objLinterna.encendida ) {
        toret += " Ahora está apagada.";
        objLinterna.encendida = false;

        // Redescribe
        acciones.ejecuta( "look" );
	parser.sentencia.obj1 = objLinterna;
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
     La humedad provoca una fuerte sensación de frío y desamparo. \
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

    if ( objCoche.abierto ) {
		if ( ctrl.lugares.limbo.has( objLlaves ) ) {
			objLlaves.mueveA( objCoche );
		}

        toret = examineAction.exe( parser.sentence );
    }

    return toret;
}

locPorche = ctrl.lugares.creaLoc(
    "Entrada a la casa",
    [ "entrada", "porche" ],
    "La desvencijada ${puerta, ex puerta} preside la entrada de la casa, \
     que está que se cae. Las ${paredes, ex paredes} han perdido el \
     color debido al paso del tiempo, y del ${tejadillo, ex tejadillo} \
     faltan muchas de tejas. El aspecto en general es \
     lamentable."
);
locPorche.pic = "res/entrada.jpg";
locPorche.ponSalidaBi( "norte", locExterior );
locPorche.visitas = 0;
locPorche.preLook = function() {
	var toret = locPorche.desc;

	++locPorche.visitas;
	if ( locPorche.visitas < 3 ) {
		toret += " Supones que tus clientes habrán de tener mucho \
				  dinero y paciencia para permitirse invertir aquí y, \
				  con mucho tiempo, tornarlo habitable."
	}

	return toret;
}

var objTejadillo = ctrl.creaObj(
        "tejadillo",
        [ "tejadillo", "tejas", "tejas" ],
        "El tejadillo del porche ha perdido buena parte de sus tejas.",
        locPorche,
        Ent.Escenario
);

var objParedes = ctrl.creaObj(
        "pared",
        [ "paredes", "pared", "muros", "muro", "ladrillos", "ladrillo",
          "pintura", "moho", "musgo", "musgos" ],
        "Las paredes han perdido la pintura, se ven desconchones aquí \
         y allá. En muchos incluso se aprecia el ladrillo. En todas \
         partes, manchas verdes de moho, a veces incluso con pequeños \
         tapetes de musgo, salpican la superficie.",
        locPorche,
        Ent.Escenario
);

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
    "Una cocina asolada y llena de ${cascotes, ex cascotes}. La luz entra por un \
     par de ${ventanas, ex ventanas}, que alegran un tanto una estancia tan devastada. \
     Una ${despensa, ex despensa}, una ${encimera, ex encimera} \
     con ${horno, ex horno}, y un ${radiador, ex radiador} es lo \
     poco que queda en pie."
);
locCocina.pic = "res/cocina.jpg";
locCocina.ponSalidaBi( "norte", locPorche );
locCocina.objs.push( objParedes );

var objCascotes = ctrl.creaObj(
	"cascotes",
	[ "cascotes", "piedras", "piedra", "cemento", "yeso" ],
	"Cascotes de todo tipo, piedras, cemento trozos de yeso... lo que \
     el tiempo ha ido arrancando de techo y paredes.",
    locCocina,
	Ent.Escenario
);

var objDespensa = ctrl.creaObj(
	"despensa",
	[ "estanterias", "estantes", "estante", "cuarto", "cuartito" ],
	"En la despensa no hay nada, excepto polvo sobre los estantes.",
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

objVentanas.preAttack = function() {
	return "Tienen un enrejado de hierro muy fuerte, sería fútil.";
}

objVentanas.prePush = function() {
	return actions.execute( "attack", "ventana" );
}

objVentanas.prePull = function() {
	return actions.execute( "attack", "ventana" );
}

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

var locEscalerasInteriores = ctrl.lugares.creaLoc(
    "Escaleras interiores",
    [ "escaleras", "peldanos", "escalera", "peldano" ],
    "Las escaleras permiten ${subir, sube} a la primera planta, y \
     ${bajar, baja} al sótano. Allá abajo todo está oscuro, la luz parece \
     incapaz de penetrar las profundidades. \
     Por otra parte, en el piso superior \
     es como si entrara la luz a raudales. Mientras la \
     barandilla es de madera, los peldaños están hechos de \
     cemento, que se muestra muy húmedo y mohoso."
);
locEscalerasInteriores.pic = "res/escaleras_interiores.jpg";
locEscalerasInteriores.ponSalidaBi( "norte", locCocina );
locEscalerasInteriores.objs.push( objParedes );

locDesvan = ctrl.lugares.creaLoc(
    "Desván",
    [ "desvan", "piso", "estancia", "habitacion" ],
    "El desván de esta gran casa, donde se acumulan todo tipo de \
     ${muebles, ex muebles}. Desde aquí unas ${escaleras, ex escaleras} \
     permiten ${descender, baja} \
     a la parte inferior de la casa. El hogar de una gran \
     ${chimenea, ex chimenea} ocupa la totalidad de la pared que no \
     está cubierta por ${muebles, ex muebles}. Cerca del hogar, hay \
     una ${estufa, ex estufa}, y en la pared lateral, una \
     ${ventana, ex ventana}. La polvorienta estancia está llena de \
     telas de araña, y supones que en cualquier rincón puede haber un \
     nido de todo tipo de bichos."
);
locDesvan.pic = "res/desvan.jpg";
locDesvan.ponSalidaBi( "abajo", locEscalerasInteriores );
locDesvan.objs.push( objParedes );

var objMuebles = ctrl.creaObj(
	"muebles",
	[ "mueble", "mesas", "mesa", "sillas", "silla" ],
	"Todo tipo de muebles, podridos e inservibles.",
    locDesvan,
	Ent.Escenario
);

var objChimenea = ctrl.creaObj(
	"chimenea",
	[ "hogar", "tiro" ],
	"El gran hueco negro del hogar. En la parte superior, un agujero \
	 permite acceder al tiro de la misma, que va hacia arriba y hacia \
	 abajo.",
    locDesvan,
	Ent.Escenario
);

objChimenea.ponContenedor();
objChimenea.preExamine = function() {
	if ( ctrl.lugares.limbo.has( objPiedra ) ) {
		objPiedra.mueveA( objChimenea );
	}

	return examineAction.exe( parser.sentence );
}

objChimenea.preStart = function() {
	return "¿Para qué? Ni que hiciera frío...";
}

objChimenea.preShutdown = function() {
	return "Ahora mismo está apagada.";
}

var objEstufa = ctrl.creaObj(
	"estufa",
	[ "caldera" ],
	"Hoy por hoy, de la estufa solo queda un extraño cilindro de \
	 hierro. Oxidado, como no.",
    locDesvan,
	Ent.Escenario
);

objEstufa.preExamine = function() {
	var toret = objEstufa.desc;

	if ( objEstufa.abierta ) {
		toret = "La tapa está abierta. ";
		toret += examineAction.exe( parser.sentence );
	} else {
		toret += " La tapa está cerrada.";
	}

	return toret;
}

objEstufa.preOpen = function() {
	var toret = "Ya estaba abierta.";

	if ( !objEstufa.abierta ) {
		objEstufa.abierta = true;
		toret = "Abres la estufa.";
	}

	return toret;
}

objEstufa.preStart = function() {
	return "Está hecha polvo, no tengo leña, y además, no hace frío.";
}

objEstufa.preShutdown = function() {
	return "La estufa está igual que la chimenea: apagada.";
}

var objEscaleras = ctrl.creaObj(
	"escaleras",
	[ "escalera", "hueco" ],
	"Las escaleras permiten ${descender, baja} hacia el bajo.",
	locDesvan,
	Ent.Escenario
);

objEscaleras.preDescend = function() {
	return actions.execute( "Go", "abajo" );
}

var objVentana = ctrl.creaObj(
	"ventana",
	[ "ventana" ],
	"Una gran ventana permite el paso de la luz.",
	locDesvan,
	Ent.Escenario
);

objVentana.preAttack = function() {
	return "Tiene un enrejado de hierro muy fuerte, sería fútil.";
}

objVentana.prePush = function() {
	return actions.execute( "attack", "ventana" );
}

objVentana.prePull = function() {
	return actions.execute( "attack", "ventana" );
}

var objPiedra = ctrl.creaObj(
	"piedra",
	[ "canto", "ladrillo" ],
	"Pues sí, una piedra. Concretamente, un antiguo ladrillo de la chimenea.",
	ctrl.lugares.limbo,
	Ent.Portable
);

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
locSalon.objs.push( objParedes );

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

objGuante.preAttack = function() {
    return "Entre el polvo acumulado dentro del guante, y el que hay \
			por fuera de él, se ha montado una nube de polvo que tarda \
			aún un buen rato en disiparse.";
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

objEnredaderas.prePull = function() {
	return "Nah, me llenaría la cabeza de bichos, y para nada.";
}

var objBarra = ctrl.creaObj(
	"barra",
	[ "barra", "hierro", "cayado" ],
	"Una barra de hierro, pesada y oxidada.",
    ctrl.lugares.limbo,
	Ent.Portable
);

var locSotano = ctrl.lugares.creaLoc(
    "Sótano",
    [ "sotano", "bodega", "estancia", "habitacion" ],
    "Las ${escaleras, ex escaleras} permiten ${subir, sube} a la \
     planta baja. Aquí la sensación de humedad \
     es mucho más marcada que antes, y está \
     bastante oscuro. En el extremo más alejado de las escaleras, al \
     ${este, e}, hay una ${puerta, ex puerta}."
);
locSotano.pic = "res/puerta.jpg";
locSotano.ponSalidaBi( "arriba", locEscalerasInteriores );
locSotano.objs.push( objParedes );

locSotano.preGo = function() {
	var toret = "";
	var sentencia = parser.sentence;

	if ( sentencia.term1 == "este" ) {
		if ( !objPuertaSotano.abierta ) {
			toret = "La puerta está cerrada, no puedes seguir.";
		} else {
			toret = goAction.exe( sentencia, locSotano );
		}
	} else {
		toret = goAction.exe( sentencia, locSotano );
	}

	return toret;
}

var objEscalerasSotano = ctrl.creaObj(
	"escaleras",
	[ "escalera", "hueco" ],
	"Las escaleras permiten ${subir, sube} a la planta baja.",
	locSotano,
	Ent.Escenario
);

objEscalerasSotano.preClimb = function() {
	return actions.execute( "go", "arriba" );
}

var objPuertaSotano = ctrl.creaObj(
	"puerta",
	[ "hoja" ],
	"Una puerta blanca, bastante sucia.",
	locSotano,
	Ent.Escenario
);
objPuertaSotano.abierta = false;
objPuertaSotano.preExamine = function() {
	var toret = objPuertaSotano.desc;

	if ( objPuertaSotano.abierta ) {
		toret += " Está abierta.";
	} else {
		toret += " Está cerrada.";
	}

	return toret;
}

objPuertaSotano.preOpen = function() {
	var toret = "Ya estaba abierta.";

	if ( !objPuertaSotano.abierta ) {
		if ( ctrl.isPresent( objLlaves ) ) {
			if ( ctrl.isPresent( objAceite ) ) {
				toret = "Hechas un poco de aceite sobre la llave, y \
						  la introduces en la cerradura, consiguiendo \
						  hacerla girar suavemente.";
				objPuertaSotano.abierta = true;
			} else {
				toret = "La llave no gira, hace mucho que esta cerradura \
						 no se usa.";
			}
		} else {
			toret = "No se abre, está cerrada con llave.";
		}
	}

	return toret;
}

objPuertaSotano.prePull = function() {
	var toret = "";

	if ( objPuertaSotano.abierta ) {
		toret = "La puerta se mueve con bastante suavidad.";
	} else {
		toret = "Está cerrada, no basta con tirar.";
	}

	return toret;
}

objPuertaSotano.preClose = function() {
	var toret = "Ya estaba cerrada.";

	if ( objPuertaSotano.abierta ) {
		toret = "Empujas la puerta hasta que se cierra.";
		objPuertaSotano.abierta = false;
	}

	return toret;
}

objPuertaSotano.prePush = function() {
	actions.execute( "close", "puerta" );
}

var locPasillo = ctrl.lugares.creaLoc(
    "Pasillo",
    [ "pasaje", "subterraneo" ],
    "El pasillo se interna en la oscuridad. En el extremo \
     ${oeste, o}, hay una ${puerta, ex puerta}."
);

locPasillo.luz = false;
locPasillo.visitasConLuz = 0;
locPasillo.ponSalidaBi( "oeste", locSotano );
locPasillo.objs.push( objParedes );

locPasillo.preLook = function() {
	var toret = locPasillo.desc;

	if ( locPasillo.hayLuz() ) {
		locPasillo.visitasConLuz += 1;
		locPasillo.pic = "res/trampilla.jpg";
		objEscalerasTrampilla.mueveA( locPasillo );
		toret += " Debajo, en el suelo, hay unos \
				  ${peldaños, ex escaleras} que permiten \
				  ${continuar bajando, baja}.";

		if ( locPasillo.visitasConLuz < 3 ) {
			toret += " Está realmente oscuro, por eso no los habías \
					  visto antes. Podías haberte matado.";
		}
	} else {
		locPasillo.pic = null;
		objEscalerasTrampilla.mueveA();
		toret += " Está amedrantemente oscuro.";
	}

	return toret;
}

locPasillo.preGo = function(s) {
	var toret = "";

	if ( locPasillo.hayLuz()
	  || parser.sentencia.term1 == "oeste" )
	{
		toret = goAction.exe( parser.sentencia );
	} else {
		toret = "No, no, está muy oscuro, no veo nada. Necesito luz.";
	}

	return toret;
}

var objPuertaSotanoFalsa = ctrl.creaObj(
	"puerta",
	[ "hoja" ],
	"Una puerta blanca, bastante sucia. Está abierta.",
	locPasillo,
	Ent.Escenario
);

var objEscalerasTrampilla = ctrl.creaObj(
	"escaleras",
	[ "peldanos", "escalera", "escalones", "escalon", "polvo",
	  "piedras", "piedra", "suciedad" ],
	"Unos peldaños polvorientos permiten ${bajar, baja}.",
	locPasillo,
	Ent.Escenario
);

objEscalerasTrampilla.preExamine = function() {
	var toret = "";

	if ( ctrl.lugares.getCurrentLoc() == locPasillo ) {
		toret = "Unos peldaños permiten ${bajar, baja}.";
	} else {
		toret = "Unos peldaños permiten ${subir, sube}.";
	}

	return toret;
}


objEscalerasTrampilla.preDescend = function() {
	return acciones.ejecuta( "Go", "abajo" );
}

objEscalerasTrampilla.preClimb = function() {
	return acciones.ejecuta( "Go", "arriba" );
}

var locPasillo2 = ctrl.lugares.creaLoc(
    "Pasillo",
    [ "pasaje", "subterraneo" ],
    "El pasillo se extiende de ${oeste, oeste} a ${este, este}. \
     En el extremo oeste, hay unos ${peldaños de piedra, ex escaleras} \
     que permiten ${subir, sube}."
);

locPasillo2.luz = false;
locPasillo2.ponSalidaBi( "arriba", locPasillo );
locPasillo2.objs.push( objParedes );
locPasillo2.objs.push( objEscalerasTrampilla );

locPasillo2.preLook = function() {
	var toret = locPasillo2.desc;

	if ( !locPasillo2.hayLuz() ) {
                locPasillo2.pic = null;
		ctrl.irA( locPasillo );
		toret = "Has retrocedido asustado ante la falta de luz, y \
					como has podido, a tientas, has subido los peldaños \
					para volver a la estancia anterior.\
                                        <br />";
		toret += locPasillo.desc;
	} else {
		locPasillo2.pic = "res/pasillo-oscuro.jpg";
	}

	return toret;
}

var locPasilloEscaleraExterior = ctrl.lugares.creaLoc(
    "Escalera al exterior",
    [ "pasaje", "subterraneo" ],
    "El pasillo se extiende de ${oeste, oeste} a ${este, este}, \
     donde se aprecia una clara luz que parece provenir directamente \
     del exterior. En el extremo este, \
     hay unos ${peldaños de piedra, ex escaleras} \
     que permiten ${subir, sube}."
);

locPasilloEscaleraExterior.luz = true;
locPasilloEscaleraExterior.pic = "res/escalera_exterior.jpg";
locPasilloEscaleraExterior.objs.push( objParedes );
locPasilloEscaleraExterior.objs.push( objEscalerasTrampilla );
locPasilloEscaleraExterior.ponSalidaBi( "oeste", locPasillo2 );

var locEmbarcadero = ctrl.lugares.creaLoc(
    "Embarcadero",
    [ "casa", "colina", "salida", "subterraneo", "tunel" ],
    "Un pequeño embarcadero se sitúa en perpendicular al subterráneo, paralelo \
     a la casa que adivinas por encima de la colina tras la salida \
     al ${oeste, oeste}. Las verdes aguas de un pantano se abren frente a ti, \
     brumosas y húmedas. Pequeños crujidos acompañan al monótono, \
     casi inexistente oleaje."
);

locEmbarcadero.pic = "res/pantano.jpg";
locEmbarcadero.llegaronNarcos = false;
locEmbarcadero.ponSalidaBi( "oeste", locPasilloEscaleraExterior );
locEmbarcadero.ponSalidaBi( "abajo", locPasilloEscaleraExterior );

locEmbarcadero.preLook = function() {
    var toret = locEmbarcadero.desc;

    if ( ctrl.personas.getPlayer().has( objLinterna )
      && objLinterna.encendida )
    {
        acciones.ejecuta( "shutdown", "linterna" );
        toret += "<p>Al notar que llevas la linterna encendida, \
				  decides apagarla.</p>";
    }

    if ( !this.llegaronNarcos ) {
  		this.llegaronNarcos = true;
  		ctrl.ponAlarma( 3, function() {
  			ctrl.print( "Un ruido lejano de un motor, que cada vez se acerca más \
                     y más te saca de tu ensimismamiento... ¡una lancha se \
                     aproxima por el río!" );
        ctrl.ponDaemon( "mueveNarcos", mueveNarcos );
  		});
	}

    return toret;
}

var objEmbarcadero = ctrl.creaObj(
	"muelle",
	[ "desembarcadero", "atracadero", "apeadero" ],
	"Sucio, húmedo y mohoso, parece un milagro que se mantenga en pie.",
	locEmbarcadero,
	Ent.Escenario
);

var locCurvaPantano = ctrl.lugares.creaLoc(
    "Curva del pantano",
    [ "curva", "pantano" ],
    "El lecho de un río aparece enmarcado por la vegetación irregular. Las \
    verdosas aguas del pantano fluyen en una curva de $oeste, oeste a $este, \
    este."
);

// PNJ's
function mueveNarcos() {
  var narcos = [ narco1, narco2, narco3 ];

  for(var i = 0; i < narcos.length; ++i) {
    var narco = narcos[ i ];
    narco.pos += 1;

    if ( narco.pos < narco.recorrido.length ) {
      var narcoLoc = narco.recorrido[ narco.pos ];

      narco.mueveA( narcoLoc );
      ctrl.print( narco.id + " llega a " + narcoLoc.id );
    }

    return;
  }

  return;
}

var narco1 = ctrl.personas.creaPersona( "Carlos",
                    [ "criminal", "narco" ],
                    "Un narcotraficante, aunque parece más un guardaespaldas \
                     asesino.",
                    ctrl.lugares.limbo
);
narco1.pos = -1;
narco1.recorrido = [ locEmbarcadero, locPasilloEscaleraExterior, locPasillo2,
                     locPasillo, locSotano, locEscalerasInteriores, locSalon ];

var narco2 = ctrl.personas.creaPersona( "Manrique",
                    [ "criminal", "narco" ],
                    "Claramente un matón de poca monta.",
                    ctrl.lugares.limbo
);
narco2.pos = -1;
narco2.recorrido = [ locEmbarcadero, locPasilloEscaleraExterior, locPasillo2,
                     locPasillo, locSotano, locEscalerasInteriores, locCocina, locExterior ];

var narco3 = ctrl.personas.creaPersona( "Humberto",
                    [ "criminal", "narco" ],
                    "Un tipo que fuma tranquilamente, parece querer dárselas \
                     de refinado. Quizás el jefe.",
                    ctrl.lugares.limbo
);
narco3.pos = -1;
narco3.recorrido = [ locEmbarcadero, locPasilloEscaleraExterior, locPasillo2,
                     locPasillo, locSotano, locEscalerasInteriores, locSalon ];

// --- Jugador ---------------------------------------------------------
var jugador = ctrl.personas.creaPersona( "Alguien",
                    [ "agente", "anacleto" ],
                    "Anacleto, agente de psico-investigaciones.",
                    locExterior
);

jugador.avanceNarcos = false;

jugador.postAction = function() {
    if ( this.avanceNarcos ) {
        var loc = ctrl.lugares.getCurrentLoc();

        ++narco1.pos;
        ++narco2.pos;
        ++narco3.pos;

        if ( narco1.pos < narco1.recorrido.length ) {
            var dest = narco1.recorrido[ narco1.pos ];
            narco1.mueveA( dest );

            if ( loc == dest ) {
                jugador.muertePorNarco();
            } else {
                ctrl.print( "Escuchas a un narco entrar en " + dest.name );
            }
        }

        if ( narco2.pos < narco2.recorrido.length ) {
            var dest = narco2.recorrido[ narco2.pos ];
            narco2.mueveA( dest );

            if ( loc == dest ) {
                jugador.muertePorNarco();
            } else {
                ctrl.print( "Escuchas a un narco entrar en " + dest.name );
            }
        }

        if ( narco3.pos < narco3.recorrido.length ) {
            var dest = narco3.recorrido[ narco3.pos ];
            narco3.mueveA( dest );

            if ( loc == dest ) {
                jugador.muertePorNarco();
            } else {
                ctrl.print( "Escuchas a un narco entrar en " + dest.name );
            }
        }
    }
}

jugador.llevaLuz = function() {
        return ( ctrl.estaPresente( objLinterna ) && objLinterna.encendida );
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
// ctrl.lugares.ponInicio( locExterior );
ctrl.lugares.ponInicio( locEmbarcadero );
objLinterna.mueveA( jugador );
objLinterna.encendida = true;
