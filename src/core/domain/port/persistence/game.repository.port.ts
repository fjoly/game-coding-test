import {RepositoryFindOptions} from "../../../common/persistence/RepositoryOptions";
import {Optional} from "../../../common/type/CommonTypes";
import {Game} from "../../entities/game";

export interface GameRepositoryPort {

  findGame(by: { id?:string, slug?: string }): Promise<Optional<Game>>;

  findGames(by: { title?:string, tags?:string[], price?:number, releaseDate?: Date, publisherName?:string, publisherSiret?:number, releaseDateOlderThan?:Date, releaseDateYoungerThan?: Date }, options?: RepositoryFindOptions): Promise<Game[]>;

  addGame(game: Game): Promise<Game>;

  updateGames(game: Game | Game[]): Promise<Game | Game[]>;

  removeGames(game: Game | Game[]): Promise<void>;

}
