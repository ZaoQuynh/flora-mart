# Flora Mart 🌿

![Flora Mart Banner](assets/flora-mart-banner.png)

**Flora Mart** là một ứng dụng mua bán cây cảnh trực tuyến, giúp người dùng dễ dàng khám phá, mua sắm cây cảnh và nhận hướng dẫn chăm sóc chi tiết, đồng thời cung cấp công cụ quản lý hiệu quả cho người bán và quản trị viên. Dự án được phát triển bởi **Nguyễn Hà Quỳnh Giao** và **Hoàng Công Mạnh** trong học kỳ II, năm học 2024-2025, thuộc môn Lập trình Di động Nâng cao, Trường Đại học Sư phạm Kỹ thuật TP.HCM.

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
  - [Ứng dụng khách hàng (React Native)](#ứng-dụng-khách-hàng-react-native)
  - [Ứng dụng quản lý (Flutter)](#ứng-dụng-quản-lý-flutter)
  - [Backend (Spring Boot)](#backend-spring-boot)
- [Cách sử dụng](#cách-sử-dụng)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)
- [Liên hệ](#liên-hệ)
- [Tài liệu tham khảo](#tài-liệu-tham-khảo)

## Giới thiệu
**Flora Mart** được thiết kế để đáp ứng nhu cầu ngày càng tăng về cây cảnh trong không gian sống đô thị. Ứng dụng không chỉ là một nền tảng thương mại điện tử mà còn là người bạn đồng hành, giúp người dùng chăm sóc cây hiệu quả và lan tỏa lối sống xanh. Dự án bao gồm:
- **Ứng dụng khách hàng** (React Native): Giao diện thân thiện cho người dùng tìm kiếm, mua cây, và xem hướng dẫn chăm sóc.
- **Ứng dụng quản lý** (Flutter): Công cụ mạnh mẽ cho người bán/quản trị viên để quản lý sản phẩm, đơn hàng, và thống kê doanh thu.
- **Backend** (Spring Boot): Hệ thống API REST đảm bảo xử lý dữ liệu an toàn và hiệu quả.

Dự án kết hợp công nghệ hiện đại với xu hướng sống bền vững, mang lại trải nghiệm tiện lợi và ý nghĩa cho cộng đồng yêu cây cảnh.

## Tính năng
### Ứng dụng khách hàng
- Đăng nhập/đăng ký tài khoản với xác thực OTP (YC01, YC02).
- Tìm kiếm và lọc cây cảnh theo giá, loại cây, mức độ chăm sóc (YC05).
- Quản lý giỏ hàng, thanh toán đơn hàng (YC07).
- Xem hướng dẫn chăm sóc chi tiết cho từng loại cây.
- Lưu sản phẩm yêu thích và đánh giá sản phẩm (YC09, YC10).

### Ứng dụng quản lý
- Thống kê doanh thu, số lượng đơn hàng theo thời gian (YC15).
- Quản lý sản phẩm: thêm, sửa, xóa cây cảnh (YC14).
- Quản lý trạng thái đơn hàng: xác nhận, giao hàng (YC13).
- Giao diện trực quan với biểu đồ và danh sách.

### Backend
- API REST hỗ trợ đầy đủ các chức năng CRUD.
- Bảo mật với JWT và mã hóa mật khẩu bằng BCrypt.
- Quản lý cơ sở dữ liệu MySQL (users, products, orders, reviews).

## Công nghệ sử dụng
- **Frontend**:
  - React Native (ứng dụng khách hàng).
  - Flutter (ứng dụng quản lý).
- **Backend**: Spring Boot (Java).
- **Cơ sở dữ liệu**: MySQL.
- **Công cụ**:
  - Visual Studio Code, IntelliJ IDEA, Android Studio, Xcode.
  - Git, GitHub.
- **Thư viện**:
  - React Native: `axios`, `react-navigation`, `async-storage`.
  - Flutter: `http`, `provider`, `flutter_secure_storage`.
  - Spring Boot: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `mysql-connector-java`.

## Yêu cầu hệ thống
- **Hệ điều hành phát triển**: Windows 11, macOS Ventura.
- **Thiết bị thử nghiệm**: iOS 14.0 trở lên, Android 9.0 trở lên.
- **Phần mềm cần thiết**:
  - Node.js (16.x+), npm/yarn (React Native).
  - Flutter SDK (3.x+), Dart (Flutter).
  - Java JDK 17+, Maven (Spring Boot).
  - MySQL Server 8.x.

## Hướng dẫn cài đặt

### Ứng dụng khách hàng (React Native)
1. **Cài đặt môi trường**:
   - Cài Node.js từ [nodejs.org](https://nodejs.org).
   - Cài React Native CLI:
     ```bash
     npm install -g react-native-cli
     ```
   - Cấu hình Android Studio (biến `ANDROID_HOME`) và Xcode (macOS).

2. **Tải dự án**:
   ```bash
   git clone https://github.com/ZaoQuynh/flora-mart.git
   cd flora-mart/client
   ```

3. **Cài đặt phụ thuộc**:
   ```bash
   npm install
   npx pod-install ios
   ```

4. **Chạy ứng dụng**:
   ```bash
   npx react-native run-android
   npx react-native run-ios
   ```

### Ứng dụng quản lý (Flutter)
1. **Cài đặt môi trường**:
   - Tải Flutter SDK từ [flutter.dev](https://flutter.dev).
   - Thêm Flutter vào PATH:
     ```bash
     export PATH="$PATH:/path/to/flutter/bin"
     ```
   - Kiểm tra:
     ```bash
     flutter doctor
     ```

2. **Tải dự án**:
   ```bash
   cd flora-mart/manager
   ```

3. **Cài đặt phụ thuộc**:
   ```bash
   flutter pub get
   ```

4. **Chạy ứng dụng**:
   ```bash
   flutter run
   ```

### Backend (Spring Boot)
1. **Cài đặt môi trường**:
   - Cài Java JDK 17 từ [oracle.com](https://www.oracle.com/java).
   - Cài Maven và MySQL Server.
   - Tạo database:
     ```sql
     CREATE DATABASE floramart;
     ```

2. **Tải dự án**:
   ```bash
   cd flora-mart/backend
   ```

3. **Cấu hình database**:
   - Chỉnh sửa `src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/floramart
     spring.datasource.username=root
     spring.datasource.password=yourpassword
     spring.jpa.hibernate.ddl-auto=update
     ```

4. **Chạy backend**:
   ```bash
   mvn spring-boot:run
   ```

## Cách sử dụng
1. **Khởi động backend**:
   - Chạy backend (Spring Boot) tại `http://localhost:8080`.

2. **Chạy ứng dụng khách hàng**:
   - Mở ứng dụng React Native trên emulator/thiết bị.
   - Đăng nhập/đăng ký, tìm kiếm cây, thêm vào giỏ hàng, và thanh toán.

3. **Chạy ứng dụng quản lý**:
   - Mở ứng dụng Flutter với tài khoản người bán/quản trị.
   - Quản lý sản phẩm, đơn hàng, và xem thống kê.

4. **Kiểm tra API**:
   - Sử dụng Postman để kiểm tra các endpoint như `/api/auth/login`, `/api/products`.

## Đóng góp
Chúng tôi hoan nghênh mọi đóng góp để cải thiện **Flora Mart**! Để đóng góp:
1. Fork repository.
2. Tạo nhánh mới: `git checkout -b feature/ten-chuc-nang`.
3. Commit thay đổi: `git commit -m "Mô tả thay đổi"`.
4. Push lên nhánh: `git push origin feature/ten-chuc-nang`.
5. Tạo Pull Request trên GitHub.

Vui lòng đọc [CONTRIBUTING.md](docs/CONTRIBUTING.md) để biết chi tiết.

## Giấy phép
Dự án được cấp phép theo [MIT License](LICENSE.md). Xem tệp `LICENSE.md` để biết thêm thông tin.

## Liên hệ
- **Nguyễn Hà Quỳnh Giao**: [GitHub](https://github.com/ZaoQuynh) | Email: nguyenhaquynhgiao9569@gmail.com
- **Hoàng Công Mạnh**: [GitHub](https://github.com/congmanhhoang) | Email: hoangmanh6889@gmail.com

## Tài liệu tham khảo
1. Facebook, Inc. (2023). *Getting started with React Native*. React Native. https://reactnative.dev/docs/getting-started
2. Pivotal Software, Inc. (2023). *Getting started: Building a Spring Boot application*. Spring. https://spring.io/guides/gs/spring-boot
3. W3Schools. (n.d.). *MySQL introduction*. W3Schools. https://www.w3schools.com/mysql/mysql_intro.asp
4. Tutorials Point. (n.d.). *Flutter introduction*. Tutorials Point. https://www.tutorialspoint.com/flutter/flutter_introduction.htm
