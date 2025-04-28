#include <MFRC522.h>
#include <SPI.h>
#include "server.h"

// RFID
#define RST_PIN 4
#define SS_PIN 5
extern MFRC522 rfid;

void checkRFID() {
  SPI.begin();
  delay(50);
  rfid.PCD_Init();
  Serial.println("RFID: done");
}

void readCard() {
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    String uid = getCardUID(rfid);  // Lấy UID từ thẻ RFID
    String timeNow = getFormattedTime(); // Lấy giờ hiện tại

    Serial.println("UID: " + uid); // In UID ra serial monitor để kiểm tra
    Serial.println("Time: " + timeNow); // In thời gian ra serial monitor

    // Gửi UID và thời gian lên API để lấy thông tin học sinh
    String studentInfo = getStudentInfo(uid, timeNow);

    // Nếu có thông tin học sinh, nó sẽ được hiển thị trong hàm `getStudentInfo`
    if (studentInfo != "") {
      // Thông tin học sinh đã được hiển thị
      Serial.println("Thông tin học sinh đã được hiển thị trên màn hình");
    }
  }
}

