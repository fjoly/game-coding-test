import {GameRepositoryPort} from "../../../../core/domain/port/persistence/game.repository.port";
import {PublisherRepositoryPort} from "../../../../core/domain/port/persistence/publisher.repository.port";
import {Game} from "../../../../core/domain/entities/game";
import {DateUtils} from "../../../../core/common/utils/date/date.utils";
import {FakeRepository} from "../../infrastructure/fake/fake.repository";
import {GetGameResult} from "../../../../application/queries/getGame.result";
import {FakeObject} from "../../domain/fake.object";
import {GetGamesHandler} from "../../../../application/queries/getGames.handler";
import {GetGameHandler} from "../../../../application/queries/getGame.handler";
import {GetGameQuery} from "../../../../application/queries/getGame.query";

describe('GetGamesHandler', () => {
    let gameRepositoryPort: GameRepositoryPort;
    let publisherRepositoryPort: PublisherRepositoryPort;
    let getGameHandler: GetGameHandler;
    const getGameQuery:GetGameQuery = new GetGameQuery(
        FakeObject.GAME_OBJECT.slug);

    beforeEach(async () => {
        gameRepositoryPort = FakeRepository.gameRepositoryPort
        publisherRepositoryPort = FakeRepository.publisherRepositoryPort
        getGameHandler = new GetGameHandler(gameRepositoryPort);
    });

    it('Should find a game', async () => {
        const game = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT.title,
            price: FakeObject.GAME_OBJECT.price,
            publisher: {
                id:null,
                name:FakeObject.GAME_OBJECT.publisher.name,
                siret:FakeObject.GAME_OBJECT.publisher.siret,
                phone: FakeObject.GAME_OBJECT.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT.releaseDate),
        });
        const gameResult = {
            slug: game.getSlug(),
            title: game.getTitle(),
            price: game.getPrice(),
            publisher: {
                slug:game.getPublisher().getSlug(),
                phone:game.getPublisher().getPhone(),
                siret:game.getPublisher().getSiret(),
                name:game.getPublisher().getName()
            },
            tags: game.getTags(),
            releaseDate: DateUtils.toStringDateFormat(game.getReleaseDate()),
        } as GetGameResult;
        const findGameSpy = jest.spyOn(gameRepositoryPort, 'findGame')
        findGameSpy.mockImplementation(async () => game);
        expect(await getGameHandler.execute(getGameQuery)).toEqual(gameResult)
        expect(findGameSpy).toBeCalled();
        findGameSpy.mockReset();
    });

    it('Should throw error because slug not provided', async () => {
        const findGameSpy = jest.spyOn(gameRepositoryPort, 'findGame')
        await expect(async () => {
            await getGameHandler.execute({slug:undefined});
        }).rejects.toThrow();
        expect(findGameSpy).not.toBeCalled();
        findGameSpy.mockReset();
    });
});