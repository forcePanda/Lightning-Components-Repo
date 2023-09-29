({
    init : function (cmp, event, helper) {
        helper.runFlow(cmp);
    },

    refresh : function (cmp, event, helper) {
        $A.get('e.force:refreshView').fire();
    },

    handleStatusChange : function (cmp, event, helper) {
        if (event.getParam('status') === "FINISHED") {
            var outputVariables = event.getParam("outputVariables");
            var outputVar;
            for(var i=0; i < outputVariables.length; i++) {
                outputVar = outputVariables[i];
                if(outputVar.name === "returnURL" && outputVar.value != "" && outputVar.value != null) {
                    cmp.set("v.returnURL", outputVar.value);
                }
            }
            helper.navigateToReturnUrl(cmp);
        }
    }
    
})
