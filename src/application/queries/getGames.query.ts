import {IQuery} from "@nestjs/cqrs";
import {RepositoryFindOptions} from "../../core/common/persistence/RepositoryOptions";

export class GetGamesQuery implements IQuery {
  constructor(
      readonly tags: string[] | undefined,
      readonly releaseDate: Date | undefined,
      readonly publisherName: string | undefined,
      readonly publisherSiret: number | undefined,
      readonly options: RepositoryFindOptions | undefined
  ) {}
}