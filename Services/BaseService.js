"use strict";

const url = require("url");
const superagent = require("superagent");
const { resource } = require("../clientConfig.json");

exports.BaseService = class BaseService {

    #requestHeaders = {
        "Authorization": "Bearer ",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        "If-None-Match": null,
        "Prefer": "return=representation,odata.include-annotations=\"*\""
    }

    baseUrl;
    entityUrl;

    constructor(tokenResponse, entitySetName) {
        this.#requestHeaders.Authorization += tokenResponse.accessToken;

        this.baseUrl = resource;
        this.entityUrl = url.resolve(resource, `api/data/v9.2/${entitySetName}`);
    }

    async Create(entity) {

        try {
            const response = await superagent.post(this.entityUrl).set(this.#requestHeaders).send(entity);
            return response.body;
        }
        catch (errorResponse) {
            throw new Error(error.response.body.Message || error.response.body.message);
        }
    }


    async Retrieve(id, options) {

        const address = `${this.entityUrl}(${id})${options.toString()}`;

        try {
            const response = await superagent.get(address).set(this.#requestHeaders);
            return response.body;
        }
        catch (errorResponse) {
            throw new Error(error.response.body.Message || error.response.body.message);
        }
    }

    async RetrieveMultiple(options) {

        const address = `${this.entityUrl}${options.toString()}`;

        try {
            const response = await superagent.get(address).set(this.#requestHeaders);
            return response.body.value;
        }
        catch (error) {
            throw new Error(error.response.body.Message || error.response.body.message);
        }
    }

    async Update(id, entity) {

        const address = `${this.entityUrl}(${id})`;

        try {
            const response = await superagent.patch(address).set(this.#requestHeaders).send(entity);
            return response.body;
        }
        catch (errorResponse) {
            throw new Error(error.response.body.Message || error.response.body.message);
        }
    }

    async Delete(id) {

        const address = `${this.entityUrl}(${id})`;

        try {
            const response = await superagent.del(address).set(this.#requestHeaders);
            return response.body;
        }
        catch (errorResponse) {
            throw new Error(error.response.body.Message || error.response.body.message);
        }
    }

    async ExecuteFetchXml(fetchXml) {

        const address = `${this.entityUrl}?fetchXml=${encodeURIComponent(fetchXml)}`;

        try {
            const response = await superagent.get(address).set(this.#requestHeaders);
            return response.body.value;
        }
        catch (errorResponse) {
            throw new Error(error.response.body.Message || error.response.body.message);
        }
    }

    async Associate(primaryEntityId, secondaryEntitySetName, secondaryEntityId, relationshipName)
    {
        const address = `${this.entityUrl}(${primaryEntityId})/${relationshipName}/$ref`;

        const payload = {
            "@odata.id": `${this.baseUrl}/${secondaryEntitySetName}(${secondaryEntityId})`
        };

        try {
            const response = await superagent.post(address).set(this.#requestHeaders).send(payload);
            return response.body;
        }
        catch (errorResponse) {
            throw new Error(error.response.body.Message || error.response.body.message);
        }
    }
}

exports.Options = class Options {

    #expand;
    #filter;
    #orderBy;
    #select;
    #top;

    toString = () => {

        const operators = ["?", "&", "&", "&", "&"];

        let str = "";

        if (this.#expand) {
            str += `${operators.shift()}$expand=${encodeURIComponent(this.#expand)}`;
        }
        if (this.#filter) {
            str += `${operators.shift()}$filter=${encodeURIComponent(this.#filter)}`;
        }
        if (this.#orderBy) {
            str += `${operators.shift()}$orderby=${encodeURIComponent(this.#orderBy)}`;
        }
        if (this.#select) {
            str += `${operators.shift()}$select=${encodeURIComponent(this.#select)}`;
        }
        if (this.#top) {
            str += `${operators.shift()}$top=${encodeURIComponent(this.#top)}`;
        }

        return str;
    }
    expand = (expand) => {
        this.#expand = expand;
        return this;
    }
    filter = (filter) => {
        this.#filter = filter;
        return this;
    }
    orderBy = (orderBy) => {
        this.#orderBy = orderBy;
        return this;
    }
    select = (select) => {
        this.#select = select;
        return this;
    }
    top = (top) => {
        this.#top = top;
        return this;
    }
}