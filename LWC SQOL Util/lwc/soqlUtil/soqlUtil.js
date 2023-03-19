import { LightningElement } from 'lwc';
import queryWithUserMode from '@salesforce/apex/QueryUtil.queryWithUserMode';
import queryWithSystemMode from '@salesforce/apex/QueryUtil.queryWithSystemMode';

export const ACCESS_LEVEL = {
    USER_MODE : "USER_MODE",
    SYSTEM_MODE : "SYSTEM_MODE"
}

export function query (
    queryString, 
    queryVariables = {}, 
    accessLevel = ACCESS_LEVEL.USER_MODE
) {

    validateQueryString(queryString);

    const params = getQueryParams(queryString, queryVariables);

    return executeQuery(params, accessLevel)
        .then(result => result)
        .catch(error => { throw error });
}

function executeQuery(params, accessLevel) {
    return (accessLevel == ACCESS_LEVEL.SYSTEM_MODE) 
        ? queryWithSystemMode(params) 
        : queryWithUserMode(params);
}

function getQueryParams(queryString, queryVariables) {
    return {
        queryString     : queryString,
        queryVariables  : queryVariables
    };
}

function validateQueryString(queryString) {
    return (queryString) 
        ? true
        : console.error('Query string cannot be empty.'); 
}

export default class SoqlUtil extends LightningElement {}