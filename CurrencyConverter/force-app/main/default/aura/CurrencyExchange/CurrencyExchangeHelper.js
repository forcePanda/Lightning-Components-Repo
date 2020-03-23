({
    /* Method to process the SUCCESS response of 'getCurrencyList' server-side method*/
    handleCurrencyListResponse : function(component,response){
        var currencyList = response.getReturnValue();
        if(!currencyList || currencyList.length===0){
            var error = {"message":'No currencies listed in the custom metadata.'};
           	this.showError(component, [error]);
            return;
        }
        
        component.set("v.currencyList",currencyList);
        
        /* Set default value for picklists */
        component.set("v.baseCurrencyCode",currencyList[0].value);
        component.set("v.toCurrencyCode",currencyList[0].value);
    },
    
    /* Method to call the server-side controller to get the exchange rate between currencies */
    getExchangeRate : function(component){
        //console.log('Helper: getExchangeRate Called');
        component.set("v.showSpinner",true); //show Spinner
        
        /* Calling the server side action to get the exchange rate for the selected currencies */
        var action=component.get("c.getExchangeRate");
        action.setParams({
            'baseCurrencyCode'	: component.get("v.baseCurrencyCode"),
            'toCurrencyCode'	: component.get("v.toCurrencyCode")
        });
        action.setCallback(this,function(response){
            var state=response.getState();
            if(state==="SUCCESS"){
                this.handleExchangeRateResponse(component,response); // Calling helper method to handle 'SUCCESS' response
                component.set("v.showSpinner",false); //hide Spinner
            }
            else{
                this.handleBadServerResponse(component,response); // Calling helper method to handle response in case of failure
            }
        });
        $A.enqueueAction(action);
    },
    
    /* Method to process the SUCCESS response of 'getExchangeRate' server-side method*/
    handleExchangeRateResponse : function(component,response){
        this.calculateExchangeRate(component,response.getReturnValue()); // Calling helper method to calculate the exchange rate
        this.calculateTotal(component, 
                            component.get("v.baseCurrencyValue"),
                            component.get("v.exchangeRate")
                           ); // Calling the helper method to calculate total converted amount
        
    },
    
    /* Method to calculate the exchange rate */
    calculateExchangeRate : function(component, exchangeRateMap){
        //console.log('Helper: calculateExchangeRate Called');
        var baseCurrencyCode = component.get("v.baseCurrencyCode");
        var toCurrencyCode = component.get("v.toCurrencyCode");
        
        var exchangeRate = exchangeRateMap[toCurrencyCode] / exchangeRateMap[baseCurrencyCode] ;
        component.set("v.exchangeRate",exchangeRate.toFixed(3));
    },
    
    /* Method to calculate total converted amount */
    calculateTotal : function(component, baseCurrencyValue, exchangeRate){
        //console.log('Helper: calculateTotal Called');
        component.set("v.toCurrencyValue", (baseCurrencyValue * exchangeRate).toFixed(2));
    },
    
    /* Method to handle the server response when NOT success*/
    handleBadServerResponse : function(component,response){
        component.set("v.showSpinner",false); //hide Spinner
        
        var state = response.getState();
        console.log('State: '+ state);
        if(state ==="ERROR"){
            this.showError(component,response.getError());
        }
        else{
            this.showError(component,null);
        }
    },
    
    /* Method to show error on the component*/
    showError : function(component,errors){
        var err = 'Unknown error!';
        if(errors && Array.isArray(errors) && errors.length > 0){
            err = errors[0].message;
        }
        component.set("v.showError", true);
        component.set("v.errorMessage",err);
    },
    
    /* Method to reset some attribute values of component */
    resetCMP : function(component){
        component.set("v.exchangeRate",1);
        component.set("v.toCurrencyValue",
                      component.get("v.baseCurrencyValue")
                     );
    }
})