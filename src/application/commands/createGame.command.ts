import {ICommand} from "@nestjs/cqrs";
import {CreatePublisherEntityType} from "../../core/domain/entities/type/createPublisher.entity.type";
import {CreatePublisherCommand} from "./createPublisher.command";

export class CreateGameCommand implements ICommand {

  constructor(
      public readonly title: string,
      public readonly price: number,
      public readonly publisher: CreatePublisherCommand,
      public readonly tags: string[],
      public readonly releaseDate: string,
  ) {}

}
