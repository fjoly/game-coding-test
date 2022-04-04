import {Game} from "../../core/domain/entities/game";
import {GameRepositoryPort} from "../../core/domain/port/persistence/game.repository.port";
import {GetGameQuery} from "./getGame.query";
import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetGameResult} from "./getGame.result";
import {GameMapper} from "../mapper/game.mapper";
import {Inject} from "@nestjs/common";
import {GameProvider} from "../../core/domain/provider/game.provider";

@QueryHandler(GetGameQuery)
export class GetGameHandler implements IQueryHandler<GetGameQuery> {

    constructor(
        @Inject(GameProvider.GameRepository)
        private readonly gameRepository: GameRepositoryPort,
    ) {}

    public async execute(command: GetGameQuery): Promise<GetGameResult> {
        const game = await this.gameRepository.findGame({slug:command.slug});
        return GameMapper.toGameResult(game);
    }

}