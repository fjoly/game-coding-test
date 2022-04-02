import {RepositoryFindOptions} from "../../../common/persistence/RepositoryOptions";
import {Optional} from "../../../common/type/CommonTypes";
import {Game} from "../../entities/game";
import {Publisher} from "../../entities/publisher";

export interface GameRepositoryPort {

  findGame(by: { id?:string, title?: string }): Promise<Optional<Game>>;

  findGames(by: { tags?:string[], releaseDate?: Date, publisherName?:string, publisherSiret?:number }, options?: RepositoryFindOptions): Promise<Game[]>;

  addGame(game: Game): Promise<Game>;

  updateGame(game: Game): Promise<void>;

  removeGame(game: Game): Promise<void>;

}
