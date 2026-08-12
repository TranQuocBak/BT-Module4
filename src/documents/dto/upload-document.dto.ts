import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentDto {
  @ApiProperty({
    description: 'ID của người dùng sở hữu tệp',
    example: 'user-123',
  })
  @IsNotEmpty({ message: 'userId không được để trống' })
  @IsString({ message: 'userId phải là một chuỗi' })
  userId: string;
}
