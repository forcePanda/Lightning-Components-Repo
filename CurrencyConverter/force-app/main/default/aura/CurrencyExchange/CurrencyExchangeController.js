({
    /* Method to handler component initialization */
	handleInit : function(component, event, helper) {
        component.set("v.showSpinner",true); //show Spinner
        
        /* Calling the server side action to the list of currency names & their respective codes */
        var action=component.get("c.getCurrencyList");
        action.setCallback(this,function(response){
            var state=response.getState();
            if(state==="SUCCESS"){
                helper.handleCurrencyListResponse(component,response); // Calling helper method to handle 'SUCCESS' response
                component.set("v.showSpinner",false); //hide Spinner
            }
            else{
                helper.handleBadServerResponse(component,response); // Calling helper method to handle response in case of failure
            }
        });
        $A.enqueueAction(action);
	},
    
    /* Method to handle when the Base currency is changed */
    handleBaseCurrencyChange : function(component, event, helper) {
        if(component.get("v.baseCurrencyCode") === component.get("v.toCurrencyCode")){
            helper.resetCMP(component);
        }
        else{
			helper.getExchangeRate(component); // Calling helper method to get the exchange rate
        }
	},
    
    /* Method to handle when the 'To' currency is changed */
    handleToCurrencyChange : function(component, event, helper) {
		if(component.get("v.baseCurrencyCode") === component.get("v.toCurrencyCode")){
            helper.resetCMP(component);
        }
        else{
			helper.getExchangeRate(component); // Calling helper method to get the exchange rate
        }
    },
    
    /* Method to handle when Base currency input amount is changed*/
    handleBaseCurrencyValueChange : function(component, event, helper){
        helper.calculateTotal(component, 
                              component.get("v.baseCurrencyValue"), 
                              component.get("v.exchangeRate")
                             ); //Calling the helper method to calculate total converted amount
    }
})