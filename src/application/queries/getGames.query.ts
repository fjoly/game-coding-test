import {IQuery} from "@nestjs/cqrs";
import {RepositoryFindOptions} from "../../core/common/persistence/repositoryOptions";

export class GetGamesQuery implements IQuery {
  constructor(
      readonly title: string | undefined,
      readonly tags: string[] | undefined,
      readonly releaseDate: string | undefined,
      readonly publisherName: string | undefined,
      readonly publisherSiret: number | undefined,
      readonly releaseDateOlderThan: string | undefined,
      readonly releaseDateYoungerThan: string | undefined,
      readonly options: RepositoryFindOptions | undefined
  ) {}
}