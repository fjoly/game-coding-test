import {IQuery} from "@nestjs/cqrs";

export class GetGameQuery implements IQuery {
  constructor(readonly slug: string) {}
}