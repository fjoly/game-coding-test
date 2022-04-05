import {RepositoryFindOptions} from "../../../common/persistence/RepositoryOptions";
import {Optional} from "../../../common/type/common.types";
import {Game} from "../../entities/game";
import {Publisher} from "../../entities/publisher";

export interface PublisherRepositoryPort {

  findPublisher(by: { id?:string, name?: string, siret?: number, slug?:string }): Promise<Optional<Publisher>>;

}
