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
            throw new Error(error.response.body.Message);
        }
    }

    async Retrieve(id, select = "") {

        const operators = ["?"];

        if (select) {
            select = `${operators.shift()}$select=${select}`;
        }

        const address = `${this.entityUrl}(${id})${select}`;

        try {
            const response = await superagent.get(address).set(this.#requestHeaders);
            return response.body;
        }
        catch (errorResponse) {
            throw new Error(error.response.body.Message);
        }
    }

    async RetrieveMultiple(select = "", filter = "", orderBy = "", top = "", expand = "") {

        const operators = ["?", "&", "&", "&", "&"];

        if (select) {
            select = `${operators.shift()}$select=${encodeURIComponent(select)}`;
        }

        if (filter) {
            filter = `${operators.shift()}$filter=${encodeURIComponent(filter)}`;
        }

        if (orderBy) {
            orderBy = `${operators.shift()}$orderby=${encodeURIComponent(orderBy)}`;
        }

        if (top) {
            top = `${operators.shift()}$top=${encodeURIComponent(top)}`;
        }

        if (expand) {
            expand = `${operators.shift()}$expand=${encodeURIComponent(expand)}`;
        }

        const address = `${this.entityUrl}${select}${filter}${orderBy}${top}`;

        try {
            const response = await superagent.get(address).set(this.#requestHeaders);
            return response.body.value;
        }
        catch (error) {
            throw new Error(error.response.body.Message);
        }
    }

    async Update(id, entity) {

        const address = `${this.entityUrl}(${id})`;

        try {
            const response = await superagent.patch(address).set(this.#requestHeaders).send(entity);
            return response.body;
        }
        catch (errorResponse) {
            throw new Error(error.response.body.Message);
        }
    }

    async Delete(id) {

        const address = `${this.entityUrl}(${id})`;

        try {
            const response = await superagent.del(address).set(this.#requestHeaders);
            return response.body;
        }
        catch (errorResponse) {
            throw new Error(error.response.body.Message);
        }
    }

    async ExecuteFetchXml(fetchXml) {

        const address = `${this.entityUrl}?fetchXml=${encodeURIComponent(fetchXml)}`;

        try {
            const response = await superagent.get(address).set(this.#requestHeaders);
            return response.body.value;
        }
        catch (errorResponse) {
            throw new Error(error.response.body.Message);
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
            throw new Error(error.response.body.Message);
        }
    }
}