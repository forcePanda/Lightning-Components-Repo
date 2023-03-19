@IsTest
private class QueryUtilTest {
    
    @IsTest
    static void queryWithSystemModeTest() {
        
        Test.startTest();
        SObject[] records = QueryUtil.queryWithSystemMode('SELECT Id FROM Account LIMIT 1', new Map<String, Object>());
        Test.stopTest();

        Assert.areEqual(
            0,
            records.size(),
            'Queried records does not match the expected count.'
        );
    }

    @IsTest
    static void queryWithUserModeTest() {
        
        Test.startTest();
        SObject[] records = QueryUtil.queryWithUserMode('SELECT Id FROM Account LIMIT 1', new Map<String, Object>());
        Test.stopTest();

        Assert.areEqual(
            0,
            records.size(),
            'Queried records does not match the expected count.'
        );
    }
}