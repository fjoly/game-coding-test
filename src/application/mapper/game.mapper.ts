import {Game} from "../../core/domain/entities/game";
import {GetGameResult} from "../queries/getGame.result";

export class GameMapper {
    static toGameResult(game: Game): GetGameResult {
        return {
            title: game.getTitle(),
            price: game.getPrice(),
            publisher: game.getPublisher(),
            tags: game.getTags(),
            releaseDate: game.getReleaseDate(),
        } as GetGameResult;
    }

    static toGameResultCollection(games: Game[]): GetGameResult[] {
        return games.map((c) => this.toGameResult(c));
    }
}