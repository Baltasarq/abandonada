// abandonada.js
/*
 *      Abandonada
 *      (c) baltasarq@gmail.com MIT License
 *
 *      Aventura de texto en una casa abandonada.
 *
 */

ctrl.ponTitulo( "Abandonada" );
ctrl.ponIntro( "<p align='justify'>Un paseo por el bosque.</p>" );
ctrl.ponImg( "res/abandonada.png" );
ctrl.ponAutor( "Baltasarq" );
ctrl.ponVersion( "20141214" );

ctrl.media.setColor( "desc", "green" );

// Luz ----------------------------------------------------------------
Loc.prototype.luz = false;
Loc.prototype.hayLuz = function() {
        return ( this.luz || jugador.llevaLuz() );
}

// *** Locs --

var locExterior = ctrl.lugares.creaLoc(
    "Pequeño claro en el bosque",
    [ "claro", "bosque" ],
    "Frente a ti, una casa."
);
locExterior.pic = "res/abandonada.png";

var objCasa = ctrl.creaObj(
        "casa",
        [ "edificio", "mansion", "palacio", "ruinas" ],
        "Se encuentra entre varios &aacute;rboles, hacia el ${sur, sur}.",
        locExterior,
        Ent.Escenario
);

objCasa.preEnter = function() {
    action.execute( "go", "s" );
}

// --- Jugador ---------------------------------------------------------
var jugador = ctrl.personas.creaPersona( "Howard Carter",
                    [ "howard", "carter", "explorador" ],
                    "Howard Carter, un Arque&oacute;logo experto en el mundo egipcio.",
                    locDesierto
);

jugador.llevaLuz = function() {
        return ( ( jugador.has( objAntorcha ) && objAntorcha.encendida )
              || ( jugador.has( objLinterna ) && objLinterna.encendida ) );
}

var objBrujula = ctrl.creaObj(
	"brujula",
	[ "compas", "brujula" ],
	"Tu fiable br&uacute;jula.",
    jugador,
	Ent.Portable
);

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
