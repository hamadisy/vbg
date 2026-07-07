import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/authenticated-request.interface';
import { User } from '../../users/entity/user.entity';
import { UsersService } from '../../users/control/users.service';
import { UserResponseDto } from '../../users/boundary/dto/user-response.dto';
import { AuthService } from '../control/auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // Any authenticated role - not just Admin (unlike GET /users/:id). The
  // frontend needs this for its own profile (language preference, display
  // name), which isn't carried in the JWT payload.
  @ApiBearerAuth()
  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser): Promise<UserResponseDto> {
    const found = await this.usersService.findById(user.id);
    return plainToInstance(UserResponseDto, found, { excludeExtraneousValues: true });
  }

  // Body DTO is kept alongside passport-local (which reads req.body itself)
  // purely so Swagger documents the expected request shape and validation runs.
  @Public()
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() _dto: LoginDto, @Req() req: Request & { user: User }): AuthTokenResponseDto {
    return this.authService.login(req.user);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ message: string }> {
    await this.authService.forgotPassword(dto.email);
    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Password updated.' };
  }
}
