/*
 * Author       : Narender Singh
 * Date         : 11 January 2019
 * Description  : This class is a wrapper class(blue print) for the Fixer.io API response for currency exchange rates
 */

public class FixerIOResponseWrapper{
    public boolean success; 
    public ErrorResponseWrapper error; 
    public map<string,decimal> rates; 
    
    /* Wrapper class for the 'error' object in the Fixer.io API response */
    public class ErrorResponseWrapper {
        public integer code;
        public string type;
        public string info;
    }
}