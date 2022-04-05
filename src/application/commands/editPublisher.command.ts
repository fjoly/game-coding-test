import {ICommand} from "@nestjs/cqrs";

export class EditPublisherCommand implements ICommand {
  constructor(
      public readonly name: string,
      public readonly siret: number,
      public readonly phone: string,
) {}
}

