import { UserEntity } from '@/common/decorators/user.decorator';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';
import { ChangeEmailInput } from './dto/change-email.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @Mutation(() => User)
  async updateUser(@UserEntity() user: User, @Args('data') newUserData: UpdateUserInput) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @Mutation(() => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput,
  ) {
    return this.usersService.changePassword(user.id, user.password, changePassword);
  }

  @Mutation(() => User)
  async changeEmail(@UserEntity() user: User, @Args('data') input: ChangeEmailInput) {
    return this.usersService.changeEmail(user.id, user.password, input);
  }

  @ResolveField('projects')
  projects(@Parent() author: User) {
    return this.prisma.user
      .findUnique({ where: { id: author.id } })
      .projects({ include: { project: true } });
  }
}
