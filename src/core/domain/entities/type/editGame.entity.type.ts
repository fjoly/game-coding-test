import {Publisher} from "../publisher";
import {EditPublisherEntityType} from "./editPublisher.entity.type";

export type EditGameEntityType = {
  title: string,
  price: number,
  publisher: EditPublisherEntityType,
  tags: string[],
  releaseDate: Date,
};
