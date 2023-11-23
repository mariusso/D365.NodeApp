"use strict";

const D365Base = require("./Base/D365Base");

class Default extends D365Base {
    constructor(environmentName) {
        super(environmentName);
    }
    execute = async () => {
        await this.init();
    }
}

(async () => {
    const args = process.argv.slice(2);

    const environmentName = args[0];
    const command = args[1];

    if (command == "default") {
        new Default(environmentName).execute();
    }
})();

