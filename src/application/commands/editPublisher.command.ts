import {ICommand} from "@nestjs/cqrs";
import {EditPublisherEntityType} from "../../core/domain/entities/type/editPublisher.entity.type";

export class EditPublisherCommand implements ICommand {
  constructor(
      public readonly name: string,
      public readonly siret: number,
      public readonly phone: string,
) {}
}

