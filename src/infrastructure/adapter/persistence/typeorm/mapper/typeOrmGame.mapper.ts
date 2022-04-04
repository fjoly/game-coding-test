import {TypeOrmGameEntity} from "../entity/typeOrmGame.entity";
import {Game} from "../../../../../core/domain/entities/game";
import {TypeOrmPublisherMapper} from "./typeOrmPublisher.mapper";
import {CreateGameEntityType} from "../../../../../core/domain/entities/type/createGame.entity.type";

export class TypeOrmGameMapper {
  
  public static toOrmEntity(domainGame: Game): TypeOrmGameEntity {
    const ormGame: TypeOrmGameEntity = new TypeOrmGameEntity();
    ormGame.id           = domainGame.getId();
    ormGame.slug           = domainGame.getSlug();
    ormGame.title      = domainGame.getTitle();
    ormGame.price         = domainGame.getPrice();
    ormGame.publisher         = TypeOrmPublisherMapper.toOrmEntity(domainGame.getPublisher());
    ormGame.tags         = domainGame.getTags();
    ormGame.releaseDate         = domainGame.getReleaseDate();
    return ormGame;
  }
  
  public static toOrmEntities(domainGames: Game[]): TypeOrmGameEntity[] {
    return domainGames.map(domainGame => this.toOrmEntity(domainGame));
  }
  
  public static toDomainEntity(ormGame: TypeOrmGameEntity): Game | undefined {
    if(ormGame === null ) {
      return undefined
    }

    return new Game({
      id: ormGame.id,
      title: ormGame.title,
      price: ormGame.price,
      publisher: TypeOrmPublisherMapper.toCreateDomainEntity(ormGame.publisher),
      tags: ormGame.tags,
      releaseDate: ormGame.releaseDate,
    });
  }

  public static toCreateDomainEntity(ormGame: TypeOrmGameEntity): CreateGameEntityType | undefined {
    if(ormGame === null ) {
      return undefined
    }
    return {
      id: ormGame.id,
      title: ormGame.title,
      price: ormGame.price,
      publisher: TypeOrmPublisherMapper.toCreateDomainEntity(ormGame.publisher),
      tags: ormGame.tags,
      releaseDate: ormGame.releaseDate,
    };
  }
  
  public static toDomainEntities(ormGames: TypeOrmGameEntity[]): Game[] {
    return ormGames.map(ormGame => this.toDomainEntity(ormGame));
  }
  
}
