import {GameRepositoryPort} from "../../core/domain/port/persistence/game.repository.port";
import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetGamesQuery} from "./getGames.query";
import {GetGameResult} from "./getGame.result";
import {GameMapper} from "../mapper/game.mapper";
import {Inject} from "@nestjs/common";
import {GameProvider} from "../../core/domain/provider/game.provider";
import {release} from "os";
import {DateUtils} from "../../core/common/utils/date/date.utils";

@QueryHandler(GetGamesQuery)
export class GetGamesHandler implements IQueryHandler<GetGamesQuery> {

    constructor(
        @Inject(GameProvider.GameRepository)
        private readonly gameRepository: GameRepositoryPort,
    ) {}

    public async execute(query: GetGamesQuery): Promise<GetGameResult[]> {
        const games = await this.gameRepository.findGames(
            {
                title:query.title,
                tags:query.tags,
                price:query.price,
                ... ( query.releaseDate !== undefined && {releaseDate: DateUtils.toDate(query.releaseDate)}),
                ... ( query.releaseDateOlderThan !== undefined && {releaseDateOlderThan: DateUtils.toDate(query.releaseDateOlderThan)}),
                ... ( query.releaseDateYoungerThan !== undefined && {releaseDateYoungerThan: DateUtils.toDate(query.releaseDateYoungerThan)}),
                publisherName:query.publisherName,
                publisherSiret:query.publisherSiret,
            }
            ,query.options);
        return GameMapper.toGameResultCollection(games);
    }

}