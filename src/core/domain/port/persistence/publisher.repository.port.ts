import {Optional} from "../../../common/type/common.types";
import {Publisher} from "../../entities/publisher";

export interface PublisherRepositoryPort {

  findPublisher(by: { id?:string, name?: string, siret?: number, slug?:string }): Promise<Optional<Publisher>>;

}
