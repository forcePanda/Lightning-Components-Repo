/*
 * Author		: Narender Singh
 * Date			: 11 January 2019
 * Description	: This is the test class for the 'CurrencyExchangeCMPController' class.
 */

@isTest
public class CurrencyExchangeCMPControllerTest {
        
    @isTest /* Method to the test the 'getCurrencyList' method */
    static void TestgetCurrencyList(){
        CurrencyExchangeCMPController.CurrencyListWrapper[] expectedCurrencyList = new CurrencyExchangeCMPController.CurrencyListWrapper[]{};
        
        Test.startTest();
        	expectedCurrencyList = CurrencyExchangeCMPController.getCurrencyList();
        Test.stopTest();
        
        Currency__mdt[] actualCurrencyList = [Select Id,Label,Currency_Code__c from Currency__mdt];
        system.assert( expectedCurrencyList.size() == actualCurrencyList.size());
    }
    
    /* Series of test methods to the test 'getCurrencyList' method & the exceptions */
    
    // First Exception Test
    @isTest // Test method for 'API Key not found' exception
    static void TestNoAPIKey(){
        Test.startTest();
        try{
            map<string,decimal> exchangeRateMap = CurrencyExchangeCMPController.getExchangeRate('EUR', 'USD');
            system.assert(false,'Exception check test failed: API Key not found');
        }catch(AuraHandledException e){
            system.debug(e.getMessage());
            system.assert(e.getMessage().containsIgnoreCase('API key not found!'));
        }
        Test.stopTest();
    }
    
    // Second Exception Test
    @isTest // Test method for Bad Request exception
    static void TestbadAPIRequest(){
        /* Creating Fixer_io custom setting */
        insert new Fixer_io__c(API_Key__c = '---Random Value---');
        
        /* Creating mock response */ 
        HttpResponse response = HttpCalloutMockResponse.mockResponseGenerator('Bad Request', 400, NULL);
        
        HttpCalloutMockResponse mock = new HttpCalloutMockResponse();
        mock.setResponse(response);
        Test.setMock(HttpCalloutMock.class, mock);
        
        Test.startTest();
        try{
            map<string,decimal> exchangeRateMap = CurrencyExchangeCMPController.getExchangeRate('EUR', 'USD');
            system.assert(false,'Exception check test failed: Bad Request Test');
        }catch(AuraHandledException e){
            //system.debug(e.getMessage());
            system.assert(e.getMessage().containsIgnoreCase('Bad Request'));
        }
        Test.stopTest();
    }
    
    // Third Exception Test
    @isTest // Test method for Fixer API Error response exception
    static void TestFixerAPIErrorResponse(){
        /* Creating Fixer_io custom setting */
        insert new Fixer_io__c(API_Key__c = '---Random Value---');
        
        /* Creating response for Invalid Acccess Key */
        FixerIOResponseWrapper.ErrorResponseWrapper fixerErrorResponse = new FixerIOResponseWrapper.ErrorResponseWrapper();
        fixerErrorResponse.code = 101;
        fixerErrorResponse.info = 'You have not supplied a valid API Access Key. [Technical Support: support@apilayer.com]';
        fixerErrorResponse.type = 'invalid_access_key';
        
        FixerIOResponseWrapper fixerResponse = new FixerIOResponseWrapper();
        fixerResponse.success = false;
        fixerResponse.error = fixerErrorResponse;
        
        HttpResponse response = HttpCalloutMockResponse.mockResponseGenerator(JSON.serialize(fixerResponse), 200, NULL);
        
        HttpCalloutMockResponse mock = new HttpCalloutMockResponse();
        mock.setResponse(response);
        Test.setMock(HttpCalloutMock.class, mock);
        
        Test.startTest();
        try{
            map<string,decimal> exchangeRateMap = CurrencyExchangeCMPController.getExchangeRate('EUR', 'USD');
            system.assert(false, 'Exception check test failed: Fixer API Error response test');
        }catch(AuraHandledException e){
            system.assert(e.getMessage().containsIgnoreCase('You have not supplied a valid API Access Key.'));
        }
        Test.stopTest();
    }
    
    
    @isTest /* Main Test for 'getCurrencyList' method  */
    static void TestgetExchangeRate(){
        
        /* Creating Fixer_io custom setting */
        insert new Fixer_io__c(API_Key__c = '---Random Value---');
        
        /* Setting up mock response */
        string body = '{"success":true,"timestamp":1578778505,"base":"EUR","date":"2020-01-11","rates":{"USD":1.112,"INR":78.908078}}';
        HttpResponse response = HttpCalloutMockResponse.mockResponseGenerator(body, 200, NULL);
        
        HttpCalloutMockResponse mock = new HttpCalloutMockResponse();
        mock.setResponse(response);
        Test.setMock(HttpCalloutMock.class, mock);
        
        Test.startTest();
        	map<string,decimal> exchangeRateMap = CurrencyExchangeCMPController.getExchangeRate('INR', 'USD');
        Test.stopTest();
        
        system.assert(exchangeRateMap.size() == 2, 'Assertion Failed: exchange rate map size mismatch.');
    }
    
    /* Test method series for 'getCurrencyList' method ENDS. */

}