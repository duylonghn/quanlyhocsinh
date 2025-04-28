#ifndef FONT_H
#define FONT_H
// Hàm xóa dấu tiếng Việt
String removeVietnameseTones(String str) {
  str.replace("à", "a"); str.replace("á", "a"); str.replace("ạ", "a");
  str.replace("ả", "a"); str.replace("ã", "a"); str.replace("â", "a");
  str.replace("ầ", "a"); str.replace("ấ", "a"); str.replace("ậ", "a");
  str.replace("ẩ", "a"); str.replace("ẫ", "a"); str.replace("ă", "a");
  str.replace("ằ", "a"); str.replace("ắ", "a"); str.replace("ặ", "a");
  str.replace("ẳ", "a"); str.replace("ẵ", "a");
  str.replace("è", "e"); str.replace("é", "e"); str.replace("ẹ", "e");
  str.replace("ẻ", "e"); str.replace("ẽ", "e"); str.replace("ê", "e");
  str.replace("ề", "e"); str.replace("ế", "e"); str.replace("ệ", "e");
  str.replace("ể", "e"); str.replace("ễ", "e");
  str.replace("ì", "i"); str.replace("í", "i"); str.replace("ị", "i");
  str.replace("ỉ", "i"); str.replace("ĩ", "i");
  str.replace("ò", "o"); str.replace("ó", "o"); str.replace("ọ", "o");
  str.replace("ỏ", "o"); str.replace("õ", "o"); str.replace("ô", "o");
  str.replace("ồ", "o"); str.replace("ố", "o"); str.replace("ộ", "o");
  str.replace("ổ", "o"); str.replace("ỗ", "o"); str.replace("ơ", "o");
  str.replace("ờ", "o"); str.replace("ớ", "o"); str.replace("ợ", "o");
  str.replace("ở", "o"); str.replace("ỡ", "o");
  str.replace("ù", "u"); str.replace("ú", "u"); str.replace("ụ", "u");
  str.replace("ủ", "u"); str.replace("ũ", "u"); str.replace("ư", "u");
  str.replace("ừ", "u"); str.replace("ứ", "u"); str.replace("ự", "u");
  str.replace("ử", "u"); str.replace("ữ", "u");
  str.replace("ỳ", "y"); str.replace("ý", "y"); str.replace("ỵ", "y");
  str.replace("ỷ", "y"); str.replace("ỹ", "y");
  str.replace("đ", "d");

  str.replace("À", "A"); str.replace("Á", "A"); str.replace("Ạ", "A");
  str.replace("Ả", "A"); str.replace("Ã", "A"); str.replace("Â", "A");
  str.replace("Ầ", "A"); str.replace("Ấ", "A"); str.replace("Ậ", "A");
  str.replace("Ẩ", "A"); str.replace("Ẫ", "A"); str.replace("Ă", "A");
  str.replace("Ằ", "A"); str.replace("Ắ", "A"); str.replace("Ặ", "A");
  str.replace("Ẳ", "A"); str.replace("Ẵ", "A");
  str.replace("È", "E"); str.replace("É", "E"); str.replace("Ẹ", "E");
  str.replace("Ẻ", "E"); str.replace("Ẽ", "E"); str.replace("Ê", "E");
  str.replace("Ề", "E"); str.replace("Ế", "E"); str.replace("Ệ", "E");
  str.replace("Ể", "E"); str.replace("Ễ", "E");
  str.replace("Ì", "I"); str.replace("Í", "I"); str.replace("Ị", "I");
  str.replace("Ỉ", "I"); str.replace("Ĩ", "I");
  str.replace("Ò", "O"); str.replace("Ó", "O"); str.replace("Ọ", "O");
  str.replace("Ỏ", "O"); str.replace("Õ", "O"); str.replace("Ô", "O");
  str.replace("Ồ", "O"); str.replace("Ố", "O"); str.replace("Ộ", "O");
  str.replace("Ổ", "O"); str.replace("Ỗ", "O"); str.replace("Ơ", "O");
  str.replace("Ờ", "O"); str.replace("Ớ", "O"); str.replace("Ợ", "O");
  str.replace("Ở", "O"); str.replace("Ỡ", "O");
  str.replace("Ù", "U"); str.replace("Ú", "U"); str.replace("Ụ", "U");
  str.replace("Ủ", "U"); str.replace("Ũ", "U"); str.replace("Ư", "U");
  str.replace("Ừ", "U"); str.replace("Ứ", "U"); str.replace("Ự", "U");
  str.replace("Ử", "U"); str.replace("Ữ", "U");
  str.replace("Ỳ", "Y"); str.replace("Ý", "Y"); str.replace("Ỵ", "Y");
  str.replace("Ỷ", "Y"); str.replace("Ỹ", "Y");
  str.replace("Đ", "D");

  return str;
}

#endif