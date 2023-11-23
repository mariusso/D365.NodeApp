"use strict";

const AcquireTokenWithClientCredentials = require("../Auth/AdalNode").AcquireTokenWithClientCredentials

class D365Base {

    _tokenResponse;

     constructor(environmentName) {
        console.log(`Using environment name '${environmentName}'.`);
    }

    init = async () => {
        console.log("Acquiring token...");
        this._tokenResponse = await AcquireTokenWithClientCredentials(environmentName);
        console.log("Token acquired.");
    }
}

module.exports = D365Base;