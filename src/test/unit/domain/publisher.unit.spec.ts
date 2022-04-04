import {Publisher} from "../../../core/domain/entities/publisher";
import { v4 } from 'uuid';

describe('Publisher tests', () => {
    const PUBLISHER_OBJECT = { id: v4(),  slug: "Publisher1-104154", name: 'Publisher1', siret: 104154, phone: "+24324445" };

    it('Should create a publisher', async () => {
        const publisher = await Publisher.new({id: PUBLISHER_OBJECT.id, name: PUBLISHER_OBJECT.name, siret: PUBLISHER_OBJECT.siret, phone: PUBLISHER_OBJECT.phone});
        expect(publisher instanceof Publisher).toBeTruthy();
        expect(publisher).toEqual(PUBLISHER_OBJECT);
        expect(publisher.getId()).toBeDefined();
        expect(publisher.getSiret()).toBeDefined();
        expect(publisher.getName()).toBeDefined();
        expect(publisher.getSlug()).toBeDefined();
        expect(publisher.getPhone()).toBeDefined();
        expect(publisher.toString()).toEqual(" id: " + PUBLISHER_OBJECT.id
            + " slug: " + PUBLISHER_OBJECT.slug
            + " name: " + PUBLISHER_OBJECT.name
            + " siret: " + PUBLISHER_OBJECT.siret.toString()
            + " phone: "+ PUBLISHER_OBJECT.phone);
    });

    it('Should create a publisher with a defined id', async () => {
        const publisher = await Publisher.new({id: null, name: PUBLISHER_OBJECT.name, siret: PUBLISHER_OBJECT.siret, phone: PUBLISHER_OBJECT.phone});
        expect(publisher instanceof Publisher).toBeTruthy();
        expect(publisher.getId()).toBeDefined();
    });

    it('Should edit a publisher ', async () => {
         const publisher = await Publisher.new({id: null, name: "Publisher2", siret: 145456, phone: "+465464"});
        await publisher.edit(PUBLISHER_OBJECT)
        expect(publisher instanceof Publisher).toBeTruthy();
        expect(publisher).toEqual(PUBLISHER_OBJECT);
    });


    it('Should edit only publisher name & slug', async () => {
        const publisher = await Publisher.new({id: PUBLISHER_OBJECT.id, name: "Publisher2", siret: PUBLISHER_OBJECT.siret, phone: PUBLISHER_OBJECT.phone});
        expect(publisher.getName()).not.toEqual(PUBLISHER_OBJECT.name);
        expect(publisher.getSlug()).not.toEqual(PUBLISHER_OBJECT.slug);
        await publisher.edit({name:PUBLISHER_OBJECT.name,siret:undefined,id:undefined,phone:undefined});
        expect(publisher instanceof Publisher).toBeTruthy();
        expect(publisher).toEqual(PUBLISHER_OBJECT);
    });

    it('Should edit only publisher siret & slug', async () => {
        const publisher = await Publisher.new({id: PUBLISHER_OBJECT.id, name: PUBLISHER_OBJECT.name, siret: 154646, phone: PUBLISHER_OBJECT.phone});
        expect(publisher.getSiret()).not.toEqual(PUBLISHER_OBJECT.siret);
        expect(publisher.getSlug()).not.toEqual(PUBLISHER_OBJECT.slug);
        await publisher.edit({name:undefined,siret:PUBLISHER_OBJECT.siret,id:undefined,phone:undefined});
        expect(publisher instanceof Publisher).toBeTruthy();
        expect(publisher).toEqual(PUBLISHER_OBJECT);
    });

    it('Should edit phone without edit slug or id', async () => {
        const publisher = await Publisher.new({id: PUBLISHER_OBJECT.id, name: PUBLISHER_OBJECT.name, siret: PUBLISHER_OBJECT.siret, phone: "+465421"});
        expect(publisher.getPhone()).not.toEqual(PUBLISHER_OBJECT.phone);
        expect(publisher.getSlug()).toEqual(PUBLISHER_OBJECT.slug);
        expect(publisher.getId()).toEqual(PUBLISHER_OBJECT.id);
        await publisher.edit({name:undefined,siret:undefined,id:undefined,phone: PUBLISHER_OBJECT.phone});
        expect(publisher instanceof Publisher).toBeTruthy();
        expect(publisher).toEqual(PUBLISHER_OBJECT);
    });

});