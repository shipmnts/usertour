import { BaseModel } from '@/common/models/base.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export enum AttributeBizType {
  USER = 1,
  COMPANY = 2,
  MEMBERSHIP = 3,
  EVENT = 4,
}

export enum AttributeDataType {
  Number = 1,
  String = 2,
  Boolean = 3,
  List = 4,
  DateTime = 5,
  RandomAB = 6,
  RandomNumber = 7,
}

@ObjectType()
export class Attribute extends BaseModel {
  @Field(() => Int)
  bizType: number;

  @Field(() => String)
  projectId: string;

  @Field(() => String)
  displayName: string;

  @Field(() => String)
  codeName: string;

  @Field(() => String)
  description?: string;

  @Field(() => Int)
  dataType: number;

  @Field(() => Boolean)
  predefined: boolean;
}
