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
ctrl.ponVersion( "20161024" );

// Luz ----------------------------------------------------------------
Loc.prototype.luz = true;
Loc.prototype.hayLuz = function() {
        return ( this.luz || jugador.llevaLuz() );
}

// *** Locs --

var locExterior = ctrl.lugares.creaLoc(
    "Pequeño claro en el bosque",
    [ "claro", "bosque" ],
    "Frente a ti, al ${sur, sur}, una ${casa, ex casa} que \
    ha tenido mejores momentos, aunque \
    a&uacute;n se yergue como una especie de antiguo castillo. \
    Al ${oeste, oeste}, lo que queda \
    de un ${garaje, oeste} asoma entre la ${vegetación, ex vegetacion}. \
    Aqu&iacute; est&aacute tu ${furgoneta, ex furgoneta}."
);
locExterior.pic = "res/abandonada.jpg";

var objCasa = ctrl.creaObj(
        "casa",
        [ "edificio", "mansion", "palacio", "ruinas", "castillo" ],
        "Se encuentra entre varios &aacute;rboles, hacia el ${sur, sur}. \
         No invita a adrentarse en su interior. Es comprensible que \
         circulen todo tipo de leyendas sobre estar encantada. La pinta, \
         con el abandono y el bosque a su alrededor, la tiene toda.",
        locExterior,
        Ent.Escenario
);

var objGaraje = ctrl.creaObj(
        "garaje",
        [ "galpon", "cochera" ],
        "Un pequeño garaje, que parece comido por la espesura, \
         al ${oeste, oeste}.",
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
    }

    toret += " En la parte trasera está el portón del ${maletero, ex maletero}.";

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
        }

        if ( ctrl.lugares.limbo.has( objAceite ) ) {
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
    "El garaje ha pasado definitivamente días mejores: los arbustos lo \
     han invadido todo, junto con el musgo y las enredaderas. \
     La humedad provoca una fuerte sensación de frío y desamparo. \
     Parece como si hubiera querido devorar el ${coche, ex coche} en su \
     ya verde interior.<br> \
     Al ${este, este} se encuentra la explanada junto a la casa."
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

var locPorche = ctrl.lugares.creaLoc(
    "Entrada a la casa",
    [ "entrada", "porche" ],
    "La desvencijada ${puerta, ex puerta}, al ${sur, sur}, \
     preside la entrada de la casa, \
     que está que se cae. Las ${paredes, ex paredes} han perdido el \
     color debido al paso del tiempo, y del ${tejadillo, ex tejadillo} \
     faltan muchas de tejas. El aspecto en general es \
     lamentable. La explanada se abre hacia el ${norte, norte}."
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

locPorche.preEnter = function() {
    actions.execute( "enter", "casa" );
}

var objTejadillo = ctrl.creaObj(
        "tejadillo",
        [ "tejadillo", "tejas", "teja", "tejado" ],
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

var objCasa = ctrl.creaObj(
        "casa",
        [ "edificio", "mansion", "palacio", "ruinas", "castillo" ],
        "Delante de ti puedes ver el ${tejadillo, ex tejadillo}, \
        y las ${paredes, ex paredes} de cerca.",
        locPorche,
        Ent.Escenario
);
objCasa.preEnter = function() {
    actions.execute( "go", "sur" );
}


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

var locCocina = ctrl.lugares.creaLoc(
    "Cocina",
    [ "habitacion", "sala", "estancia" ],
    "Una cocina asolada y llena de ${cascotes, ex cascotes}. La luz entra por un \
     par de ${ventanas, ex ventanas}, que alegran un tanto una estancia tan devastada. \
     Una ${despensa, ex despensa}, una ${encimera, ex encimera} \
     con ${horno, ex horno}, y un ${radiador, ex radiador} es lo \
     poco que queda en pie. El porche se sitúa al ${norte, norte}, \
     y es posible adentrarse en la casa por el ${sur, sur}."
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
	[ "estanterias", "estantes", "estante", "cuarto", "cuartito", "polvo" ],
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
    [ "escaleras", "peldanos", "escalera", "peldano", "barandilla", "luz" ],
    "El distribuidor, un lugar estratégico en la casa, \
     sitúa las ${escaleras, ex escaleras} en el \
     centro de la misma, a la vez que permite ir al ${norte, norte} \
     y al ${sur, sur}. Las escaleras a su vez, permiten ${subir, sube} \
     a la primera planta, y ${bajar, baja} al sótano. \
     Allá abajo todo está oscuro, la luz parece \
     incapaz de penetrar las profundidades. \
     En contraste, en el piso superior \
     es como si entrara la luz a raudales. Mientras la \
     barandilla es de madera, los peldaños están hechos de \
     cemento, que se muestra muy húmedo y mohoso."
);
locEscalerasInteriores.pic = "res/escaleras_interiores.jpg";
locEscalerasInteriores.ponSalidaBi( "norte", locCocina );
locEscalerasInteriores.objs.push( objParedes );

var locDesvan = ctrl.lugares.creaLoc(
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

var objPolvoDesvan = ctrl.creaObj(
	"polvo",
	[ "telas", "araña", "suciedad", "moho", "deshechos" ],
	"Todo tipo de polvo y deshechos.",
    locDesvan,
	Ent.Escenario
);

var objMuebles = ctrl.creaObj(
	"muebles",
	[ "mueble", "mesas", "mesa", "sillas", "silla" ],
	"Todo tipo de muebles, podridos e inservibles.",
    locDesvan,
	Ent.Escenario
);

var objChimeneaDesvan = ctrl.creaObj(
	"chimenea",
	[ "hogar", "tiro", "lareira", "agujero" ],
	"El gran hueco negro del hogar. En la parte superior e inferior, un agujero \
	 permite acceder al tiro de la misma, que va hacia arriba y hacia \
	 abajo.",
    locDesvan,
	Ent.Escenario
);

objChimeneaDesvan.preStart = function() {
	return "¿Para qué? Ni que hiciera frío...";
}

objChimeneaDesvan.preShutdown = function() {
	return "Ahora mismo está apagada.";
}

var objEstufa = ctrl.creaObj(
	"estufa",
	[ "caldera", "tapa", "cilindro" ],
	"Hoy por hoy, de la estufa solo queda un extraño cilindro de \
	 hierro. Oxidado, como no.",
    locDesvan,
	Ent.Escenario
);

objEstufa.ponContenedor();
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
		toret = "Abres la estufa, revelando varias cosas en su interior.";
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
	"Las escaleras permiten ${descender, baja} hacia la primera planta.",
	locDesvan,
	Ent.Escenario
);

objEscaleras.preDescend = function() {
	return actions.execute( "Go", "abajo" );
}

var objVentana = ctrl.creaObj(
	"ventana",
	[ "ventana", "luz" ],
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

var objPina = ctrl.creaObj(
	"piña",
	[ "pina" ],
	"Pues sí, es una piña.",
	objEstufa,
	Ent.Portable
);

objPina.preDrop = function() {
    var toret = "";

	if ( parser.sentence.obj2 == objChimeneaDesvan ) {
		toret = "La piña cae por el tiro de la chimenea. La oyes \
			 rebotar hacia abajo, como rasgando las paredes, \
			 para finalmente depositarse en la planta inferior. \
			 La verdad, ha sonado como un espíritu lastimero.";

		objPina.mueveA( objChimeneaSalon );
		narcosHuyen();
	} else {
        toret = dropAction.exe( parser.sentence );
    }

	return toret;
}

var objPalo = ctrl.creaObj(
	"palo",
	[ "palo" ],
	"Pues sí, es una palo.",
	objEstufa,
	Ent.Portable
);

objPalo.preDrop = function() {
    var toret = "";

	if ( parser.sentence.obj2 == objChimeneaDesvan ) {
		toret = "El palo cae por el tiro de la chimenea. Lo oyes \
			 rebotar hacia abajo, golpeándose con las paredes, \
			 para finalmente depositarse en la planta inferior. \
			 La verdad, ha sonado como un alma errante.";

		objPalo.mueveA( objChimeneaSalon );
		narcosHuyen();
	} else {
        toret = dropAction.exe( parser.sentence );
    }

	return toret;
}

var objLata = ctrl.creaObj(
	"lata",
	[ "lata" ],
	"Una vieja lata oxidada.",
	objEstufa,
	Ent.Portable
);

objLata.preDrop = function() {
    var toret = "";

	if ( parser.sentence.obj2 == objChimeneaDesvan ) {
		toret = "La lata cae por el tiro de la chimenea. La oyes \
			 rebotar hacia abajo, provocando ecos metálicos en su chocar, \
			 para finalmente depositarse en la planta inferior. \
			 La verdad, ha sonado como una larga cadena arrastrada \
			 por un espectro.";

		objLata.mueveA( objChimeneaSalon );
		narcosHuyen();
	} else {
        toret = dropAction.exe( parser.sentence );
    }

	return toret;
}

var locSalon = ctrl.lugares.creaLoc(
    "Salón",
    [ "salon", "sala", "habitacion", "estancia" ],
    "Las ${ventanas, ex ventanas} iluminan un salón en franca \
     decadencia. Una ${chimenea, ex chimenea}, \
     algunos ${cascotes, ex cascotes}, \
     ${papeles, ex papeles} por el suelo, un mohoso ${sofá, ex sofa}, \
     una vieja ${silla de ruedas, ex silla} \
     e incluso un viejo ${baúl, ex caja}, son el triste reflejo de lo \
     que un día debieron ser. La lejanía de la carretera sin duda ha \
     evitado que estas cosas desaparecieran completamente, aunque hoy \
     ya no tienen valor. Se puede volver al ${norte, norte}."
);
locSalon.pic = "res/salon.jpg";
locSalon.ponSalidaBi( "norte", locEscalerasInteriores );
locSalon.objs.push( objCascotes );
locSalon.objs.push( objVentanas );
locSalon.objs.push( objParedes );

var objChimeneaSalon = ctrl.creaObj (
	"chimenea",
	[ "hogar", "tiro", "lareira", "agujero" ],
	"El gran hueco negro del hogar. En la parte superior, un agujero \
	 permite acceder al tiro de la misma, que va hacia arriba.",
	locSalon,
	Ent.Escenario
);

objChimeneaSalon.ponContenedor();
objChimeneaSalon.preStart = function() {
	return "¿Para qué? Ni que hiciera frío...";
}

objChimeneaSalon.preShutdown = function() {
	return "Ahora mismo está apagada.";
}

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
        if ( ctrl.lugares.limbo.has( objEscoba ) ) {
            objEscoba.moveTo( objCaja );
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

var objEscoba = ctrl.creaObj(
	"escoba",
	[],
	"Una cochambrosa escoba.",
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
				toret = "Echas un poco de aceite sobre la llave, y \
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
    "El pasillo se interna en la oscuridad hacia el ${este, este}. \
     En el extremo ${oeste, o}, hay una ${puerta, ex puerta}."
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
     que permiten ${subir, sube}. En la pared sur del corredor, puedes ver \
     una ${puerta, ex puerta}."
);

locPasillo2.luz = false;
locPasillo2.ponSalidaBi( "arriba", locPasillo );
locPasillo2.ponSalidaBi( "oeste", locPasillo );
locPasillo2.objs.push( objParedes );
locPasillo2.objs.push( objEscalerasTrampilla );

locPasillo2.preLook = function() {
	var toret = locPasillo2.desc;

	if ( !locPasillo2.hayLuz() ) {
                locPasillo2.pic = null;
		ctrl.irA( locPasillo );
		toret = "Has retrocedido asustado ante la falta de luz, y \
					como has podido, a tientas, has subido los peldaños \
					para volver a la estancia anterior.<br />";
		toret += locPasillo.desc;
	} else {
		locPasillo2.pic = "res/pasillo-oscuro.jpg";
	}

	return toret;
}

locPasillo2.preGo = function() {
    var toret = "";

    if ( parser.sentencia.term1 == "sur"
      && !objPuertaPasilloLabo.abierta )
    {
        toret = "La puerta está cerrada.";
    } else {
        toret = goAction.exe( parser.sentencia );
    }

    return toret;
}

var objPuertaPasilloLabo = ctrl.creaObj(
    "puerta",
    [ "acero", "cerradura" ],
    "Una recia puerta de acero, de brillante cerradura, \
     se abre en la pared ${sur, sur}. \
     Curioso, no parece abandonada en absoluto.",
    locPasillo2,
    Ent.Escenario
);
objPuertaPasilloLabo.abierta = false;
objPuertaPasilloLabo.preOpen = function() {
    var jugador = ctrl.personas.getPlayer();
    var toret = "Permanece firmemente cerrada.";

    if ( jugador.has( objBarraHierro ) ) {
        toret = "La habilidad que te dio un pasado inconfesable te permite \
                 desbloquear la cerradura de \
                 la puerta al ${sur, sur} con la palanca.";
        objPuertaPasilloLabo.abierta = true;

        locEmbarcadero.traeNarcos();
    }

    return toret;
}

var locLabo = ctrl.lugares.creaLoc(
    "Laboratorio",
    [ "labo", "almacen", "habitacion" ],
    "Una pequeña y húmeda habitación contiene varios \
    ${instrumentos, ex material} que identificas como \
    matraces, filtros, mecheros y otros. \
    Además, en una esquina hay varios ${fardos, ex fardos}. \
    Las ${paredes, ex paredes} han sido recebadas con cemento, \
    si bien es probable que el río esté próximo, \
    pues pequeñas gotas perlan su superficie. \
    La única salida es la puerta por la que entraste, al ${norte, norte}."
);
locLabo.ponSalidaBi( "norte", locPasillo2 );
locLabo.pic = "res/labo.jpg";

var objParedes = ctrl.creaObj(
	"paredes",
	[ "pared", "muro", "muros", "cemento", "gota", "gotas", "moho" ],
	"Son unos mohosos muros de cemento, perlados de gotas de agua.",
	locLabo,
	Ent.Escenario
);

var objInstrumentos = ctrl.creaObj(
	"instrumentos",
	[ "instrumento", "materiales", "material" ],
	"El material de laboratorio se te antoja indiferente, más allá de reconocer \
	 algunos instrumentos.",
	locLabo,
	Ent.Escenario
);

var objFardos = ctrl.creaObj(
	"fardos",
	[ "fardo", "sacos", "saco" ],
	"Son envoltorios de plástico que parecen contener un polvo blanco \
	y compacto. O es harina o...",
	locLabo,
	Ent.Escenario
);

var objPuertaLabo = ctrl.creaObj(
	"puerta",
	[ "salida" ],
	"La puerta del labo, al ${norte, norte}.",
	locLabo,
	Ent.Escenario
);

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
    "Un pequeño ${muelle, ex muelle} se sitúa en perpendicular \
     al subterráneo, paralelo \
     a la casa que adivinas por encima de la colina tras la salida \
     al ${oeste, oeste}. Las verdes aguas de un pantano se abren frente a ti, \
     brumosas y húmedas. Pequeños crujidos acompañan al monótono, \
     casi inexistente oleaje."
);

locEmbarcadero.pic = "res/pantano.jpg";
locEmbarcadero.llegaronNarcos = false;
locEmbarcadero.ponSalidaBi( "oeste", locPasilloEscaleraExterior );
locEmbarcadero.ponSalidaBi( "abajo", locPasilloEscaleraExterior );

locEmbarcadero.traeNarcos = function() {
    if ( !this.llegaronNarcos ) {
        this.llegaronNarcos = true;
        ctrl.ponAlarma( 6, function() {
            ctrl.print( "Un ruido lejano de un motor, \
                        que cada vez se acerca más \
                        y más, te saca de tu ensimismamiento... ¡una lancha se \
                        aproxima por el río!" );
            ctrl.ponAlarma( 6, function() {
                ctrl.print( "En la distancia, oyes varias pisadas ahogadas. \
                                Varias personas descienden \
                                de alguna embarcación al muelle." );
                ctrl.ponDaemon( "mueveNarcos", mueveNarcos );
            });
        });
    }
}

locEmbarcadero.preGo = function() {
    var toret = "";

    if ( parser.sentencia.term1 == "este"
      && locEmbarcadero.has( objLancha ) )
    {
        toret = actions.execute( "enter", "lancha" );
    } else {
        toret = goAction.exe( parser.sentencia );
    }

    return toret;
}

locEmbarcadero.preLook = function() {
    var toret = locEmbarcadero.desc;

    if ( locEmbarcadero.has( objLancha ) ) {
        toret += " Al ${este, este}, en el muelle, puedes ver \
                  una ${planeadora, ex planeadora}.";
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

objEmbarcadero.preExamine = function() {
  var toret = objEmbarcadero.desc;

  if ( objLancha.owner == ctrl.lugares.limbo ) {
    objLancha.moveTo( locEmbarcadero );
    toret += "<br>Atracada al precario muelle, puedes ver una \
    ${planeadora, ex planeadora}.";
  }

  return toret;
}

var objLancha = ctrl.creaObj(
  "lancha",
	[ "bote", "planeador", "planeadora", "motora" ],
	"Se trata de una de esas planeadoras, con una especie de ventilador detrás.",
	ctrl.lugares.limbo,
	Ent.Escenario
);
objLancha.puedeSubir = false;

objLancha.preClimb = function() {
  return actions.execute( "enter", "lancha" );
}

objLancha.preEnter = function() {
    var toret = "Das un traspiés, y caes de bruces de nuevo en el muelle...";

    if ( !objLancha.puedeSubir ) {
        ctrl.print( "Escuchas un lejano rumor de un motor..." );
        toret = "Vuelves al muelle. Algo te dice que debes buscar refugio.";
        locEmbarcadero.traeNarcos();
    } else {
        ctrl.goto( locCurvaPantano );
        toret = "La lancha ronronea...";
    }

    return toret;
}

objLancha.ponContenedor( true );

var objBarraHierro = ctrl.creaObj(
	"barra",
	[ "barra", "hierro", "palanca", "herramienta" ],
	"Permite forzar cerraduras.",
	objLancha,
	Ent.Portable
);

var locCurvaPantano = ctrl.lugares.creaLoc(
    "Curva del pantano",
    [ "curva", "pantano" ],
    "El lecho de un río aparece enmarcado por la vegetación irregular. Las \
    verdosas aguas del pantano fluyen en una curva de ${oeste, oeste} \
    a ${norte, norte}."
);
locCurvaPantano.pic = "res/curva_pantano.jpg";
locCurvaPantano.ponSalida( "oeste", locEmbarcadero );

var locPantanoTupido = ctrl.lugares.creaLoc(
    "Pantano tupido",
    [ "pantano" ],
    "El río se estrecha por momentos, teniendo que sortear continuamente \
    muchos árboles y otra vegetación. Las \
    verdosas aguas del pantano fluyen de ${norte, norte} \
    a ${sur, sur}."
);
locPantanoTupido.pic = "res/avance_pantano.jpg";
locPantanoTupido.ponSalidaBi( "sur", locCurvaPantano );

var locSalidaPantano = ctrl.lugares.creaLoc(
    "Salida del pantano",
    [ "pantano" ],
    "Repentinamente, las aguas parecen abrirse, y los árboles desaparecen, \
    de forma que puedes ver en lontananza. Las \
    verdosas aguas del pantano fluyen suavemente de ${norte, norte} \
    a ${sur, sur}."
);
locSalidaPantano.pic = "res/salida_pantano.jpg";
locSalidaPantano.ponSalidaBi( "sur", locPantanoTupido );

locSalidaPantano.preGo = function() {
    var toret = "";

    if ( parser.sentencia.term1 == "norte" ) {
        document.getElementById( "dvPic" ).style.display = "none";
        document.getElementById( "dvActions" ).style.display = "none";
        document.getElementById( "dvObjects" ).style.display = "none";
        ctrl.terminaJuego(
            "&iexcl;Menuda aventura!\
                &iexcl;En menudo lío te has metido sin quererlo!<br/> \
                Respiras profundamente, ya con calma, mientras la lancha se \
                desliza por la corriente, formando ondas cenagosas a su paso. \
                <p>&iexcl;Lo has conseguido!</p>",
            "res/salida_pantano.jpg"
        );
    } else {
        toret = goAction.exe( parser.sentencia );
    }

    return toret;
}


// PNJ's
function narcosHuyen() {
    if ( narco1.owner != ctrl.lugares.limbo ) {
        toret += "<br>Escuchas varias voces dando gritos abajo.<br>\
                - ¡Joder!¡Es verdad que está encantada!<br>\
                - ¡Pero no digáis tonterías!<br>\
                - ¡Es mejor que nos larguemos!<br>\
                - Pero... ¡maldita sea!<br>\
                Pasos apresurados debajo de ti se alejan hacia el este... \
                Al poco rato, escuchas el ruido de la lancha, \
                alejándose por el río.";

        narco1.mueveA();
        narco2.mueveA();
        narco3.mueveA();
        objLancha.puedeSubir = true;
	}
}

function mueveNarcos() {
  var narcos = [ narco1, narco2, narco3 ];

  for(var i = 0; i < narcos.length; ++i) {
    var narco = narcos[ i ];
    narco.pos += 1;

    if ( narco.pos < narco.recorrido.length ) {
      var narcoLoc = narco.recorrido[ narco.pos ];
      var narcoMsg = narco.message[ narco.pos ];

      narco.mueveA( narcoLoc );
      ctrl.print( narcoMsg );

      if ( narcoLoc == ctrl.places.getCurrentLoc() ) {
            muertePorNarco();
      }
    } else {
        if ( narco.pos == narco.recorrido.length +1 ) {
            narco.ponEnVigilancia();
            narco.pos = narco.recorrido.length +2;
        }
    }
  }

  return;
}

function muertePorNarco() {
	document.getElementById( "dvPic" ).style.display = "none";
	document.getElementById( "dvActions" ).style.display = "none";
    document.getElementById( "dvObjects" ).style.display = "none";

	ctrl.terminaJuego( "- ¡Eh!¿Qué haces tú aquí?<br> \
                Son una banda de criminales. Te das cuenta \
                de que han estado utilizando la casa abandonada para almacenar \
                los cargamentos que traen por el río. ¿De ahí la fama de la casa? \
			    Los narcos te rodean en todas direcciones. \
			    Humberto, el jefe, toma la palabra.<br>\
			    - Bien, bien,... Me temo que no nos gustan mucho los \
			    visitantes por aquí... tendremos que dejar clara \
			    nuestra falta de hospitalidad.",
			   "res/abandonada.jpg" );
}

var narco1 = ctrl.personas.creaPersona( "Carlos",
                    [ "criminal", "narco" ],
                    "Un narcotraficante, aunque parece más un guardaespaldas \
                     asesino.",
                    ctrl.lugares.limbo
);
narco1.pos = -1;
narco1.recorrido = [ locEmbarcadero, locPasilloEscaleraExterior, locPasillo2,
                     locLabo, locPasillo, locSotano, locEscalerasInteriores, locSalon ];
narco1.message = [ "- Manrique, ¿has comprobado la mercancía?",
                  "Oyes las pisadas de uno al entrar en el pasadizo por la escalera.",
                  "Se oye a Carlos desde el pasadizo: ¿Vienes, Humberto?",
		              "Escuchas pisadas dirigiéndose al pasillo.",
		              "- ¡Joder!¡Alguien ha intentado entrar en el laboratorio!",
            		  "Uno de los visitantes pasa por las escaleras de camino al salón.",
            		  "Uno de ellos silba.",
            		  "Oyes cómo se abre una ventana.",
                ];
narco1.ponEnVigilancia = function() {
	ctrl.ponDaemon(
		"narco1-vigilancia",
		function() {
			if ( ctrl.places.getCurrentLoc().has( narco1 ) ) {
				muertePorNarco();
			}
		}
	);
}

var narco2 = ctrl.personas.creaPersona( "Manrique",
                    [ "criminal", "narco" ],
                    "Claramente un matón de poca monta.",
                    ctrl.lugares.limbo
);
narco2.pos = -1;
narco2.recorrido = [ locEmbarcadero, locPasilloEscaleraExterior, locPasillo2,
                     locPasillo, locSotano, locEscalerasInteriores, locCocina, locExterior ];
narco2.message = [ "- Joder, Carlos, ya te dije que sí.",
                   "Escuchas a otro descender por la escalera exterior.",
                   "- Deja al jefe en paz...",
            		   "Ahora son dos los que se han quedado quietos....",
            		   "- ¡Hay que registrar la casa!, no puede andar lejos.",
            		   "Otro sube las escaleras arrastrando los pies.",
            		   "Un ladrillo se rompe, supones que de una patada \
            		    propinada por uno de ellos.",
            		   "Se oyen los crujidos del porche al salir uno de ellos \
            		    al exterior.",
                 ];
narco2.ponEnVigilancia = function() {
    ctrl.ponAlarma( 5, function() {
      if ( locExterior.has( narco2 ) ) {
        narco2.mueveA( locSalon );
        ctrl.print( "Escuchas a uno de los visitantes entrar \
                     atropelladamente en el salón.<br>\
        	     - ¡Hay un coche aparcado ahí fuera!<br>\
        	     - ¡Manteneos alerta!" );
      }
	});

	ctrl.ponDaemon(
		"narco2-vigilancia",
		function() {
			if ( ctrl.places.getCurrentLoc().has( narco2 ) ) {
				muertePorNarco();
			}
		}
	);
}


var narco3 = ctrl.personas.creaPersona( "Humberto",
                    [ "criminal", "narco" ],
                    "Un tipo que fuma tranquilamente, parece querer dárselas \
                     de refinado. Quizás el jefe.",
                    ctrl.lugares.limbo
);
narco3.pos = -1;
narco3.recorrido = [ locEmbarcadero, locPasilloEscaleraExterior, locPasillo2,
                     locPasillo, locSotano, locEscalerasInteriores, locSalon, locSalon ];

narco3.message = [ "- Está bien, dejadlo ya. Aún hay que preparar dos envíos \
                     más.<br>\
                    Los otros dos responden al unísono:<br>\
                    - De acuerdo, jefe.",
                   "Supones que siguen todos juntos, aunque solo has oido a dos.",
                   "Todos reemprenden la marcha por el pasillo.",
            		   "Alguien camina por el pasillo.",
            		   "- Calmaos los dos.",
            		   "Las escaleras crujen bajo el peso de unas fuertes pisadas.",
            		   "Escuchas moverse el sillón del salón.",
            		   "Los muelles del sillón emiten un prolongado gemido...",
                 ];
narco3.ponEnVigilancia = function() {
	ctrl.ponDaemon(
		"narco3-vigilancia",
		function() {
			if ( ctrl.places.getCurrentLoc().has( narco3 ) ) {
				muertePorNarco();
			}
		}
	);
}

// --- Jugador ---------------------------------------------------------
var jugador = ctrl.personas.creaPersona( "Alguien",
                    [ "agente", "anacleto" ],
                    "Anacleto, agente de psico-investigaciones.",
                    locExterior
);

jugador.postAction = function() {
    if ( ctrl.places.getCurrentLoc().has( narco3 )
      || ctrl.places.getCurrentLoc().has( narco2 )
      || ctrl.places.getCurrentLoc().has( narco1 ) )
    {
        muertePorNarco();
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

// Entorno misterioso --------------------------------------------------
var msgs_misterio = {
	"msgs": [
		"Un crujido suena en alguna parte...",
		"En la lejanía, oyes una gotera dejar caer su carga con estrépito.",
		"Oyes como una contraventana se golpea, en alguna parte.",
		"El viento silba por entre los entresijos del viejo edificio.",
		"Escuchas un golpe sordo que te sobresalta...",
		"Puedes distinguir un ligero silbido, casi sobrenatural...",
		"Oyes... ¿pasos?... en la lejanía.",
		"Crujidos de todo tipo parecen provenir de todas partes.",
		"Un ruido sordo se infiltra desde el exterior, ¿otra contraventana?",
		"Una puerta se bate en alguna parte.",
		"El viento ulula en la distancia.",
		"Una inesperada corriente de aire frío te roza el cogote.",
	],
	"pos": 0,
	"get": function() {
		++this.pos;

        if ( this.pos >= this.msgs.length ) {
            this.pos = 0;
        }

		return this.msgs[ this.pos - 1 ];
	}
};

ctrl.ponDaemon( "misterio", function() {
	var loc = ctrl.places.getCurrentLoc();

	if ( ( ctrl.getTurns() % 5 ) == 0 ) {
		if ( loc == locSalon
		  || loc == locCocina
		  || loc == locEscalerasInteriores
		  || loc == locDesvan
		  || loc == locSotano
		  || loc == locPasilloEscaleraExterior
		  || loc == locPasillo
		  || loc == locLabo
		  || loc == locPasillo2 )
		{
			ctrl.print( msgs_misterio.get() );
		}
	}

	return;
});

// Arranque ------------------------------------------------------------
ctrl.personas.cambiaJugador( jugador );
ctrl.lugares.ponInicio( locExterior );
