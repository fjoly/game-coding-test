import {ICommand} from "@nestjs/cqrs";
import {EditPublisherEntityType} from "../../core/domain/entities/type/editPublisher.entity.type";
import {EditPublisherCommand} from "./editPublisher.command";

export class EditGameCommand implements ICommand {
  constructor(
      public readonly slug: string,
      public readonly title: string,
      public readonly price: number,
      public readonly publisher: EditPublisherCommand,
      public readonly tags: string[],
      public readonly releaseDate: string,
) {}

}

