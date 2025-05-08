#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "GUI.h"
// Còi
#define BUZZER_PIN 33
float sinVal;
int toneVal;

// Biến để theo dõi thời gian và frame cho ảnh động
unsigned long lastFrameTime = 0;
unsigned long lastFrameTimeFail = 0;
unsigned long lastFrameTimeLoader = 0;
unsigned long frameDelay = 100;  // Thời gian thay đổi frame (ms)

void buzz(int x) {
  sinVal = (sin(x * (3.1412 / 180)));
  toneVal = 3500 + (int(sinVal * 1000));
  tone(BUZZER_PIN, toneVal);
}

void displayConfirm() {
  oled.clearDisplay();
  for (int i = 0; i < FRAME_COUNT; i++) {
    oled.clearDisplay();
    oled.drawBitmap(32, 0, confirm[i], FRAME_WIDTH, FRAME_HEIGHT, 1);
    oled.display();
    delay(100);
  }
  showDefaultDisplay();
}

void displayFail() {
  buzz(140);
  delay(1000);
  noTone(BUZZER_PIN); // Tắt còi

  for (int i = 0; i < FRAME_COUNT; i++) {
    oled.clearDisplay();
    oled.drawBitmap(32, 0, fail[i], FRAME_WIDTH, FRAME_HEIGHT, 1);
    oled.display();
    delay(100);
  }
  showDefaultDisplay();
}


void displayLoader() {
  oled.clearDisplay();
  lcd.clear();
  for (int i = 0; i < FRAME_COUNT; i++) {
    oled.clearDisplay();
    lcd.setCursor(0, 0);
    lcd.print("Waiting ...");
    oled.drawBitmap(32, 0, loader[i], FRAME_WIDTH, FRAME_HEIGHT, 1);
    oled.display();
    delay(100);
  }
}

void showUID(String uid) {
  oled.clearDisplay();
  oled.setTextSize(1);
  drawBitmap(EnableWifi, 0, 0, 128, 12);
  displayTime();
  oled.setCursor(10, 20);
  oled.println("UID:");
  oled.setTextSize(2);
  oled.setCursor(10, 35);
  oled.println(uid);
  oled.display();

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("UID:");
  lcd.setCursor(0, 1);
  lcd.print(uid);
}

void displayOnScreen(String name, String id) {
  lcd.clear();
  buzz(150);
  delay(200);
  buzz(180);
  delay(200);
  noTone(BUZZER_PIN); // Tắt còi
  int lcdWidth = 16;
  unsigned long displayDuration = 3000;
  unsigned long startTime = millis();

  int nameLength = name.length();
  int pos = 0;

  while (millis() - startTime < displayDuration) {
    lcd.setCursor(0, 0);

    if (nameLength <= lcdWidth) {
      // Nếu tên ngắn hơn màn hình thì in cố định
      lcd.print(name);
    } else {
      // Nếu tên dài thì chạy ngang
      String scrollText = name.substring(pos, pos + lcdWidth);
      lcd.print(scrollText);

      pos++;
      if (pos > nameLength - lcdWidth) {
        pos = 0;  // Quay lại từ đầu
      }
    }

    // Luôn giữ ID cố định ở dòng 2
    lcd.setCursor(0, 1);
    lcd.print(id);

    delay(300);  // Tốc độ chạy chữ
    lcd.clear();
  }
}


void displayStudentInfo(String studentInfo) {
  // Phân tích dữ liệu JSON (giả sử API trả về thông tin dưới dạng JSON)
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, studentInfo);

  if (error) {
    Serial.println("Failed to parse JSON");
    return;
  }

  // Lấy các thông tin từ JSON
  String studentName = doc["name"];
  String studentID = doc["id"];

  // Hiển thị thông tin lên màn hình OLED hoặc LCD
  // Giả sử bạn có hàm `displayOnScreen` để hiển thị
  displayOnScreen(studentName, studentID);
}