import {Repository} from 'typeorm';
import {Optional} from "../../../../../core/common/type/common.types";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {PublisherRepositoryPort} from "../../../../../core/domain/port/persistence/publisher.repository.port";
import {TypeOrmPublisherEntity} from "../entity/typeOrmPublisher.entity";
import {Publisher} from "../../../../../core/domain/entities/publisher";
import {TypeOrmPublisherMapper} from "../mapper/typeOrmPublisher.mapper";

@Injectable()
export class TypeOrmPublisherRepositoryAdapter implements PublisherRepositoryPort {

  constructor(
      @InjectRepository(TypeOrmPublisherEntity) private publisherRepository: Repository<TypeOrmPublisherEntity>
  ) {}

  async findPublisher(by: { id?:string, name?: string, siret?: number, slug?:string }): Promise<Optional<Publisher>> {
    const publisherEntity = await this.publisherRepository.findOne({where: by});
    return TypeOrmPublisherMapper.toDomainEntity(publisherEntity);
  }

}
