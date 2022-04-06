import {Optional} from "../../../common/type/common.types";
import {Game} from "../../entities/game";
import {RepositoryFindOptions} from "../../../common/persistence/repositoryOptions";

export interface GameRepositoryPort {

  findGame(by: { id?:string, slug?: string }): Promise<Optional<Game>>;

  findGames(by: { title?:string, tags?:string[], price?:number, releaseDate?: Date, publisherName?:string, publisherSiret?:number, releaseDateOlderThan?:Date, releaseDateYoungerThan?: Date }, options?: RepositoryFindOptions): Promise<Game[]>;

  addGame(game: Game): Promise<Game>;

  updateGames(game: Game | Game[]): Promise<Game | Game[]>;

  removeGames(game: Game | Game[]): Promise<void>;

}
