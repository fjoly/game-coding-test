import {Repository} from 'typeorm';
import {GameRepositoryPort} from "../../../../../core/domain/port/persistence/game.repository.port";
import {TypeOrmGameEntity} from "../entity/typeOrmGame.entity";
import {Game} from "../../../../../core/domain/entities/game";
import {RepositoryFindOptions} from "../../../../../core/common/persistence/RepositoryOptions";
import {Optional} from "../../../../../core/common/type/CommonTypes";
import {Injectable} from "@nestjs/common";
import {TypeOrmGameMapper} from "../mapper/typeOrmGame.mapper";
import {InjectRepository} from "@nestjs/typeorm";
import {PublisherRepositoryPort} from "../../../../../core/domain/port/persistence/publisher.repository.port";
import {TypeOrmPublisherEntity} from "../entity/typeOrmPublisher.entity";
import {Publisher} from "../../../../../core/domain/entities/publisher";
import {TypeOrmPublisherMapper} from "../mapper/typeOrmPublisher.mapper";

@Injectable()
export class TypeOrmPublisherRepositoryAdapter implements PublisherRepositoryPort {

  constructor(
      @InjectRepository(TypeOrmPublisherEntity) private gameRepository: Repository<TypeOrmPublisherEntity>
  ) {}

  async findPublisher(by: { id?:string, name?: string, siret?: number }): Promise<Optional<Publisher>> {
    const gameEntity = await this.gameRepository.findOne({where: by});
    return TypeOrmPublisherMapper.toDomainEntity(gameEntity);
  }

}
