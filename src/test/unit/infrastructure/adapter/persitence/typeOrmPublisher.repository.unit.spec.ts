import {TestHelper} from "../../helper/typeOrm.helper";
import {Game} from "../../../../../core/domain/entities/game";
import {DateUtils} from "../../../../../core/common/utils/date/date.utils";
import {FakeObject} from "../../../domain/fake.object";
import {
    TypeOrmPublisherEntity
} from "../../../../../infrastructure/adapter/persistence/typeorm/entity/typeOrmPublisher.entity";
import {
    TypeOrmPublisherRepositoryAdapter
} from "../../../../../infrastructure/adapter/persistence/typeorm/repository/typeOrmPublisher.repository.adapter";
import {
    TypeOrmGameRepositoryAdapter
} from "../../../../../infrastructure/adapter/persistence/typeorm/repository/typeOrmGame.repository.adapter";
import {TypeOrmGameEntity} from "../../../../../infrastructure/adapter/persistence/typeorm/entity/typeOrmGame.entity";

let typeOrmGameRepositoryAdapter:TypeOrmGameRepositoryAdapter;
let typeOrmPublisherRepositoryAdapter:TypeOrmPublisherRepositoryAdapter;
let testInstance:TestHelper;

beforeEach(async () => {
    testInstance = TestHelper.instance;
    const datasource= await testInstance.setupTestDB();
    const publisherRepository = await datasource.getRepository(TypeOrmPublisherEntity);
    typeOrmPublisherRepositoryAdapter = new TypeOrmPublisherRepositoryAdapter(publisherRepository);
    const gameRepository = await datasource.getRepository(TypeOrmGameEntity);
    typeOrmGameRepositoryAdapter = new TypeOrmGameRepositoryAdapter(gameRepository);
});

afterEach(async () => {
    await testInstance.teardownTestDB();
});

describe('Type orm repository Publisher adapter Tests', () => {

    test('should find a publisher by slug', async () => {
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
        const publisherResult = await typeOrmPublisherRepositoryAdapter.findPublisher({slug:game.getPublisher().getSlug()});
        expect(publisherResult).toEqual(game.getPublisher());
    });

});