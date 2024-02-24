var options = {
    username: 'Colmenas', // Usuario Broker HIVEMQ
    password: '123456789Ab' //Contraseña Broker HIVEMQ
        //username: 'Colmenas', // Usuario Broker EMQX
        //password: '123456789' //Contraseña Broker EMQX
};

var client = mqtt.connect("wss://3fb2c2fed242415d88ab467b8ad1f686.s1.eu.hivemq.cloud:8884/mqtt", options);
//var client = mqtt.connect("wss://l1ea036e.ala.us-east-1.emqxsl.com:8884/mqtt", options); //EMQX

function EventoConectar() {
    console.log("Conectado a MQTT");
    client.subscribe("1117508100/7448C055B594/Datos", function(err) {
        if (!err) {
            client.publish("1117508100/7448C055B594/Datos", "{'Temperatura': 30, 'Humedad': 200, 'Peso': 150}");
        }
    });
}

function EventoMensaje(topic, message) {
    if (topic == "1117508100/7448C055B594/Datos") {
        console.log("Mensaje Recibido" + message.toString());
    }
    console.log(topic + " - " + message.toString());
}

client.on("connect", EventoConectar);
client.on("message", EventoMensaje);

console.log("Empezando a conectar");