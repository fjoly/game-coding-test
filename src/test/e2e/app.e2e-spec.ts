import { Test, TestingModule } from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import { RootModule } from '../../root.module';
import {CreateGameCommand} from "../../application/commands/createGame.command";
import {FakeObject} from "../unit/domain/fake.object";
import {clearDB} from "./utils/e2e.utils";
import {EditGameCommand} from "../../application/commands/editGame.command";
import {GetGamesQuery} from "../../application/queries/getGames.query";

describe('GameController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RootModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({transform:true}));
    await app.init();
  });

  beforeEach(async () => {
    clearDB()
  });

  it('Create a game + find it with slug + find publisher data with slug + remove + verify with find', async () => {
    const createGameCommand:CreateGameCommand = new CreateGameCommand(FakeObject.GAME_OBJECT.title,FakeObject.GAME_OBJECT.price,FakeObject.GAME_OBJECT.publisher,FakeObject.GAME_OBJECT.tags,FakeObject.GAME_OBJECT.releaseDate);
    const gameResult = {
      slug: FakeObject.GAME_OBJECT.slug,
      title: FakeObject.GAME_OBJECT.title,
      price: FakeObject.GAME_OBJECT.price,
      publisher: {
        slug:FakeObject.GAME_OBJECT.publisher.slug,
        phone:FakeObject.GAME_OBJECT.publisher.phone,
        siret:FakeObject.GAME_OBJECT.publisher.siret,
        name:FakeObject.GAME_OBJECT.publisher.name
      },
      tags: FakeObject.GAME_OBJECT.tags,
      releaseDate: FakeObject.GAME_OBJECT.releaseDate,
    };
    const gameResult2 = {
      slug: FakeObject.GAME_OBJECT.slug,
      title: FakeObject.GAME_OBJECT.title,
      price: FakeObject.GAME_OBJECT.price.toFixed(2),
      publisher: {
        slug:FakeObject.GAME_OBJECT.publisher.slug,
        phone:FakeObject.GAME_OBJECT.publisher.phone,
        siret:FakeObject.GAME_OBJECT.publisher.siret,
        name:FakeObject.GAME_OBJECT.publisher.name
      },
      tags: FakeObject.GAME_OBJECT.tags,
      releaseDate: FakeObject.GAME_OBJECT.releaseDate,
    };
    //Create
    const createResponse = await request(app.getHttpServer())
      .post('/v1/games')
      .send(createGameCommand)
      .expect(200)
    expect(createResponse.body.data).toEqual(gameResult);
    //Find
    const findResponse = await request(app.getHttpServer())
        .get('/v1/games/'+ createResponse.body.data.slug)
        .expect(200)
    expect(findResponse.body.data).toEqual(gameResult2);
    const findPublisherResponse = await request(app.getHttpServer())
        .get('/v1/games/'+ createResponse.body.data.slug+"/publisher")
        .expect(200)
    expect(findPublisherResponse.body.data).toEqual(gameResult2.publisher);
    //Remove
   await request(app.getHttpServer())
        .delete('/v1/games/'+ createResponse.body.data.slug)
        .expect(200);
    //Try find again
    const findResponse2 = await request(app.getHttpServer())
        .get('/v1/games/'+ createResponse.body.data.slug)
        .expect(200)
    expect(findResponse2.body.data).toBe(null);
  });

  it('Create a game + edit it + verify edition with find ', async () => {
    const createGameCommand:CreateGameCommand = new CreateGameCommand(FakeObject.GAME_OBJECT.title,FakeObject.GAME_OBJECT.price,FakeObject.GAME_OBJECT.publisher,FakeObject.GAME_OBJECT.tags,FakeObject.GAME_OBJECT.releaseDate);
    const editGameCommand:EditGameCommand = new EditGameCommand(FakeObject.GAME_OBJECT.slug,FakeObject.GAME_OBJECT2.title,FakeObject.GAME_OBJECT2.price,FakeObject.GAME_OBJECT2.publisher,FakeObject.GAME_OBJECT2.tags,FakeObject.GAME_OBJECT2.releaseDate);
    const gameResult = {
      slug: FakeObject.GAME_OBJECT.slug,
      title: FakeObject.GAME_OBJECT.title,
      price: FakeObject.GAME_OBJECT.price.toFixed(2),
      publisher: {
        slug:FakeObject.GAME_OBJECT.publisher.slug,
        phone:FakeObject.GAME_OBJECT.publisher.phone,
        siret:FakeObject.GAME_OBJECT.publisher.siret,
        name:FakeObject.GAME_OBJECT.publisher.name
      },
      tags: FakeObject.GAME_OBJECT.tags,
      releaseDate: FakeObject.GAME_OBJECT.releaseDate,
    };
    const gameResult2 = {
      slug: FakeObject.GAME_OBJECT2.slug,
      title: FakeObject.GAME_OBJECT2.title,
      price: FakeObject.GAME_OBJECT2.price.toFixed(2),
      publisher: {
        slug:FakeObject.GAME_OBJECT2.publisher.slug,
        phone:FakeObject.GAME_OBJECT2.publisher.phone,
        siret:FakeObject.GAME_OBJECT2.publisher.siret,
        name:FakeObject.GAME_OBJECT2.publisher.name
      },
      tags: FakeObject.GAME_OBJECT2.tags,
      releaseDate: FakeObject.GAME_OBJECT2.releaseDate,
    };
    //Create
    const createResponse = await request(app.getHttpServer())
        .post('/v1/games')
        .send(createGameCommand)
        .expect(200)
    //Find
    const findResponse = await request(app.getHttpServer())
        .get('/v1/games/'+ createResponse.body.data.slug)
        .expect(200)
    expect(findResponse.body.data).toEqual(gameResult);
    //Remove
    const editResponse = await request(app.getHttpServer())
        .put('/v1/games/'+ createResponse.body.data.slug)
        .send(editGameCommand)
        .expect(200);
    //Try find again
    const findResponse2 = await request(app.getHttpServer())
        .get('/v1/games/'+ editResponse.body.data.slug)
        .expect(200)
    expect(findResponse2.body.data).toEqual(gameResult2);
  });

  it('Create 3 game + find 3 games + find 2 game by publisher name + process command + find 2 games (one should be removed) with one discount ', async () => {
    const createGameCommand:CreateGameCommand = new CreateGameCommand(FakeObject.GAME_OBJECT.title,FakeObject.GAME_OBJECT.price,FakeObject.GAME_OBJECT.publisher,FakeObject.GAME_OBJECT.tags,FakeObject.GAME_OBJECT.releaseDate);
    const createGameCommand2:CreateGameCommand = new CreateGameCommand(FakeObject.GAME_OBJECT2.title,FakeObject.GAME_OBJECT2.price,FakeObject.GAME_OBJECT2.publisher,FakeObject.GAME_OBJECT2.tags,FakeObject.GAME_OBJECT2.releaseDate);
    const createGameCommand3:CreateGameCommand = new CreateGameCommand(FakeObject.GAME_OBJECT3.title,FakeObject.GAME_OBJECT3.price,FakeObject.GAME_OBJECT3.publisher,FakeObject.GAME_OBJECT3.tags,FakeObject.GAME_OBJECT3.releaseDate);
    const getGamesQuery:GetGamesQuery= new GetGamesQuery(undefined,undefined,undefined,undefined,FakeObject.GAME_OBJECT.publisher.name,undefined,undefined,undefined,{});
    const gameResult = {
      slug: FakeObject.GAME_OBJECT.slug,
      title: FakeObject.GAME_OBJECT.title,
      price: FakeObject.GAME_OBJECT.price.toFixed(2),
      publisher: {
        slug:FakeObject.GAME_OBJECT.publisher.slug,
        phone:FakeObject.GAME_OBJECT.publisher.phone,
        siret:FakeObject.GAME_OBJECT.publisher.siret,
        name:FakeObject.GAME_OBJECT.publisher.name
      },
      tags: FakeObject.GAME_OBJECT.tags,
      releaseDate: FakeObject.GAME_OBJECT.releaseDate,
    };
    const gameResult2 = {
      slug: FakeObject.GAME_OBJECT2.slug,
      title: FakeObject.GAME_OBJECT2.title,
      price: FakeObject.GAME_OBJECT2.price.toFixed(2),
      publisher: {
        slug:FakeObject.GAME_OBJECT2.publisher.slug,
        phone:FakeObject.GAME_OBJECT2.publisher.phone,
        siret:FakeObject.GAME_OBJECT2.publisher.siret,
        name:FakeObject.GAME_OBJECT2.publisher.name
      },
      tags: FakeObject.GAME_OBJECT2.tags,
      releaseDate: FakeObject.GAME_OBJECT2.releaseDate,
    };
    const gameResult3 = {
      slug: FakeObject.GAME_OBJECT3.slug,
      title: FakeObject.GAME_OBJECT3.title,
      price: FakeObject.GAME_OBJECT3.price.toFixed(2),
      publisher: {
        slug:FakeObject.GAME_OBJECT3.publisher.slug,
        phone:FakeObject.GAME_OBJECT3.publisher.phone,
        siret:FakeObject.GAME_OBJECT3.publisher.siret,
        name:FakeObject.GAME_OBJECT3.publisher.name
      },
      tags: FakeObject.GAME_OBJECT3.tags,
      releaseDate: FakeObject.GAME_OBJECT3.releaseDate,
    };
    //Create Game 1
    const createResponse1 = await request(app.getHttpServer())
        .post('/v1/games')
        .send(createGameCommand)
        .expect(200)
    //Create Game 2
    const createResponse2 = await request(app.getHttpServer())
        .post('/v1/games')
        .send(createGameCommand2)
        .expect(200)
    ///Create Game 3
    const createResponse3 = await request(app.getHttpServer())
        .post('/v1/games')
        .send(createGameCommand3)
        .expect(200)
    //Find 3 games
    const findGamesResponse = await request(app.getHttpServer())
        .get('/v1/games/')
        .expect(200)
    expect(findGamesResponse.body.data.length).toEqual(3);
    expect(findGamesResponse.body.data).toEqual([gameResult,gameResult2,gameResult3]);
    //Find 2 Games with a publisher name
    const findGamesWithPublisherNameResponse = await request(app.getHttpServer())
        .get('/v1/games/')
        .query(getGamesQuery)
        .expect(200)
    expect(findGamesWithPublisherNameResponse.body.data.length).toEqual(2);
    expect(findGamesWithPublisherNameResponse.body.data).toEqual([gameResult,gameResult2]);
    //Process Remove and Apply Discount command
    const processResponse = await request(app.getHttpServer())
        .post('/v1/games/process')
        .send()
        .expect(200)
    //Find 2 games (One removed) and one with discount
    const findGames2Response = await request(app.getHttpServer())
        .get('/v1/games/')
        .expect(200)
    expect(findGames2Response.body.data.length).toEqual(2);
    expect(findGames2Response.body.data[0]).toEqual(gameResult);
    expect(findGames2Response.body.data[1]).not.toEqual(gameResult2);
  });
});
