/*
 * Author		: Narender Singh
 * CreatedDate	: 11 January 2019
 * Description	: This class is the server-side controller for the 'Currency Exchange' Aura component. 
 */

public class CurrencyExchangeCMPController {
    
	static final string fixerNamedCredential = 'Fixer_io'; //API name of the Named Credential for the Fixer.io API.
    
    /* Wrapper class for Currency List(Currency Label - CurrencyCode) */
    public class CurrencyListWrapper{
        @AuraEnabled public string label; // Currency Label
        @AuraEnabled public string value; // Currency Code
    }
    
    /* Method to get all the currencies with their labels and code from Custom Metadata Types */
    @AuraEnabled(cacheable=true)
    public static CurrencyListWrapper[] getCurrencyList(){
        
        CurrencyListWrapper[] response = new CurrencyListWrapper[]{};
        
        for( Currency__mdt c : [Select Id,Label,Currency_Code__c from Currency__mdt]){
            CurrencyListWrapper obj = new CurrencyListWrapper();
            obj.label = c.Label; obj.value= c.Currency_Code__c;
            response.add(obj);
        }
        
        return response;
    }
    
    /* Method to get the list of exchange rates by making a callout to the Fixer.io API.
     * Base currency for the FREE version of Fixer.io API cannot be changed, and is set to 'EUR' by default.
     * So the exchange rates of the currencies in response are w.r.t to 'EUR' currency.
     */
    @AuraEnabled(cacheable=true)
    public static map<string,decimal> getExchangeRate(string baseCurrencyCode, string toCurrencyCode){
        
        /* Getting the API key from the Custom Settings Fixer_io__c */
        Fixer_io__c fixerCS = Fixer_io__c.getInstance();
        string APIkey = fixerCS.API_Key__c;
        
        if(string.isEmpty(APIkey)){
            throw createAuraHandledException('API key not found!'); // Throw exception when APIkey is NULL
        }
        
        /* Setting Callout params */
        string URL ='callout:'+fixerNamedCredential+'/latest'; // Endpoint for getting the current exchange rate.
        string query = '?access_key='+ APIkey +
            '&symbols=' + toCurrencyCode + ','+baseCurrencyCode;
        string method = 'GET';
        
        string response = makeCallout(URL,query,method); //Passing the request parameters to the 'makeCallout' method to make the callout. 
        
        /* Deserializing the response received from the API Callout 
         * 'FixerIOResponseWrapper' is the wrapper class to deserialize the Fixer.io API response
         */
        FixerIOResponseWrapper obj = new FixerIOResponseWrapper();
        obj = (FixerIOResponseWrapper) JSON.deserialize(response,FixerIOResponseWrapper.class);
        
        /* Checking the 'success' attribute in the API repsonse */
        if(!obj.success){// When false, throw an AuraHandledException with the error details from the response.
            system.debug('Fixer API Request Error: '+JSON.serialize(obj.error));
            
            /* For better error handling, we can also:
             * 1. Send email to Dev team and System Admin
             * 2. Log the error in custom object or something similar(if any such process is implemented in the org)
             */
            
            throw createAuraHandledException('Fixer API Request Error: '+JSON.serialize(obj.error));
        }
        
        //When 'success' equals true, return the 'rates' from the response, a string-decimal map of currency and values.
        return obj.rates;
    }
    
    /* Method to the API callout to the with received set of the request parameters */
    static string makeCallout(string endpointBaseUrl, string query, string method){
        
        Http h = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpointBaseUrl + query);
        request.setMethod(method);
        
        HttpResponse response = h.send(request);
        
        /*Check if the HTTP Request was successfull or not*/
        if(response.getStatusCode() == 200){//When successful, return the body of the received response 
            system.debug(response.getBody());
            return response.getBody();
        }
        else{//When failed, throw an AuraHandledException with the error details from the response.
          	system.debug('Status: '+response.getStatus() );
           	system.debug('Status Code: '+response.getStatusCode() );
           	system.debug('Error: '+ response.getBody());
            
            /* For better error handling, we can also:
             * 1. Send email to Dev team and System Admin
             * 2. Log the error in custom object or something similar(if any such process is implemented)
             */
           	
            throw createAuraHandledException('Request to Fixer API failed! Error: '+response.getBody());
        }
    }
    
    /* Method to generate and return an AuraHandledException */
    static AuraHandledException createAuraHandledException(string error){
        AuraHandledException e = new AuraHandledException(error);
        e.setMessage(error);
        return e;
    }
    
}