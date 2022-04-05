import {TestHelper} from "../../helper/typeOrm.helper";
import {
    TypeOrmGameRepositoryAdapter
} from "../../../../../infrastructure/adapter/persistence/typeorm/repository/typeOrmGame.repository.adapter";
import {Game} from "../../../../../core/domain/entities/game";
import {DateUtils} from "../../../../../core/common/utils/date/date.utils";
import {FakeObject} from "../../../domain/fake.object";
import {TypeOrmGameEntity} from "../../../../../infrastructure/adapter/persistence/typeorm/entity/typeOrmGame.entity";
const moment=require('moment-timezone')

let typeOrmGameRepositoryAdapter:TypeOrmGameRepositoryAdapter;
let testInstance:TestHelper;

beforeEach(async () => {
    testInstance = TestHelper.instance;
    const datasource= await testInstance.setupTestDB();
    const gameRepository = await datasource.getRepository(TypeOrmGameEntity);
    typeOrmGameRepositoryAdapter = new TypeOrmGameRepositoryAdapter(gameRepository);
});

afterEach(async () => {
    await testInstance.teardownTestDB();
});

describe('Type orm repository Game adapter Tests', () => {

    test('should add a game', async () => {
        const game:Game = await Game.new({
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
        const gameResult = await typeOrmGameRepositoryAdapter.addGame(game);
        expect(gameResult).toEqual(game);
    });

    test('should update a game', async () => {
        const game:Game = await Game.new({
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
        await typeOrmGameRepositoryAdapter.addGame(game);
        await game.edit({
            tags: FakeObject.GAME_OBJECT2.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT2.releaseDate),
            price: FakeObject.GAME_OBJECT2.price,
            publisher: {
                id: game.getPublisher().getId(),
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT2.publisher.phone,
            },
            title: FakeObject.GAME_OBJECT2.title,
        })
        const gameResult = await typeOrmGameRepositoryAdapter.updateGames(game);
        if(Array.isArray(gameResult)){
            //Not possible
        }else {
            expect(gameResult).toEqual(game);
        }
    });

    test('should update a games', async () => {
        const game:Game = await Game.new({
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
        const game2:Game = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT2.title,
            price: FakeObject.GAME_OBJECT2.price,
            publisher: {
                id:game.getPublisher().getId(),
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT2.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT2.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT2.releaseDate),
        });

        await typeOrmGameRepositoryAdapter.addGame(game);
        await typeOrmGameRepositoryAdapter.addGame(game2);
        await game.edit({
            tags: FakeObject.GAME_OBJECT3.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT3.releaseDate),
            price: FakeObject.GAME_OBJECT3.price,
            publisher: {
                id: game.getPublisher().getId(),
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT3.publisher.phone,
            },
            title: FakeObject.GAME_OBJECT3.title,
        })
        await game2.edit({
            tags: FakeObject.GAME_OBJECT3.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT3.releaseDate),
            price: FakeObject.GAME_OBJECT3.price,
            publisher: {
                id: game.getPublisher().getId(),
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT3.publisher.phone,
            },
            title: FakeObject.GAME_OBJECT2.title,
        })
        const gameResult = await typeOrmGameRepositoryAdapter.updateGames([game,game2]);
        if(Array.isArray(gameResult)){
            expect(gameResult.length).toEqual(2);
        }else {
            //Not expected
        }
    });

    test('should remove a game', async () => {
        const game:Game = await Game.new({
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
        await typeOrmGameRepositoryAdapter.addGame(game);
        await typeOrmGameRepositoryAdapter.removeGames(game);
        const gameResult = await typeOrmGameRepositoryAdapter.findGame({slug:game.getSlug()});
        if(Array.isArray(gameResult)){
            //Not possible
        }else {
            expect(gameResult).toEqual(undefined);
        }
    });

    test('should find a game by slug', async () => {
        const game:Game = await Game.new({
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
        await typeOrmGameRepositoryAdapter.addGame(game);
        const gameResult = await typeOrmGameRepositoryAdapter.findGame({slug:game.getSlug()});
        expect(gameResult.getPublisher()).toEqual(game.getPublisher());
        expect(gameResult.getTags().toString()).toEqual(game.getTags().toString());
        expect(gameResult.getSlug()).toEqual(game.getSlug());
        expect(gameResult.getPrice()).toEqual(game.getPrice());
        expect(gameResult.getTitle()).toEqual(game.getTitle());
        expect(gameResult.getReleaseDate()).toEqual(game.getReleaseDate());
        expect(gameResult.getId()).toEqual(game.getId());
    });

    test('should find a games by price', async () => {
        const game:Game = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT.title,
            price: 10,
            publisher: {
                id:null,
                name:FakeObject.GAME_OBJECT.publisher.name,
                siret:FakeObject.GAME_OBJECT.publisher.siret,
                phone: FakeObject.GAME_OBJECT.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT.releaseDate),
        });
        const game2:Game = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT2.title,
            price: 10,
            publisher: {
                id:game.getPublisher().getId(),
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT2.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT2.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT2.releaseDate),
        });
        const game3:Game = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT3.title,
            price: 11,
            publisher: {
                id:null,
                name:FakeObject.GAME_OBJECT3.publisher.name,
                siret:FakeObject.GAME_OBJECT3.publisher.siret,
                phone: FakeObject.GAME_OBJECT3.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT3.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT3.releaseDate),
        });
        await typeOrmGameRepositoryAdapter.addGame(game);
        await typeOrmGameRepositoryAdapter.addGame(game2);
        await typeOrmGameRepositoryAdapter.addGame(game3);
        const gameResult = await typeOrmGameRepositoryAdapter.findGames({price:10});
        expect(gameResult.length).toEqual(2);
    });

    test('should find games by title', async () => {
        const game:Game = await Game.new({
            id:null,
            title: "Title1",
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
        const game2:Game = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT2.title,
            price: FakeObject.GAME_OBJECT2.price,
            publisher: {
                id:game.getPublisher().getId(),
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT2.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT2.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT2.releaseDate),
        });
        const game3:Game = await Game.new({
            id:null,
            title: "Title1",
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
        await typeOrmGameRepositoryAdapter.addGame(game);
        await typeOrmGameRepositoryAdapter.addGame(game2);
        await typeOrmGameRepositoryAdapter.addGame(game3);
        const gameResult = await typeOrmGameRepositoryAdapter.findGames({title:"Title1"});
        expect(gameResult.length).toEqual(2);
    });

    test('should find games by publisherName', async () => {
        const game:Game = await Game.new({
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
        const game2:Game = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT2.title,
            price: FakeObject.GAME_OBJECT2.price,
            publisher: {
                id:game.getPublisher().getId(),
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT2.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT2.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT2.releaseDate),
        });
        const game3:Game = await Game.new({
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
        await typeOrmGameRepositoryAdapter.addGame(game);
        await typeOrmGameRepositoryAdapter.addGame(game2);
        await typeOrmGameRepositoryAdapter.addGame(game3);
        const gameResult = await typeOrmGameRepositoryAdapter.findGames({publisherName:FakeObject.GAME_OBJECT.publisher.name});
        expect(gameResult.length).toEqual(2);
    });

    test('should find games by publisherSiret', async () => {
        const game:Game = await Game.new({
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
        const game2:Game = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT2.title,
            price: FakeObject.GAME_OBJECT2.price,
            publisher: {
                id:game.getPublisher().getId(),
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT2.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT2.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT2.releaseDate),
        });
        const game3:Game = await Game.new({
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
        await typeOrmGameRepositoryAdapter.addGame(game);
        await typeOrmGameRepositoryAdapter.addGame(game2);
        await typeOrmGameRepositoryAdapter.addGame(game3);
        const gameResult = await typeOrmGameRepositoryAdapter.findGames({publisherSiret:FakeObject.GAME_OBJECT.publisher.siret});
        expect(gameResult.length).toEqual(2);
    });


    test('should find games by releaseOlderThan', async () => {
        const game:Game = await Game.new({
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
        const game2:Game = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT2.title,
            price: FakeObject.GAME_OBJECT2.price,
            publisher: {
                id:game.getPublisher().getId(),
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT2.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT2.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT2.releaseDate),
        });
        const game3:Game = await Game.new({
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
        await typeOrmGameRepositoryAdapter.addGame(game);
        await typeOrmGameRepositoryAdapter.addGame(game2);
        await typeOrmGameRepositoryAdapter.addGame(game3);
        const date = moment(game2.getReleaseDate(), "DD/MM/YYYY").add(1,'day').toDate()
        const gameResult = await typeOrmGameRepositoryAdapter.findGames({
            releaseDateOlderThan: date});
        expect(gameResult.length).toEqual(2);
    });

    test('should find games by releaseYoungerThan', async () => {
        const game:Game = await Game.new({
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
        const game2:Game = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT2.title,
            price: FakeObject.GAME_OBJECT2.price,
            publisher: {
                id:game.getPublisher().getId(),
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT2.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT2.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT2.releaseDate),
        });
        const game3:Game = await Game.new({
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
        await typeOrmGameRepositoryAdapter.addGame(game);
        await typeOrmGameRepositoryAdapter.addGame(game2);
        await typeOrmGameRepositoryAdapter.addGame(game3);
        const date = moment(game2.getReleaseDate(), "DD/MM/YYYY").subtract(1,'day').toDate()
        const gameResult = await typeOrmGameRepositoryAdapter.findGames({
            releaseDateYoungerThan: date});
        expect(gameResult.length).toEqual(2);
    });

    test('should find games without parameter', async () => {
        const game:Game = await Game.new({
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
        const game2:Game = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT2.title,
            price: FakeObject.GAME_OBJECT2.price,
            publisher: {
                id:game.getPublisher().getId(),
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT2.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT2.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT2.releaseDate),
        });
        const game3:Game = await Game.new({
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
        await typeOrmGameRepositoryAdapter.addGame(game);
        await typeOrmGameRepositoryAdapter.addGame(game2);
        await typeOrmGameRepositoryAdapter.addGame(game3);
        const gameResult = await typeOrmGameRepositoryAdapter.findGames({});
        expect(gameResult.length).toEqual(3);
    });


});