import {Publisher} from "../publisher";
import {CreatePublisherEntityType} from "./createPublisher.entity.type";

export type CreateGameEntityType = {
  id: string,
  title: string,
  price: number,
  publisher: CreatePublisherEntityType,
  tags: string[],
  releaseDate: Date,
};
