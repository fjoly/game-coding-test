import {GameRepositoryPort} from "../../core/domain/port/persistence/game.repository.port";
import {GetGameQuery} from "./getGame.query";
import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetGameResult} from "./getGame.result";
import {GameMapper} from "../mapper/game.mapper";
import {Inject} from "@nestjs/common";
import {GameProvider} from "../../core/domain/provider/game.provider";
import {Exception} from "../../core/common/exception/exception";
import {Code} from "../../core/common/code/code";

@QueryHandler(GetGameQuery)
export class GetGameHandler implements IQueryHandler<GetGameQuery> {

    constructor(
        @Inject(GameProvider.GameRepository)
        private readonly gameRepository: GameRepositoryPort,
    ) {}

    public async execute(command: GetGameQuery): Promise<GetGameResult> {
        if(!command.slug){
            throw Exception.new({code: Code.ENTITY_PAYLOAD_VALIDATION_ERROR, data: "this game cannot be find because slug reference of game is empty "});
        }
        const game = await this.gameRepository.findGame({slug:command.slug});
        return GameMapper.toGameResult(game);
    }

}