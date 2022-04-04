import {ICommand} from "@nestjs/cqrs";

export class RemoveGameCommand implements ICommand {
  constructor(
      public readonly slug: string,
  ) {}
}