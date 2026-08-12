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
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
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

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  /**
   * API Upload tệp theo userId
   * POST /documents/upload
   */
  @Post('upload')
  @ApiOperation({
    summary: 'Upload một tệp theo User ID',
    description:
      'API tiếp nhận tệp tải lên (dạng multipart/form-data) cùng với userId, lưu tệp vào thư mục và ghi nhận thông tin tài liệu vào CSDL.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Thông tin userId và tệp tải lên',
    schema: {
      type: 'object',
      required: ['userId', 'file'],
      properties: {
        userId: {
          type: 'string',
          description: 'ID của người dùng sở hữu tệp',
          example: 'user-123',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Tệp cần tải lên',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Lưu tệp thành công',
    schema: {
      example: {
        message: 'Lưu tệp thành công',
        data: {
          id: 'd64a352c-d78a-499a-9880-c365c9b6694e',
          userId: 'user-123',
          fileName: '1786519382420-663931422.pdf',
          originalName: 'tailieu.pdf',
          mimeType: 'application/pdf',
          size: 10240,
          filePath: 'uploads/1786519382420-663931422.pdf',
          createdAt: '2026-08-12T07:23:02.431Z',
          updatedAt: '2026-08-12T07:23:02.431Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Thiếu tệp hoặc dữ liệu userId không hợp lệ' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageOptions,
      limits: {
        fileSize: 50 * 1024 * 1024, // Giới hạn 50MB
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
  @ApiOperation({ summary: 'Lấy thông tin tài liệu theo Document ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID của tài liệu trong CSDL',
    example: 'd64a352c-d78a-499a-9880-c365c9b6694e',
  })
  @ApiResponse({ status: 200, description: 'Trả về thông tin chi tiết tài liệu' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tài liệu với ID này' })
  async getDocumentById(@Param('id') id: string) {
    return this.documentsService.getDocumentById(id);
  }

  /**
   * API Lấy danh sách tài liệu của một User
   * GET /documents/user/:userId
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy danh sách tất cả tài liệu của một User' })
  @ApiParam({
    name: 'userId',
    description: 'ID của người dùng',
    example: 'user-123',
  })
  @ApiResponse({ status: 200, description: 'Trả về danh sách các tài liệu thuộc sở hữu của User' })
  async getDocumentsByUserId(@Param('userId') userId: string) {
    return this.documentsService.getDocumentsByUserId(userId);
  }
}
