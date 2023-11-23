"use strict";

const { AcquireTokenWithClientCredentials } = require("./AdalNode");
const { BaseService } = require("./Services/BaseService");

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
            console.error(`Unknown command: ${command}`);
        }
    }
}

async function Execute() {

    const tokenResponse = await AcquireTokenWithClientCredentials();

    const baseService = new BaseService(tokenResponse, "accounts");

    const result = await baseService.RetrieveMultiple("accountid", "statecode eq 0", "name asc", "5000");

    console.log(result.length);
}

EntryPoint();