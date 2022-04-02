import {Repository} from 'typeorm';
import {GameRepositoryPort} from "../../../../../core/domain/port/persistence/game.repository.port";
import {TypeOrmGameEntity} from "../entity/typeOrmGame.entity";
import {Game} from "../../../../../core/domain/entities/game";
import {RepositoryFindOptions} from "../../../../../core/common/persistence/RepositoryOptions";
import {Optional} from "../../../../../core/common/type/CommonTypes";
import {Injectable} from "@nestjs/common";
import {TypeOrmGameMapper} from "../mapper/typeOrmGame.mapper";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class TypeOrmGameRepositoryAdapter implements GameRepositoryPort {

  constructor(
      @InjectRepository(TypeOrmGameEntity) private gameRepository: Repository<TypeOrmGameEntity>
  ) {}

  async addGame(game: Game): Promise<Game> {
    const gameEntity = TypeOrmGameMapper.toOrmEntity(game);
    return TypeOrmGameMapper.toDomainEntity(await this.gameRepository.save(gameEntity));
  }

  async findGame(by: { id?:string, title?: string }): Promise<Optional<Game>> {
    const gameEntity = await this.gameRepository.findOne({where: by});
    return TypeOrmGameMapper.toDomainEntity(gameEntity);
  }

  async findGames(by: { tags?:string[], releaseDate?: Date, publisherName?:string, publisherSiret?:number }, options?: RepositoryFindOptions): Promise<Game[]> {
    //Construct By Object.
    const byGame = {
      ...( by.releaseDate !==undefined && {releaseDate: by.releaseDate}),
      ...((by.publisherName !==undefined || by.publisherSiret !== undefined) &&
          { publisher : {
              ...(by.publisherName !== undefined && {name: by.publisherName}),
              ...(by.publisherSiret !== undefined && {siret: by.publisherSiret})
            }
          }
      )
    }
    let gamesEntity = null;
    if (by.tags !== undefined && by.tags.length > 0) {
      //Specific case of research by tags
      gamesEntity = await this.gameRepository.createQueryBuilder("game")
          .where(byGame)
          .andWhere("game.tags && ARRAY[:...tags]", {tags: by.tags})
          .skip(options?.offset)
          .take(options?.limit)
          .getMany();
    } else {
      gamesEntity = await this.gameRepository.find({where:byGame,skip:options?.offset,take:options?.limit});
    }

    return TypeOrmGameMapper.toDomainEntities(gamesEntity);
  }

  async removeGame(game: Game): Promise<void> {
    const gameEntity = TypeOrmGameMapper.toOrmEntity(game);
    await this.gameRepository.remove(gameEntity);
  }

  async updateGame(game: Game): Promise<void> {
    const gameEntity = TypeOrmGameMapper.toOrmEntity(game);
    await this.gameRepository.save(gameEntity);
  }

}
