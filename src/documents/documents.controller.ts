import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

// Cấu hình Multer lưu tệp vào thư mục ./uploads
const storageOptions = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads';
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExt = extname(file.originalname);
    cb(null, `${uniqueSuffix}${fileExt}`);
  },
});

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  /**
   * API Upload tệp theo userId
   * POST /documents/upload
   * Body: multipart/form-data chứa 'userId' và 'file'
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageOptions,
      limits: {
        fileSize: 50 * 1024 * 1024, // Hạn chế 50MB
      },
    }),
  )
  async uploadFile(
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn một tệp để tải lên');
    }

    return this.documentsService.createDocument(dto.userId, file);
  }

  /**
   * API Lấy thông tin tài liệu theo Document ID
   * GET /documents/:id
   */
  @Get(':id')
  async getDocumentById(@Param('id') id: string) {
    return this.documentsService.getDocumentById(id);
  }

  /**
   * API Lấy danh sách tài liệu của một User
   * GET /documents/user/:userId
   */
  @Get('user/:userId')
  async getDocumentsByUserId(@Param('userId') userId: string) {
    return this.documentsService.getDocumentsByUserId(userId);
  }
}
