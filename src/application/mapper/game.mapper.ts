import {Game} from "../../core/domain/entities/game";
import {GetGameResult} from "../queries/getGame.result";
import {PublisherMapper} from "./publisher.mapper";
import {DateUtils} from "../../core/common/utils/date/date.utils";

export class GameMapper {
    static toGameResult(game: Game): GetGameResult {
        if(game === undefined){
            return undefined;
        }

        return {
            slug: game.getSlug(),
            title: game.getTitle(),
            price: game.getPrice(),
            publisher: PublisherMapper.toPublisherResult(game.getPublisher()),
            tags: game.getTags(),
            releaseDate: DateUtils.toStringDateFormat(game.getReleaseDate()),
        } as GetGameResult;
    }

    static toGameResultCollection(games: Game[]): GetGameResult[] {
        return games.map((c) => this.toGameResult(c));
    }
}