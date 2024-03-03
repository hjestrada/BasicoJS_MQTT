#include <Arduino.h>
#include <WiFiNINA.h>
#include <ArduinoMqttClient.h>

// Configuración de la red WiFi
char ssid[] = "Teranet_Estrada";
char password[] = "1117508100Abc*";

// Configuración del broker MQTT
const char *mqttServer = "l1ea036e.ala.us-east-1.emqxsl.com";
const int mqttPort = 8883;
const char *mqttUser = "Colmenas";
const char *mqttPassword = "123456789";
const char *mqttTopic = "1117508100/66D222335154";

WiFiSSLClient wifiClient;
MqttClient mqttClient(wifiClient);

void setup() {
  Serial.begin(9600);
  delay(2000);

  // Conectar a la red WiFi
  connectWiFi();

  // Conectar al broker MQTT
  connectMQTT();
}

void loop() {
  // Generar datos aleatorios
  int temperature = random(150, 250); // Temperatura entre 15.0 y 25.0
  int humidity = random(200, 400);    // Humedad entre 20.0 y 40.0
  int weight = random(700, 900);      // Peso entre 70.0 y 90.0

  // Construir el JSON con datos aleatorios
  String jsonData = "{\"temperature\":" + String(temperature) +
                    ",\"humidity\":" + String(humidity) +
                    ",\"weight\":" + String(weight) + "}";

  // Publicar datos en el tópico MQTT
  mqttClient.beginMessage(mqttTopic);
  mqttClient.print(jsonData);
  mqttClient.endMessage();

  delay(2000);  // Espera 2 segundos antes de enviar el próximo mensaje
}

void connectWiFi() {
  Serial.print("Conectando a la red WiFi");

  while (WiFi.begin(ssid, password) != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\nConectado a la red WiFi");
}

void connectMQTT() {
  Serial.print("Conectando al broker MQTT");

  mqttClient.setId("Nano33IoT");
  mqttClient.setUsernamePassword(mqttUser, mqttPassword);

  while (!mqttClient.connect(mqttServer, mqttPort)) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\nConectado al broker MQTT");
}
