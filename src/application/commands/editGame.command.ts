import {ICommand} from "@nestjs/cqrs";
import {EditPublisherEntityType} from "../../core/domain/entities/type/editPublisher.entity.type";

export class EditGameCommand implements ICommand {
  constructor(
      public readonly title: string,
      public readonly price: number,
      public readonly publisher: EditPublisherEntityType,
      public readonly tags: string[],
      public readonly releaseDate: string,
) {}

}

