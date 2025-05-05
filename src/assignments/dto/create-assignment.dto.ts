import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskType } from '../../common/enums/enum';

export class CreateAssignmentDto {
  @ApiProperty({
    description: 'Modul IDsi',
    example: '64f89ad1230e3e0aef9b672c',
  })
  @IsMongoId()
  module_id: string;

  @ApiProperty({
    description: 'Topshiriq savoli',
    example: 'Bu modul uchun qisqacha yozing',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    description: 'Topshiriq turi',
    enum: TaskType,
    example: 'auto',
  })
  @IsEnum(TaskType)
  type: TaskType;
}
