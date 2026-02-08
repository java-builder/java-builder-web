# OOP là gì?

OOP (Object-Oriented Programming – Lập trình hướng đối tượng) là phương pháp lập trình tổ chức hệ thống dựa trên **đối tượng (object)**. Mỗi đối tượng là một instance của class, đóng gói dữ liệu (state) và hành vi (behavior) liên quan với nhau.

## Mục tiêu của OOP

- Quản lý độ phức tạp của hệ thống
- Giảm coupling, tăng cohesion
- Dễ mở rộng, bảo trì và tái sử dụng

---

## 1. Encapsulation (Đóng gói)

**Định nghĩa:** Encapsulation là việc đóng gói dữ liệu và hành vi vào trong class, đồng thời kiểm soát quyền truy cập bằng access modifier (`private`, `protected`, `public`) nhằm che giấu chi tiết cài đặt (implementation details).

> **Bản chất của Encapsulation là access control, không phải getter/setter.**

### Ví dụ thực tế

Tuổi của user là dữ liệu nội bộ:
- Không cho phép truy cập trực tiếp từ bên ngoài
- Chỉ cho phép truy cập trong phạm vi được kiểm soát

### Ví dụ Java

```java
class User {
    private int age;
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        if (age >= 0) {
            this.age = age;
        }
    }
}
```

### Ý nghĩa

- Bảo vệ dữ liệu
- Kiểm soát state object
- Giảm lỗi do truy cập sai

---

## 2. Inheritance (Kế thừa)

**Định nghĩa:** Inheritance cho phép một class kế thừa thuộc tính và hành vi từ class khác, thể hiện mối quan hệ **IS-A**.

### Ví dụ thực tế

Student là một User, nên có thuộc tính age.

### Ví dụ Java

```java
class User {
    protected int age;
}

class Student extends User {
    private String studentId;
}
```

### Ý nghĩa

- Tái sử dụng code
- Mở rộng hành vi sẵn có
- Tạo cấu trúc phân cấp rõ ràng

### Lưu ý

- Java không hỗ trợ đa kế thừa class
- Có thể đạt đa kế thừa hành vi thông qua interface

---

## 3. Polymorphism (Đa hình)

**Định nghĩa:** Polymorphism là khả năng một hành vi (method) có thể được thực thi theo nhiều cách khác nhau, tùy vào ngữ cảnh hoặc object thực tế.

Trong Java, Polymorphism được chia thành 2 loại:
- **Compile-time Polymorphism**
- **Runtime Polymorphism**

### 3.1 Compile-time Polymorphism (Static Polymorphism)

**Khái niệm:** Compile-time polymorphism xảy ra khi method được chọn tại thời điểm compile.

👉 Trong Java, nó được thể hiện bằng **Method Overloading**.

#### Ví dụ thực tế

Hệ thống tính phí vận chuyển:
- Tính theo cân nặng
- Tính theo cân nặng và khoảng cách

#### Ví dụ Java

```java
class ShippingService {
    public double calculateFee(double weight) {
        return weight * 10;
    }
    
    public double calculateFee(double weight, double distance) {
        return weight * distance * 0.5;
    }
}
```

#### Đặc điểm

- Cùng tên method
- Khác danh sách tham số
- Quyết định khi compile
- Không phụ thuộc object runtime

### 3.2 Runtime Polymorphism (Dynamic Polymorphism)

**Khái niệm:** Runtime polymorphism xảy ra khi method được gọi phụ thuộc vào object thực tế tại runtime, không phụ thuộc kiểu khai báo.

👉 Được thực hiện bằng **Method Overriding + Inheritance / Interface**.

#### Ví dụ thực tế

Hệ thống tính lương nhân viên:
- Nhân viên chính thức: lương cố định
- Nhân viên part-time: lương theo giờ

Hệ thống chỉ cần biết "tính lương", không cần biết loại nhân viên cụ thể.

#### Ví dụ Java

```java
abstract class Employee {
    public abstract double calculateSalary();
}

class FullTimeEmployee extends Employee {
    @Override
    public double calculateSalary() {
        return 1500.0;
    }
}

class PartTimeEmployee extends Employee {
    @Override
    public double calculateSalary() {
        return 10.0 * 120;
    }
}

Employee employee = new PartTimeEmployee();
System.out.println(employee.calculateSalary());
```

➡️ Method được gọi dựa trên object thực tế, không dựa vào kiểu tham chiếu.

### So sánh Compile-time và Runtime Polymorphism

| Tiêu chí | Compile-time | Runtime |
|----------|--------------|---------|
| Thời điểm quyết định | Compile | Runtime |
| Cách thực hiện | Overloading | Overriding |
| Phụ thuộc object | ❌ | ✅ |
| Linh hoạt | Thấp | Cao |

---

## 4. Abstraction (Trừu tượng)

**Định nghĩa:** Abstraction là việc ẩn đi chi tiết triển khai, chỉ phơi bày hành vi cần thiết thông qua abstract class hoặc interface.

> **Tập trung vào WHAT, không quan tâm HOW.**

### Ví dụ thực tế

Hệ thống chỉ cần biết có thể lấy tuổi user, không cần biết dữ liệu đến từ DB, cache hay API.

### Ví dụ Java

```java
interface UserService {
    int getUserAge();
}

class UserServiceImpl implements UserService {
    private User user;
    
    public UserServiceImpl(User user) {
        this.user = user;
    }
    
    @Override
    public int getUserAge() {
        return user.getAge();
    }
}
```

### Ý nghĩa

- Giảm phụ thuộc vào implementation
- Dễ thay đổi, dễ test
- Nền tảng của DI, Spring Framework

---

## Tổng kết

| Tính chất | Bản chất |
|-----------|----------|
| **Encapsulation** | Kiểm soát truy cập |
| **Inheritance** | Quan hệ IS-A |
| **Polymorphism** | Một hành vi, nhiều cách thực thi |
| **Abstraction** | Ẩn chi tiết triển khai |
