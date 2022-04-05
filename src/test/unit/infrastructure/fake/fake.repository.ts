import {Game} from "../../../../core/domain/entities/game";
import {RepositoryFindOptions} from "../../../../core/common/persistence/repositoryOptions";
import {Repository} from "typeorm";
import {TypeOrmGameEntity} from "../../../../infrastructure/adapter/persistence/typeorm/entity/typeOrmGame.entity";
import {GameRepositoryPort} from "../../../../core/domain/port/persistence/game.repository.port";
import {PublisherRepositoryPort} from "../../../../core/domain/port/persistence/publisher.repository.port";

export class FakeRepository {

    static gameRepositoryPort:GameRepositoryPort = {
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

    static publisherRepositoryPort:PublisherRepositoryPort = {
        findPublisher: jest.fn(
            async (by: { id?: string; name?: string; siret?: number; slug?: string }) => {
                return null;
            }
        ),
    }

}