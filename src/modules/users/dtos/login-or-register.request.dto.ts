import { ApiProperty } from '@nestjs/swagger';

export class LoginOrRegisterRequestDto {
  @ApiProperty({ example: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B' })
  walletAddress: string;
}
