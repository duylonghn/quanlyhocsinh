#include <Adafruit_SH110X.h>
#include <LiquidCrystal_I2C.h>
#include <time.h>
#include <WiFi.h>
#include "Bitmap.h"

// OLED SH1106
Adafruit_SH1106G oled = Adafruit_SH1106G(128, 64, &Wire, -1);
#define WHITE SH110X_WHITE
#define BLACK SH110X_BLACK

#define FRAME_DELAY (42)
#define FRAME_WIDTH (64)
#define FRAME_HEIGHT (64)
#define FRAME_COUNT (sizeof(confirm) / sizeof(confirm[0]))
int frame = 0;
// LCD 1602
LiquidCrystal_I2C lcd(0x27, 16, 2);

void checkOled() {
  // Kiểm tra kết nối oled
  if (!oled.begin()) {
    Serial.println(F("Display allocation failed"));
    for (;;); // Dừng chương trình nếu không khởi tạo được màn hình oled
  } else {
    Serial.println("OLED: done");
  }
};

void checkLCD() {
  lcd.init();
  lcd.backlight();
  lcd.print("Dang khoi dong...");
  Serial.println("LCD: done");
}

// Hàm vẽ bitmap
void drawBitmap(const uint8_t* bitmap, int16_t x, int16_t y, int16_t width, int16_t height) {
  oled.clearDisplay();
  oled.drawBitmap(x, y, bitmap, width, height, WHITE);  // Vẽ bitmap tại tọa độ (x, y) với kích thước width x height
  oled.display();
};

void displayConnectWifi(const char* ssid) {
  oled.clearDisplay();
  oled.setTextColor(WHITE);
  drawBitmap(DisableWifi, 0, 0, 128, 12);
  oled.setCursor(0,14);
  oled.print("SSID: ");
  oled.println(ssid);
};

void displayConnectedWifi() {
  oled.clearDisplay();
  oled.setTextColor(WHITE);
  drawBitmap(EnableWifi, 0, 0, 128, 12);
  oled.setCursor(0,14);
  oled.println("Wifi Connected");
  oled.print("\nIP: ");
  oled.print(WiFi.localIP());
  oled.display();
  delay(3000);
  oled.clearDisplay();
};

void displayConnectedNTP() {
  oled.setTextColor(WHITE);
  drawBitmap(EnableWifi, 0, 0, 128, 12);
  oled.setCursor(0,14);
  oled.println("Time response: OK");
  Serial.println("Time response: OK");
  oled.display();
  delay(5000);
  oled.clearDisplay();
};

bool connectWifi(const char* ssid, const char* pass) {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);
  Serial.print("\nConnecting to ");
  Serial.println(ssid);

  unsigned long startAttemptTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {
    displayConnectWifi(ssid); // Hiển thị thông tin trên oled
    delay(500); // thêm delay để tránh vòng lặp quá nhanh
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected to WiFi!");
    return true;
  } else {
    Serial.println("Failed to connect to WiFi.");
    return false;
  }
}


void connectedWifi(const char*ssid) {
  Serial.println("Connected to " + String(ssid));
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  displayConnectedWifi();
};

void displayConnectingNTP() {
  static int dotCount = 0;
  oled.clearDisplay();
  oled.setTextColor(WHITE);
  drawBitmap(EnableWifi, 0, 0, 128, 12);
  oled.setCursor(0,14);
  oled.println("Connecting to NTP");
  Serial.println("Connecting to NTP");
  for (int i = 0; i <= dotCount; i++) {
    oled.print(".");
  }
  oled.display();
  dotCount = (dotCount + 1) % 3;
};

void displayWifiAP(const char* ssidAP) {
  oled.clearDisplay();
  oled.setTextColor(WHITE);
  drawBitmap(DisableWifi, 0, 0, 128, 12);
  oled.setCursor(0,14);
  oled.print("Can't connect to wifi");
  oled.print("\n\nStarting AP mode");
  oled.print("\n\nSSID: ");
  oled.print(ssidAP);
  oled.display();
};
int timezone = 7 * 3600;
int dst = 0;

bool connectNTP() {
  const unsigned long timeout = 10000; // 10 giây timeout
  unsigned long startTime = millis(); // Lấy thời điểm bắt đầu

  // Cấu hình thời gian NTP
  configTime(timezone, dst, "pool.ntp.org", "time.nist.gov");
  
  while (!time(nullptr)) {
    if (millis() - startTime >= timeout) {
      Serial.println("NTP connection timeout");
      return false; // Timeout sau 10 giây
    }
    displayConnectingNTP();
    Serial.print(".");
    delay(1000); // Chờ 1 giây giữa các lần thử kết nối
  }
  return true; // Kết nối thành công
};

// Khai báo biến thời gian
time_t now;
struct tm* p_tm;

void updateTime() {
  // Lấy thời gian hiện tại và cập nhật biến toàn cục
  now = time(nullptr);
  p_tm = localtime(&now);
};

void displayTimeSerial() {
  updateTime();
  
  // Hiển thị qua Serial
  Serial.print(p_tm->tm_mday);
  Serial.print("/");
  Serial.print(p_tm->tm_mon + 1);
  Serial.print("/");
  Serial.print(p_tm->tm_year + 1900);
  
  Serial.print(" ");
  
  Serial.print(p_tm->tm_hour);
  Serial.print(":");
  Serial.print(p_tm->tm_min);
  Serial.print(":");
  Serial.println(p_tm->tm_sec);
};

void displayTime() {
  updateTime();
  
  // Hiển thị giờ phút trên màn hình
  oled.fillRect(50, 0, 30, 11, BLACK);
  oled.setTextSize(1);
  oled.setTextColor(WHITE);
  oled.setCursor(50, 2);
  
  if (p_tm->tm_hour < 10)
    oled.print("0"); 
    oled.print(p_tm->tm_hour);
    oled.print(":");
  
  if (p_tm->tm_min < 10)
    oled.print("0"); 
    oled.print(p_tm->tm_min);
  oled.display();
};

// Hiển thị mặc định
void showDefaultDisplay() {
  Serial.println("Scan your card...");
  lcd.clear();
  oled.clearDisplay();
  oled.setTextSize(1);
  oled.setTextColor(WHITE);
  drawBitmap(EnableWifi, 0, 0, 128, 12);
  oled.setCursor(10, 35);
  oled.print("Scan your card...");
  lcd.print("Scan your card...");
  oled.display();
}

