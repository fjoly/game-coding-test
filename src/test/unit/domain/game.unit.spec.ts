import {Publisher} from "../../../core/domain/entities/publisher";
import { v4 } from 'uuid';
import {Game} from "../../../core/domain/entities/game";

describe('Game tests', () => {
    const PUBLISHER_OBJECT = { id: v4(),  slug: "Publisher1-104154", name: 'Publisher1', siret: 104154, phone: "+24324445" };
    const GAME_OBJECT = { id: v4(),  slug: "Game1-Publisher1", title:"Game1", publisher: PUBLISHER_OBJECT,tags:["tag1","tag2"],price: 8, releaseDate: new Date() };

    it('Should create a game', async () => {
        const game = await Game.new({
            id: GAME_OBJECT.id,
            title:GAME_OBJECT.title,
            publisher: GAME_OBJECT.publisher,
            tags:GAME_OBJECT.tags,
            price:GAME_OBJECT.price,
            releaseDate:GAME_OBJECT.releaseDate});
        expect(game instanceof Game).toBeTruthy();
        expect(game.getPublisher() instanceof Publisher).toBeTruthy();
        expect(game).toEqual(GAME_OBJECT);
        expect(game.getId()).toBeDefined();
        expect(game.getPublisher()).toBeDefined();
        expect(game.getTitle()).toBeDefined();
        expect(game.getSlug()).toBeDefined();
        expect(game.getTags()).toBeDefined();
        expect(game.getReleaseDate()).toBeDefined();
        expect(game.toString()).toEqual(" id: " + GAME_OBJECT.id.toString()
            + " slug: " + GAME_OBJECT.slug
            + " title: " + GAME_OBJECT.title
            + " price: " + GAME_OBJECT.price.toString()
            + " publisher: "
                + " id: " + PUBLISHER_OBJECT.id
                + " slug: " + PUBLISHER_OBJECT.slug
                + " name: " + PUBLISHER_OBJECT.name
                + " siret: " + PUBLISHER_OBJECT.siret.toString()
                + " phone: "+ PUBLISHER_OBJECT.phone
            + " tags: "+ GAME_OBJECT.tags.toString()
            + " releaseDate: "+ GAME_OBJECT.releaseDate.toString() )
    });


    it('Should create a game with a defined id', async () => {
        const game = await Game.new({
            id: null,
            price:GAME_OBJECT.price,
            tags:GAME_OBJECT.tags,
            title:GAME_OBJECT.title,
            publisher:GAME_OBJECT.publisher,
            releaseDate:GAME_OBJECT.releaseDate});
        expect(game instanceof Game).toBeTruthy();
        expect(game.getPublisher() instanceof Publisher).toBeTruthy();
        expect(game.getId()).toBeDefined();
    });

    it('Should edit a game ', async () => {
        const game = await Game.new({
            id: GAME_OBJECT.id,
            price:15,
            tags:["tag3"],
            title:"Game",
            publisher: {id:v4(),name:"Publisher2",siret:464542,phone:"+12542123134"},
            releaseDate:GAME_OBJECT.releaseDate});
        await game.edit(GAME_OBJECT)
        expect(game instanceof Game).toBeTruthy();
        expect(game.getPublisher() instanceof Publisher).toBeTruthy();
        expect(game).toEqual(GAME_OBJECT);
    });

    it('Should edit only game title & slug', async () => {
        const game = await Game.new({
            id: GAME_OBJECT.id,
            price:GAME_OBJECT.price,
            tags:GAME_OBJECT.tags,
            title:"Game2",
            publisher:GAME_OBJECT.publisher,
            releaseDate:GAME_OBJECT.releaseDate});
        expect(game.getTitle()).not.toEqual(GAME_OBJECT.title);
        expect(game.getSlug()).not.toEqual(GAME_OBJECT.slug);
        await game.edit({
            title:GAME_OBJECT.title,
            tags:undefined,
            price:undefined,
            publisher:undefined,
            releaseDate:undefined});
        expect(game instanceof Game).toBeTruthy();
        expect(game.getPublisher() instanceof Publisher).toBeTruthy();
        expect(game).toEqual(GAME_OBJECT);
    });

    it('Should edit only publisher name & slug', async () => {
        const game = await Game.new({
            id: GAME_OBJECT.id,
            price:GAME_OBJECT.price,
            tags:GAME_OBJECT.tags,
            title: GAME_OBJECT.title,
            publisher: {id:PUBLISHER_OBJECT.id,
                name:"Publisher2",
                siret:PUBLISHER_OBJECT.siret,
                phone:PUBLISHER_OBJECT.phone},
            releaseDate:GAME_OBJECT.releaseDate});
        expect(game.getPublisher().getName()).not.toEqual(GAME_OBJECT.publisher.name);
        expect(game.getSlug()).not.toEqual(GAME_OBJECT.slug);
        await game.edit({
            title:undefined,
            tags:undefined,
            price:undefined,
            publisher:{id:undefined,
                siret:undefined,
                name:PUBLISHER_OBJECT.name,
                phone:undefined},
            releaseDate:undefined});
        expect(game instanceof Game).toBeTruthy();
        expect(game.getPublisher() instanceof Publisher).toBeTruthy();
        expect(game).toEqual(GAME_OBJECT);
    });

    it('Should edit tags without edit slug or publisher', async () => {
        const game = await Game.new({
            id: GAME_OBJECT.id, price:GAME_OBJECT.price,
            tags:["Tag3"],
            title: GAME_OBJECT.title,
            publisher: GAME_OBJECT.publisher,
            releaseDate:GAME_OBJECT.releaseDate});
        expect(game.getTags()).not.toEqual(GAME_OBJECT.tags);
        expect(game.getSlug()).toEqual(GAME_OBJECT.slug);
        await game.edit({
            title:undefined,
            tags:GAME_OBJECT.tags,
            price:undefined,
            publisher: undefined,
            releaseDate:undefined});
        expect(game instanceof Game).toBeTruthy();
        expect(game.getPublisher() instanceof Publisher).toBeTruthy();
        expect(game).toEqual(GAME_OBJECT);
    });

    it('Should apply a discount', async () => {
        const game = await Game.new({
            id: GAME_OBJECT.id,
            price: 10,
            tags: GAME_OBJECT.tags,
            title: GAME_OBJECT.title,
            publisher: GAME_OBJECT.publisher,
            releaseDate:GAME_OBJECT.releaseDate});
        expect(game.getPrice()).not.toEqual(GAME_OBJECT.price);
        await game.applyDiscount({percentage:20});
        expect(game instanceof Game).toBeTruthy();
        expect(game.getPublisher() instanceof Publisher).toBeTruthy();
        expect(game).toEqual(GAME_OBJECT);
    });

    it('Should throw exception because not a percentage', async () => {
        const game = await Game.new({
            id: GAME_OBJECT.id,
            price: GAME_OBJECT.price,
            tags: GAME_OBJECT.tags,
            title: GAME_OBJECT.title,
            publisher: GAME_OBJECT.publisher,
            releaseDate:GAME_OBJECT.releaseDate});

        await expect(async () => {
            await game.applyDiscount({percentage: 110});
        }).rejects.toThrow();
        expect(game instanceof Game).toBeTruthy();
        expect(game.getPublisher() instanceof Publisher).toBeTruthy();
        expect(game).toEqual(GAME_OBJECT);
    });

    it('Should throw exception because not a percentage 2', async () => {
        const game = await Game.new({
            id: GAME_OBJECT.id,
            price: GAME_OBJECT.price,
            tags: GAME_OBJECT.tags,
            title: GAME_OBJECT.title,
            publisher: GAME_OBJECT.publisher,
            releaseDate:GAME_OBJECT.releaseDate});

        await expect(async () => {
            await game.applyDiscount({percentage: -1});
        }).rejects.toThrow();
        expect(game instanceof Game).toBeTruthy();
        expect(game.getPublisher() instanceof Publisher).toBeTruthy();
        expect(game).toEqual(GAME_OBJECT);
    });
});