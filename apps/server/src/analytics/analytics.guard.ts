import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";

import { Roles, RolesScopeEnum } from "@/common/decorators/roles.decorator";
import { ProjectsService } from "@/projects/projects.service";
import { EnvironmentsService } from "@/environments/environments.service";
import { ContentsService } from "@/contents/contents.service";

export class AnalyticsGuard implements CanActivate {
  private readonly reflector: Reflector;

  constructor(
    @Inject(EnvironmentsService)
    private readonly environmentsService: EnvironmentsService,
    @Inject(ProjectsService)
    private readonly projectsService: ProjectsService,
    @Inject(ContentsService)
    private readonly contentsService: ContentsService
  ) {
    this.reflector = new Reflector();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    let { req } = ctx.getContext();
    let args = ctx.getArgs();

    let environmentId: undefined | string;

    let contentId =
      args.contentId || args.query?.contentId || args.data?.contentId;

    const user = req.user;
    const roles = this.reflector.get<RolesScopeEnum>(
      Roles,
      context.getHandler()
    );
    if (!roles) {
      return false;
    }
    if (contentId) {
      const content = await this.contentsService.getContent(contentId);
      if (content) {
        environmentId = content.environmentId;
      }
    }
    if (!environmentId) {
      throw new BadRequestException(
        "Please make sure you have permission to access this project"
      );
    }
    const environment = await this.environmentsService.get(environmentId);
    if (!environment) {
      throw new BadRequestException(
        "Please make sure you have permission to access this project"
      );
    }
    const projectId = environment.projectId;

    const userProject = await this.projectsService.getUserProject(
      user.id,
      projectId
    );
    if (!userProject || !roles.includes(userProject.role)) {
      throw new BadRequestException(
        "Please make sure you have permission to access this project"
      );
    }

    return true;
  }
}
