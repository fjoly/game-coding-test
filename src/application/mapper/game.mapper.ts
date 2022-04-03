import {Game} from "../../core/domain/entities/game";
import {GetGameResult} from "../queries/getGame.result";
import {PublisherMapper} from "./publisher.mapper";

export class GameMapper {
    static toGameResult(game: Game): GetGameResult {
        if(game === undefined){
            return undefined;
        }
        //Format date
        var dd = String(game.getReleaseDate().getDate()).padStart(2, '0');
        var mm = String(game.getReleaseDate().getMonth() + 1).padStart(2, '0');
        var yyyy = game.getReleaseDate().getFullYear();
        const today = mm + '/' + dd + '/' + yyyy;

        return {
            title: game.getTitle(),
            price: game.getPrice(),
            publisher: PublisherMapper.toPublisherResult(game.getPublisher()),
            tags: game.getTags(),
            releaseDate: today,
        } as GetGameResult;
    }

    static toGameResultCollection(games: Game[]): GetGameResult[] {
        return games.map((c) => this.toGameResult(c));
    }
}