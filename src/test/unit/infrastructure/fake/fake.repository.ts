import {Game} from "../../../../core/domain/entities/game";
import {RepositoryFindOptions} from "../../../../core/common/persistence/repositoryOptions";

export class FakeRepository {

    static gameRepositoryPort = {
        updateGames: jest.fn(
            async (game: Game) => {
                return game;
            }
        ),
        addGame: jest.fn(
            async (game: Game) => {
                return game;
            }
        ),
        findGame: jest.fn(
            async (by: { id?:string, slug?: string }) => {
                return null;
            }
        ),
        findGames: jest.fn(
            async (by: { title?:string, tags?:string[], releaseDate?: Date, publisherName?:string, publisherSiret?:number, releaseDateOlderThan?:Date, releaseDateYoungerThan?: Date }, options?: RepositoryFindOptions) => {
                return [];
            }
        ),
        removeGames: jest.fn(
            async (game: Game | Game[]) => {
                return ;
            }
        ),
    }

    static publisherRepositoryPort = {
        findPublisher: jest.fn(
            async (by: { id?: string; name?: string; siret?: number; slug?: string }) => {
                return null;
            }
        ),
    }

}