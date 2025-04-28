#ifndef SERVER_H
#define SERVER_H

#include "notification.h"  // Thư viện hiển thị lên màn hình
#include "font.h"

const String apiUrl = "http://duylong.io.vn/action/rollcall.php";

// Hàm lấy UID của thẻ RFID
String getCardUID(MFRC522 rfid) {
  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  return uid;
}

// Hàm lấy thời gian hiện tại theo định dạng hh:mm:ss
String getFormattedTime() {
  time_t now = time(nullptr);
  struct tm *timeInfo = localtime(&now);
  char timeStr[9];
  strftime(timeStr, sizeof(timeStr), "%H:%M:%S", timeInfo);
  return String(timeStr);
}

// Hàm gửi UID và thời gian lên API và nhận thông tin học sinh
String getStudentInfo(String uid, String timeNow) {
  String response = "";

  displayLoader();

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = apiUrl + "?uid=" + uid + "&time=" + timeNow;
    http.begin(url);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    int httpCode = http.GET();

    if (httpCode > 0) {
      response = http.getString();
      Serial.println("Response: " + response);

      if (response != "") {
        StaticJsonDocument<300> doc;
        DeserializationError error = deserializeJson(doc, response);

        if (error) {
          Serial.println("Failed to parse JSON");
          displayFail();
          return "";
        }

        String fullname = doc["fullname"];
        String id = doc["id"];

        // Xóa dấu trước khi hiển thị
        String name_no_accent = removeVietnameseTones(fullname);
        displayConfirm();
        displayOnScreen(name_no_accent, id);
      }
    } else {
      displayFail();
      Serial.println("Error on HTTP request");
      response = "";
    }

    http.end();
  } else {
    displayFail();
    response = "";
  }

  return response;
}

#endif
