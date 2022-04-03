import {EditPublisherEntityType} from "../../core/domain/entities/type/editPublisher.entity.type";

export class EditGameHttpQuery {
  constructor(
      public readonly price: number,
      public readonly publisher: EditPublisherEntityType,
      public readonly tags: string[],
      public readonly releaseDate: string,
) {}

}

