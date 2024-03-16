import { plainToInstance } from 'class-transformer';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { FullUserResponseDto } from './dtos/full-user.response.dto';
import { LoginOrRegisterRequestDto } from './dtos/login-or-register.request.dto';
import { UsersService } from './users.service';

export const USERS_CONTROLLER_PREFIX: string = <const>'users';

@Controller(USERS_CONTROLLER_PREFIX)
@ApiTags(USERS_CONTROLLER_PREFIX)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:walletAddress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: FullUserResponseDto })
  async getFullUser(
    @Param('walletAddress') walletAddress: string,
  ): Promise<FullUserResponseDto> {
    const user = await this.usersService.getFullUser(walletAddress);

    return plainToInstance(FullUserResponseDto, user);
  }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: FullUserResponseDto })
  async loginOrRegister(
    @Body() payload: LoginOrRegisterRequestDto,
  ): Promise<FullUserResponseDto> {
    const user = await this.usersService.loginOrRegisterUser(
      payload.walletAddress,
    );

    const fullUser = await this.usersService.getFullUser(user.address);

    return plainToInstance(FullUserResponseDto, fullUser);
  }
}
