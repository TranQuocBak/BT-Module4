import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kích hoạt ValidationPipe toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Cấu hình Swagger UI
  const config = new DocumentBuilder()
    .setTitle('Document & User Management API - NestJS')
    .setDescription(
      'Hệ thống API quản lý Người dùng (Users) và Lưu trữ Tệp theo User ID (Documents) bằng NestJS, Prisma & SQLite',
    )
    .setVersion('1.0')
    .addTag('Users', 'Các API quản lý người dùng (Tạo User, Xem danh sách User)')
    .addTag('Documents', 'Các API xử lý tải lên và truy vấn tài liệu theo User ID')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 NestJS Document API is running on: http://localhost:${port}`);
  console.log(`📖 Swagger UI testing is available at: http://localhost:${port}/api/docs`);
}

bootstrap();
