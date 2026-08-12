import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo người dùng mới
   */
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(`Email ${createUserDto.email} đã được sử dụng`);
    }

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    return {
      message: 'Tạo người dùng thành công',
      data: user,
    };
  }

  /**
   * Lấy danh sách toàn bộ người dùng
   */
  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        documents: true,
      },
    });
  }

  /**
   * Lấy chi tiết một người dùng theo ID
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        documents: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID: ${id}`);
    }

    return user;
  }
}
