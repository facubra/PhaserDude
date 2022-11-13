import React from "react";
import Phaser from "phaser";
import { useState, useEffect } from "react";
import Escena from "./componentes/Escena";

function App() {

    const [listo, setListo] = useState(false);

    useEffect(() => {
        var config = {
            type: Phaser.AUTO,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
            scene: [Escena]
        };
        //Arranca el juego
        var game = new Phaser.Game(config);
        //Trigger cuando el juego esta completamente listo
        game.events.on("LISTO", setListo);
        //Esto ayuda a que no se duplique el lienzo
        return () => {
            setListo(false);
            game.destroy(true);
        }
    }, [listo])
}

export default App;