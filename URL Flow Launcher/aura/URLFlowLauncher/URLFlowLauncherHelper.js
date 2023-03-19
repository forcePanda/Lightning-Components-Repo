({
    runFlow : function(cmp) {

        const flow = cmp.find("flow");

        const inputVariables = this.getFlowInputVariables(cmp);

        flow.startFlow( cmp.get("v.flowApiName"), inputVariables );
    },

    getFlowInputVariables : function(cmp) {
        
        const state = cmp.get("v.pageReference").state;

        let inputVariables = [];

        for( const key in state) {

            const paramName = key.replace('c__','');
            const value = this.getParamValue(state[key]);
            

            if(paramName === 'flowApiName' || paramName === 'returnURL') {
                cmp.set("v."+paramName, value);
                continue;
            }

            let inputVariable = {};
            inputVariable.name = paramName;
            inputVariable.value = value;
            
            /**
             * We don't need to set the type explicitly here because
             * the flow engine smartly auto converts the data type from String to the actual data type.
             * Tested for: Text, Text Collection, Number, Boolean and Date.
             * For Date, the date param should be passed as text. For example, {!TEXT(TODAY())}.
             * Same didn't work datetime data type though.
             */
            inputVariable.type = 'String'; 

            inputVariables.push(inputVariable);
        }
        return inputVariables;
    },

    getParamValue : function(value) { 

        if(value.charAt(0) === '[') { 
            return this.getValuesAsList(value);
        }

        return value;
    },

    getValuesAsList : function(value) {

        let valuesList = [];

        value.replace("[", '').replace("]", '').split(',').forEach( item => {
            valuesList.push(item);
        });

        return valuesList;
    },

    navigateToReturnUrl: function(cmp) {

        var navService = cmp.find("navService");

        var pageReference = {
            type: 'standard__webPage',
            attributes: {
                url: cmp.get("v.returnURL")
            }
        };

        navService.navigate(pageReference);
    }
})
