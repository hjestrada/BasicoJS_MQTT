let client; // Declarar la variable client aquí para que sea accesible en ambas funciones
let isConnected = false;

const connectMQTT = () => {
    // Código de conexión MQTT omitido por brevedad...
};

const publishMessage = () => {
    // Código de publicación de mensaje MQTT omitido por brevedad...
};

const updateCardData = (topic, message) => {
    switch (topic) {
        case 'temperatura':
            document.getElementById('temperatura').textContent = message + ' °C';
            break;
        case 'humedad':
            document.getElementById('humedad').textContent = message + ' %';
            break;
        case 'peso':
            document.getElementById('peso').textContent = message + ' kg';
            break;
        default:
            break;
    }
};

const updateConnectionStatus = () => {
    // Código de actualización del estado de conexión omitido por brevedad...
};

// Subscribirse a los temas relevantes
const subscribeTopics = () => {
    client.subscribe('temperatura', (error) => {
        if (error) {
            console.log('Error de suscripción a temperatura:', error);
        }
    });
    client.subscribe('humedad', (error) => {
        if (error) {
            console.log('Error de suscripción a humedad:', error);
        }
    });
    client.subscribe('peso', (error) => {
        if (error) {
            console.log('Error de suscripción a peso:', error);
        }
    });
};

// Manejar los mensajes recibidos
client.on('message', (topic, payload) => {
    console.log('Mensaje Recibido:', topic, payload.toString());
    updateCardData(topic, payload.toString());
});
