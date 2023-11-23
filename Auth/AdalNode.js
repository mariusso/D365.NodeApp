"use strict";

const AuthenticationContext = require('adal-node').AuthenticationContext;
const clientConfig  = require("./clientConfig.json");

exports.AcquireTokenWithUserNameAndPassword = (environmentName) => {

    const config = getClientConfig(environmentName);

    return new Promise((resolve, reject) => {
        const authContext = new AuthenticationContext(config.authority, true);
        authContext.acquireTokenWithUsernamePassword(config.resource, config.username, config.password, config.clientId, (error, tokenResponse) => {
            if(error) {
                reject(error);
            }
            resolve(tokenResponse);
        });
    })
 };

 exports.AcquireTokenWithClientCredentials = async  (environmentName) => {

    const config = getClientConfig(environmentName);
    
    return new Promise((resolve, reject) => {
        const authContext = new AuthenticationContext(config.authority, true);
        authContext.acquireTokenWithClientCredentials(config.resource, config.clientId, config.clientSecret, (error, tokenResponse) => {
            if(error) {
                reject(error);
            }
            resolve(tokenResponse);
        });
    })
 };

 const getClientConfig = (environmentName) => {

    if(!environmentName) {
        throw new Error("No environment specified.");
    }

    const config = clientConfig.find(c => c.name == environmentName);

    if(config == null) {
        throw new Error(`No client config with name '${environmentName}' found.`);
    }

    return config;
 }