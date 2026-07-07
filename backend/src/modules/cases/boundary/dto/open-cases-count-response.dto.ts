import { ApiProperty } from '@nestjs/swagger';

export class OpenCasesCountResponseDto {
  @ApiProperty() count: number;
}
