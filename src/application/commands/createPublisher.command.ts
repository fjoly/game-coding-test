import {ICommand} from "@nestjs/cqrs";

export class CreatePublisherCommand implements ICommand {
  constructor(
      public readonly name: string,
      public readonly siret: number,
      public readonly phone: string,
) {}
}

