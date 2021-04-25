import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileRequestDto, ProfileResponseDto } from 'api/profile/dtos';
import { GetUser } from 'common/decorators/current-user.decorator';
import { AuthGuard } from 'common/guards/auth.guard';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  public getProfile(
    @GetUser('id') userId: number,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getProfile(userId);
  }

  @Post()
  public async updateProfile(
    @GetUser('id') userId: number,
    @Body() profile: ProfileRequestDto,
  ): Promise<void> {
    await this.profileService.updateProfile(
      userId,
      profile.name,
      profile.birthDate,
    );
  }
}
