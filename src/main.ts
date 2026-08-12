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
    .setTitle('Document Management API - NestJS')
    .setDescription(
      'API quản lý và lưu trữ tệp theo User ID (kèm thông tin tài liệu, tệp, userId trong CSDL)',
    )
    .setVersion('1.0')
    .addTag('Documents', 'Các API xử lý tải lên và truy vấn tài liệu')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 NestJS Document API is running on: http://localhost:${port}`);
  console.log(`📖 Swagger UI testing is available at: http://localhost:${port}/api/docs`);
}

bootstrap();
