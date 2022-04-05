import {GameRepositoryPort} from "../../../../core/domain/port/persistence/game.repository.port";
import {PublisherRepositoryPort} from "../../../../core/domain/port/persistence/publisher.repository.port";
import {Game} from "../../../../core/domain/entities/game";
import {DateUtils} from "../../../../core/common/utils/date/date.utils";
import {FakeRepository} from "../../infrastructure/fake/fake.repository";
import {GetGameResult} from "../../../../application/queries/getGame.result";
import {FakeObject} from "../../domain/fake.object";
import {GetGamesHandler} from "../../../../application/queries/getGames.handler";
import {GetGamesQuery} from "../../../../application/queries/getGames.query";

describe('GetGamesHandler', () => {
    let gameRepositoryPort: GameRepositoryPort;
    let publisherRepositoryPort: PublisherRepositoryPort;
    let getGamesHandler: GetGamesHandler;
    const getGamesQuery:GetGamesQuery = new GetGamesQuery(
        FakeObject.GAME_OBJECT.title,
        FakeObject.GAME_OBJECT.tags,
        FakeObject.GAME_OBJECT.price,
        FakeObject.GAME_OBJECT.releaseDate,
        FakeObject.GAME_OBJECT.publisher.name,
        FakeObject.GAME_OBJECT.publisher.siret,
        FakeObject.GAME_OBJECT.releaseDate,
        FakeObject.GAME_OBJECT.releaseDate,
        {limit:10,offset:0});

    beforeEach(async () => {
        gameRepositoryPort = FakeRepository.gameRepositoryPort
        publisherRepositoryPort = FakeRepository.publisherRepositoryPort
        getGamesHandler = new GetGamesHandler(gameRepositoryPort);
    });

    it('Should find 2 games', async () => {
        const game2 = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT2.title,
            price: FakeObject.GAME_OBJECT2.price,
            publisher: {
                id:null,
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT2.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT2.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT2.releaseDate),
        });
        const game3 = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT3.title,
            price: FakeObject.GAME_OBJECT3.price,
            publisher: {
                id:null,
                name:FakeObject.GAME_OBJECT3.publisher.name,
                siret:FakeObject.GAME_OBJECT3.publisher.siret,
                phone: FakeObject.GAME_OBJECT3.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT3.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT3.releaseDate),
        });
        const gamesResult = [
            {
                slug: game2.getSlug(),
                title: game2.getTitle(),
                price: game2.getPrice(),
                publisher: {
                    slug:game2.getPublisher().getSlug(),
                    phone:game2.getPublisher().getPhone(),
                    siret:game2.getPublisher().getSiret(),
                    name:game2.getPublisher().getName()
                },
                tags: game2.getTags(),
                releaseDate: DateUtils.toStringDateFormat(game2.getReleaseDate()),
            } as GetGameResult,
            {
                slug: game3.getSlug(),
                title: game3.getTitle(),
                price: game3.getPrice(),
                publisher: {
                    slug:game3.getPublisher().getSlug(),
                    phone:game3.getPublisher().getPhone(),
                    siret:game3.getPublisher().getSiret(),
                    name:game3.getPublisher().getName()
                },
                tags: game3.getTags(),
                releaseDate: DateUtils.toStringDateFormat(game3.getReleaseDate()),
            } as GetGameResult

        ]
        const findGamesSpy = jest.spyOn(gameRepositoryPort, 'findGames')
        findGamesSpy.mockImplementation(async () => [game2,game3]);
        expect(await getGamesHandler.execute(getGamesQuery)).toEqual(gamesResult)
        expect(findGamesSpy).toBeCalled();
        findGamesSpy.mockReset();
    });
});