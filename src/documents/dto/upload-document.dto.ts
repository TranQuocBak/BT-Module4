import { IsNotEmpty, IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsNotEmpty({ message: 'userId không được để trống' })
  @IsString({ message: 'userId phải là một chuỗi' })
  userId: string;
}
