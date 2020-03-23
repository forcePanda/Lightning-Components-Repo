/*
 * Author		: Narender Singh
 * Date			: 11 January 2019
 * Description	: This class is used to generate and return a Mock response for the testing callouts
 */

@isTest
public class HttpCalloutMockResponse implements HttpCalloutMock {
    
    HttpResponse response; //Varible to store the mock response
    
    /* Method to set the 'response' variable based on the received mock response as a parameter */
    public void setResponse(HttpResponse mockResponse){
        response = mockResponse;
    }
    
    /* Implementing the 'respond' method of the HttpCalloutMock interface
     * Method simply returns the 'response' variable
     */
    public HttpResponse respond(HttpRequest request){
        return response;
    }
    
    /* Method to create and return an Http response based on the received parameters */
    public static HttpResponse mockResponseGenerator(string body, integer statusCode, string status){
        HttpResponse response = new HttpResponse();
        
        response.setBody(body);
        if(statusCode != null)
            response.setStatusCode(statusCode);
        if(status != null)
            response.setStatus(status);
        //system.debug('Generated response body: '+ response.getBody());
        return response;
    }

}