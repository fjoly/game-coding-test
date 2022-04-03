import {RepositoryFindOptions} from "../../../common/persistence/RepositoryOptions";
import {Optional} from "../../../common/type/CommonTypes";
import {Game} from "../../entities/game";
import {Publisher} from "../../entities/publisher";

export interface PublisherRepositoryPort {

  findPublisher(by: { id?:string, name?: string, siret?: number }): Promise<Optional<Publisher>>;

}
