import {ICommand} from "@nestjs/cqrs";
import {CreatePublisherEntityType} from "../../core/domain/entities/type/createPublisher.entity.type";

export class CreateGameCommand implements ICommand {

  constructor(
      public readonly title: string,
      public readonly price: number,
      public readonly publisher: CreatePublisherEntityType,
      public readonly tags: string[],
      public readonly releaseDate: string,
  ) {}

}
