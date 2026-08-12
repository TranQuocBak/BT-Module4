import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Tạo người dùng mới
   */
  @Post()
  @ApiOperation({
    summary: 'Tạo người dùng mới',
    description: 'Tạo bản ghi người dùng mới với name và email duy nhất trong hệ thống.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo người dùng thành công',
    schema: {
      example: {
        message: 'Tạo người dùng thành công',
        data: {
          id: 'user-uuid-1234',
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: '2026-08-12T08:23:00.000Z',
          updatedAt: '2026-08-12T08:23:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại trong hệ thống' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * Lấy danh sách toàn bộ người dùng
   */
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả người dùng',
    description: 'Trả về toàn bộ danh sách người dùng kèm theo thông tin các tệp đã upload.',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách người dùng',
  })
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Lấy chi tiết một người dùng
   */
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một người dùng theo ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID của người dùng',
    example: 'user-uuid-1234',
  })
  @ApiResponse({ status: 200, description: 'Trả về thông tin chi tiết người dùng' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
