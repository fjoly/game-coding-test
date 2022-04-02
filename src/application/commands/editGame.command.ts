import {Publisher} from "../../core/domain/entities/publisher";
import {ICommand} from "@nestjs/cqrs";
import {CreatePublisherEntityType} from "../../core/domain/entities/type/createPublisher.entity.type";

export class EditGameCommand implements ICommand {
  constructor(
      public readonly title: string,
      public readonly price: number,
      public readonly publisher: CreatePublisherEntityType,
      public readonly tags: string[],
      public readonly releaseDate: string,
) {}

}

