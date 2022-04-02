import {TypeOrmPublisherEntity} from "../entity/typeOrmPublisher.entity";
import {Publisher} from "../../../../../core/domain/entities/publisher";
import {CreatePublisherEntityType} from "../../../../../core/domain/entities/type/createPublisher.entity.type";

export class TypeOrmPublisherMapper {
  
  public static toOrmEntity(domainPublisher: Publisher): TypeOrmPublisherEntity {
    const ormPublisher: TypeOrmPublisherEntity = new TypeOrmPublisherEntity();
    ormPublisher.id           = domainPublisher.getId();
    ormPublisher.name      = domainPublisher.getName();
    ormPublisher.phone         = domainPublisher.getPhone();
    ormPublisher.siret         = domainPublisher.getSiret();
    return ormPublisher;
  }
  
  public static toOrmEntities(domainPublishers: Publisher[]): TypeOrmPublisherEntity[] {
    return domainPublishers.map(domainPublisher => this.toOrmEntity(domainPublisher));
  }

  public static toDomainEntity(ormPublisher: TypeOrmPublisherEntity): Publisher | undefined {
    if(ormPublisher === null ) {
      return undefined
    }
    return new Publisher({
      id: ormPublisher.id,
      name: ormPublisher.name,
      phone: ormPublisher.phone,
      siret: ormPublisher.siret,
    });
  }

  public static toCreateDomainEntity(ormPublisher: TypeOrmPublisherEntity): CreatePublisherEntityType | undefined {
    if(ormPublisher === null ) {
      return undefined
    }
    return ({
      id: ormPublisher.id,
      name: ormPublisher.name,
      phone: ormPublisher.phone,
      siret: ormPublisher.siret,
    });
  }

  
  public static toDomainEntities(ormPublishers: TypeOrmPublisherEntity[]): Publisher[] | undefined {
    return ormPublishers.map(ormPublisher => this.toDomainEntity(ormPublisher));
  }
  
}
