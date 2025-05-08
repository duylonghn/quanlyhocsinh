#include "RFID.h"

MFRC522 rfid(SS_PIN, RST_PIN);

// Thông tin WiFi
const char* ssid = "DuyLong";
const char* pass = "12341234";

const char* ssidAP = "WiFiScannerAP";
const char* passAP = "12345678";

void setup() {
  Serial.begin(115200);
  checkOled();
  checkLCD();

  // 1. Thử kết nối WiFi mặc định
  if (!connectWifi(ssid, pass)) {
    // 2. Nếu thất bại, tạo hotspot + server web
    displayWifiAP(ssidAP);
    wifiHotspot(ssidAP, passAP);
    setupServer();

    // 3. Chờ đến khi người dùng cấu hình xong WiFi
    while (WiFi.status() != WL_CONNECTED) {
      handleClient();  // Xử lý yêu cầu cấu hình từ người dùng
      delay(100);      // Giảm tải CPU
    }
  }

  // 4. Khi WiFi đã kết nối (dù là từ mặc định hay AP)
  connectedWifi(WiFi.SSID().c_str());
  displayConnectingNTP();
  if (connectNTP()) {
    displayConnectedNTP();
  } else {
    Serial.println("Failed to connect to NTP server");
  }

  
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  checkRFID();
  showDefaultDisplay();
}

void loop() {
  displayTime();
  readCard();
}
