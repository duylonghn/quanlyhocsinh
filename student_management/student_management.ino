#include "RFID.h"

MFRC522 rfid(SS_PIN, RST_PIN);

// Thông tin WiFi
const char* ssid = "Duy Long";
const char* pass = "Khong@biet";

void setup() {
  Serial.begin(115200);
  checkOled();
  checkLCD();
  
  // WiFi
  connectWifi(ssid, pass);
  if (WiFi.status() == WL_CONNECTED) {
      connectedWifi(ssid);
  }
  
  displayConnectingNTP();
  if (connectNTP()) {
    displayConnectedNTP();
  } else {
    Serial.println("Failed to connect to NTP server");
  }

  // Còi
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  
  checkRFID();
  showDefaultDisplay();
}

void loop() {
  displayTime();
  readCard();
}


