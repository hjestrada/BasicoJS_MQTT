let client;
let isConnected = false;

const connectMQTT = () => {
    // Obtener los valores de los campos
    const clientId = document.getElementById('clientId').value;
    const connectUrl = document.getElementById('connectUrl').value;
    const port = document.getElementById('port').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const topic = document.getElementById('topic').value;

    // Validar que todos los campos obligatorios estén diligenciados
    if (!clientId || !connectUrl || !port || !username || !password || !topic) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }

    // Asegurarse de que la URL comience con 'wss://'
    let fullConnectUrl = connectUrl.startsWith('wss://') ? connectUrl : 'wss://' + connectUrl;

    // Agregar el puerto a la URL
    fullConnectUrl += `:${port}/mqtt`;

    const options = {
        keepalive: 30,
        clientId: clientId,
        clean: true,
        connectTimeout: 5000,
        username: username,
        password: password,
        reconnectPeriod: 1000,
    };

    console.log('Conectando al cliente MQTT');
    client = mqtt.connect(fullConnectUrl, options);

    client.on('error', (err) => {
        console.log('Error de conexión: ', err);
        client.end();
        isConnected = false;
        updateConnectionStatus();
    });

    client.on('reconnect', () => {
        console.log('Reconectando...');
    });

    client.on('connect', () => {
        console.log('Cliente conectado:' + clientId);
        isConnected = true;
        updateConnectionStatus();
    });

    client.on('message', (topic, payload) => {
        console.log(
            'Mensaje Recibido: ' + payload.toString() + '\nEn el tema: ' + topic
        );
        mostrarMensajeRecibido(payload.toString());
    });

    isConnected = true;
    updateConnectionStatus();

    // Oculta el formulario de configuración y muestra el contenido
    document.getElementById('configFormCol').style.display = 'none';
    document.getElementById('contentCol').style.display = 'block';

};


const publishMessage = () => {
    if (!isConnected) {
        alert('No estás conectado al broker MQTT. Conéctate antes de publicar.');
        return;
    }

    const topic = document.getElementById('topic').value;
    const payload = document.getElementById('message').value;
    const qos = 0;

    client.subscribe(topic, {
        qos
    }, (error) => {
        if (error) {
            console.log('Error de suscripción:', error);
            return;
        }
        console.log(`Suscrito al tema ${topic}`);
    });

    client.publish(topic, payload, {
        qos
    }, (error) => {
        if (error) {
            console.error(error);
        }
    });
};
let idCounter = 1; // Inicializa el contador

const mostrarMensajeRecibido = (mensaje) => {
    const receivedMessagesDiv = document.getElementById('receivedMessages');
    const container = document.getElementById('receivedMessagesContainer');


    // Extraer datos de temperatura, humedad y peso del mensaje JSON
    try {
        const datos = JSON.parse(mensaje);
        const temperatura = datos['Temperatura'] || '--';
        const humedad = datos['Humedad'] || '--';
        const peso = datos['Peso'] || '--';


        // Actualizar la tarjeta con los valores extraídos
        document.getElementById('temp1').innerText = temperatura;
        document.getElementById('hum1').innerText = humedad;
        document.getElementById('peso1').innerText = peso;

        const nuevoId = idCounter++;

        // Actualizar la tabla con los valores extraídos
        const newRow = datosTablaBody.insertRow();
        newRow.insertCell(0).innerText = nuevoId;
        newRow.insertCell(1).innerText = temperatura;
        newRow.insertCell(2).innerText = humedad;
        newRow.insertCell(3).innerText = peso;
    } catch (error) {
        console.error('Error al analizar el JSON:', error);
        console.error('Mensaje recibido:', mensaje);
    }
};

const updateConnectionStatus = () => {
    const connectionStatusLabel = document.getElementById('connectionStatus');
    connectionStatusLabel.textContent = isConnected ? 'Conectado al Broker' : 'Desconectado del Broker';
};/*  */