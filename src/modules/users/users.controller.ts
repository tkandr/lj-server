import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dtos/user.dto';
import { UsersService } from './users.service';

export const USERS_CONTROLLER_PREFIX: string = <const>'users';

@Controller(USERS_CONTROLLER_PREFIX)
@ApiTags(USERS_CONTROLLER_PREFIX)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserResponseDto })
  getHello() {
    return {
      id: 1,
      walletAddress: '0x1234567890',
    };
  }
}
