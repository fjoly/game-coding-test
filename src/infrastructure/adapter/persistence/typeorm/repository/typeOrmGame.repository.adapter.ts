import {Repository} from 'typeorm';
import {GameRepositoryPort} from "../../../../../core/domain/port/persistence/game.repository.port";
import {TypeOrmGameEntity} from "../entity/typeOrmGame.entity";
import {Game} from "../../../../../core/domain/entities/game";
import {Optional} from "../../../../../core/common/type/common.types";
import {Injectable} from "@nestjs/common";
import {TypeOrmGameMapper} from "../mapper/typeOrmGame.mapper";
import {InjectRepository} from "@nestjs/typeorm";
import {RepositoryFindOptions} from "../../../../../core/common/persistence/repositoryOptions";

@Injectable()
export class TypeOrmGameRepositoryAdapter implements GameRepositoryPort {

  constructor(
      @InjectRepository(TypeOrmGameEntity) private gameRepository: Repository<TypeOrmGameEntity>
  ) {}

  async addGame(game: Game): Promise<Game> {
    const gameEntity = TypeOrmGameMapper.toOrmEntity(game);
    return TypeOrmGameMapper.toDomainEntity(await this.gameRepository.save(gameEntity));
  }

  async findGame(by: { id?:string, slug?: string }): Promise<Optional<Game>> {
    const gameEntity = await this.gameRepository.findOne({where: by});
    return TypeOrmGameMapper.toDomainEntity(gameEntity);
  }

  async findGames(by: { title?:string, tags?:string[], price?:number, releaseDate?: Date, publisherName?:string, publisherSiret?:number, releaseDateOlderThan?:Date, releaseDateYoungerThan?: Date }, options?: RepositoryFindOptions): Promise<Game[]> {
    //Construct By Object.
    const byGame = {
      ...( by.title !== undefined && {title: by.title}),
      ...( by.price !== undefined && {price: by.price}),
      ...( by.releaseDate !==undefined && {releaseDate: by.releaseDate}),
      ...((by.publisherName !==undefined || by.publisherSiret !== undefined) &&
          { publisher : {
              ...(by.publisherName !== undefined && {name: by.publisherName}),
              ...(by.publisherSiret !== undefined && {siret: by.publisherSiret})
            }
          }
      )
    }
    const query = this.gameRepository.createQueryBuilder("game")
        .leftJoinAndSelect("game.publisher", "publisher")
        .where(byGame)
        .skip(options?.offset)
        .take(options?.limit)
    if (by.tags !== undefined && by.tags.length > 0) {
      query.andWhere("game.tags && :tags", {tags: by.tags});
    }

    if (by.releaseDateOlderThan) {
      query.andWhere("game.releaseDate <= :releaseDateOlderThan", {releaseDateOlderThan: by.releaseDateOlderThan});
    }

    if (by.releaseDateYoungerThan) {
      query.andWhere("game.releaseDate >= :releaseDateYoungerThan", {releaseDateYoungerThan: by.releaseDateYoungerThan});
    }
    return TypeOrmGameMapper.toDomainEntities(await query.getMany());
  }

  async removeGames(game: Game | Game[]): Promise<void> {
    let gameEntity;
    if(Array.isArray(game)){
      gameEntity = TypeOrmGameMapper.toOrmEntities(game);
    } else {
      gameEntity = TypeOrmGameMapper.toOrmEntity(game);
    }

    await this.gameRepository.remove(gameEntity);
  }

  async updateGames(game: Game | Game[]): Promise<Game | Game[]> {
    let gameEntity;
    if(Array.isArray(game)){
      gameEntity = TypeOrmGameMapper.toOrmEntities(game);
      return TypeOrmGameMapper.toDomainEntities(await this.gameRepository.save(gameEntity));
    } else {
      gameEntity = TypeOrmGameMapper.toOrmEntity(game);
      return TypeOrmGameMapper.toDomainEntity(await this.gameRepository.save(gameEntity));
    }
  }

}
