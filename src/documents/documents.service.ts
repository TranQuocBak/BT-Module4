import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDocument(userId: string, file: Express.Multer.File) {
    const document = await this.prisma.document.create({
      data: {
        userId,
        fileName: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        filePath: file.path.replace(/\\/g, '/'),
      },
    });

    return {
      message: 'Lưu tệp thành công',
      data: document,
    };
  }

  async getDocumentById(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Không tìm thấy tài liệu với ID: ${id}`);
    }

    return document;
  }

  async getDocumentsByUserId(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
