import {EditPublisherCommand} from "../../application/commands/editPublisher.command";

export class EditGameHttpQuery {
  constructor(
      public readonly title: string,
      public readonly price: number,
      public readonly publisher: EditPublisherCommand,
      public readonly tags: string[],
      public readonly releaseDate: string,
) {}

}

