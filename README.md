# BT-Module4: Document & User Management API

Hệ thống API quản lý Người dùng (**Users**) và Lưu trữ Tệp theo User ID (**Documents**) được phát triển bằng **NestJS**, **Prisma ORM** và **SQLite**.

---

## 👥 Thành viên nhóm & Phân công công việc

| Thành viên | MSSV | Nhiệm vụ chính |
| :--- | :--- | :--- |
| **Đào Xuân Bảo** | N22DCCN005 | Xây dựng các API phần User (`/users`) |
| **Trần Quốc Bảo** | N22DCCN007 | Xây dựng các API phần Document (`/documents`) |

---

## 🛠️ Công nghệ sử dụng

- **Framework:** NestJS (v10)
- **Database:** SQLite (thông qua Prisma ORM v5)
- **File Upload:** Multer (`@nestjs/platform-express`)
- **Validation:** `class-validator`, `class-transformer`
- **Documentation:** Swagger UI (`@nestjs/swagger`)

---

## 🚀 Hướng dẫn cài đặt & Chạy dự án

### 1. Cài đặt các phụ thuộc (Dependencies)
```bash
npm install
```

### 2. Khởi tạo Cơ sở dữ liệu với Prisma
```bash
# Tạo mã client Prisma
npm run prisma:generate

# Đồng bộ schema vào cơ sở dữ liệu SQLite (dev.db)
npm run prisma:push
```

### 3. Khởi chạy Server
```bash
# Chế độ phát triển (Development mode - hot reload)
npm run start:dev

# Chế độ Production
npm run build
npm run start:prod
```

Server mặc định chạy tại: **`http://localhost:3000`**

---

## 📖 Tài liệu API (Swagger UI)

Khi ứng dụng đang chạy, truy cập đường dẫn sau để xem giao diện Swagger UI và thử nghiệm API trực tiếp:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## 📌 Danh sách API Specs

### 👤 1. Module User (`/users`)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `POST` | `/users` | Tạo người dùng mới (`name`, `email`) |
| `GET` | `/users` | Lấy danh sách tất cả người dùng (kèm danh sách tệp) |
| `GET` | `/users/:id` | Lấy thông tin chi tiết của một người dùng theo ID |

### 📁 2. Module Document (`/documents`)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `POST` | `/documents/upload` | Tải tệp lên hệ thống theo `userId` (form-data: `userId`, `file`) |
| `GET` | `/documents/:id` | Lấy thông tin chi tiết của một tệp theo Document ID |
| `GET` | `/documents/user/:userId` | Lấy danh sách tất cả tệp thuộc sở hữu của `userId` |

---

## 📂 Cấu trúc dự án

```text
BT-Module4/
├── prisma/
│   ├── schema.prisma       # Cấu hình CSDL SQLite & Models (User, Document)
│   └── dev.db              # Database SQLite (sinh ra khi push)
├── src/
│   ├── main.ts             # Entry point, cấu hình ValidationPipe & Swagger
│   ├── app.module.ts       # Main Application Module
│   ├── prisma/             # Prisma Service & Module
│   ├── users/              # Controller, Service, DTO cho User
│   └── documents/          # Controller, Service, DTO cho Document
├── uploads/                # Thư mục chứa các tệp đã upload
└── README.md
```
