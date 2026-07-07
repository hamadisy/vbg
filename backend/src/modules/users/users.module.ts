import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { USER_REPOSITORY } from './entity/user.repository.port';
import { UserTypeOrmRepository } from './entity/user.repository.adapter';
import { UsersService } from './control/users.service';
import { UsersController } from './boundary/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, { provide: USER_REPOSITORY, useClass: UserTypeOrmRepository }],
  exports: [USER_REPOSITORY, UsersService],
})
export class UsersModule {}
