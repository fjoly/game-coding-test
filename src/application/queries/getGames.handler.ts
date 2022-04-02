import {GameRepositoryPort} from "../../core/domain/port/persistence/game.repository.port";
import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetGamesQuery} from "./getGames.query";
import {GetGameResult} from "./getGame.result";
import {GameMapper} from "../mapper/game.mapper";
import {Inject} from "@nestjs/common";
import {GameProvider} from "../../core/domain/provider/game.provider";

@QueryHandler(GetGamesQuery)
export class GetGamesHandler implements IQueryHandler<GetGamesQuery> {

    constructor(
        @Inject(GameProvider.GameRepository)
        private readonly gameRepository: GameRepositoryPort,
    ) {}

    public async execute(query: GetGamesQuery): Promise<GetGameResult[]> {
        const games = await this.gameRepository.findGames(
            {tags:query.tags,
                releaseDate:query.releaseDate,
                publisherName:query.publisherName,
                publisherSiret:query.publisherSiret}
            ,query.options);
        return GameMapper.toGameResultCollection(games);
    }

}