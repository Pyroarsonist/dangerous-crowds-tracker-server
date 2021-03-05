import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, RegisterRequestDto } from 'api/auth/dtos';
import { AuthGuard } from 'common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get()
  checkToken(): void {
    return;
  }

  @Post('login')
  public login(@Body() user: LoginRequestDto): Promise<string> {
    return this.authService.login(user.email, user.password);
  }

  @Post('register')
  public register(@Body() dto: RegisterRequestDto): Promise<string> {
    return this.authService.register(
      dto.email,
      dto.password,
      dto.name,
      dto.birthDate,
    );
  }
}
