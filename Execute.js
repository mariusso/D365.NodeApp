"use strict";

const { AcquireTokenWithClientCredentials } = require("./AdalNode");
const { BaseService } = require("./Services/BaseService");
const pluginConfig = require("./pluginConfig.json");
const fs = require('fs').promises;
const clientConfig = require("./clientConfig.json");
const path = require("path");


async function EntryPoint() {

    const args = process.argv.slice(2);

    if (args.length < 1) {
        Execute();
    }
    else {

        const command = args[0];

        if (command === "Execute") {
            Execute();
        }
        else {
            Console.error(`Unknown command: ${command}`);
        }
    }
}

async function Execute() {

    const tokenResponse = await AcquireTokenWithClientCredentials();

    const baseService = new BaseService(tokenResponse, "accounts");
}

EntryPoint();