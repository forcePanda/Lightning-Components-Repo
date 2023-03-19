public with sharing class QueryUtil {

    @AuraEnabled
    public static SObject[] queryWithSystemMode(String queryString, Map<String, Object> queryVariables) {
        return query(queryString, queryVariables, AccessLevel.SYSTEM_MODE);
    }

    @AuraEnabled
    public static SObject[] queryWithUserMode(String queryString, Map<String, Object> queryVariables) {
        return query(queryString, queryVariables, AccessLevel.USER_MODE);
    }

    private static SObject[] query(String queryString, Map<String, Object> queryVariables, System.AccessLevel accessLevel) {
        return Database.queryWithBinds(queryString, queryVariables, accessLevel);
    }
}