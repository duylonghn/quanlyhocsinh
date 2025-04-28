#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "GUI.h"
// Còi
#define BUZZER_PIN 23

// Biến để theo dõi thời gian và frame cho ảnh động
unsigned long lastFrameTime = 0;
unsigned long lastFrameTimeFail = 0;
unsigned long lastFrameTimeLoader = 0;
unsigned long frameDelay = 100;  // Thời gian thay đổi frame (ms)

void displayConfirm() {
  oled.clearDisplay();

  digitalWrite(BUZZER_PIN, HIGH);
  delay(50);
  digitalWrite(BUZZER_PIN, LOW);
  delay(100);

  for (int i = 0; i < FRAME_COUNT; i++) {
    oled.clearDisplay();
    oled.drawBitmap(32, 0, confirm[i], FRAME_WIDTH, FRAME_HEIGHT, 1);
    oled.display();
    delay(100);
  }
  digitalWrite(BUZZER_PIN, HIGH);
  delay(50);
  digitalWrite(BUZZER_PIN, LOW);
}

void displayFail() {
  oled.clearDisplay();
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
    delay(100);
  }
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

// Hàm hiển thị thông tin lên màn hình (thay đổi tùy thuộc vào loại màn hình bạn sử dụng)
void displayOnScreen(String name, String id) {
  oled.clearDisplay();
  lcd.clear();

  int lcdWidth = 16;                     // Số cột LCD, chỉnh lại 20 nếu bạn dùng LCD 20x4
  unsigned long displayDuration = 5000;  // 5 giây
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

  // Sau 5 giây thì trở về màn hình mặc định
  showDefaultDisplay();
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