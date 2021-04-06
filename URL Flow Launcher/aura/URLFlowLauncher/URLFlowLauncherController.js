({
    init : function (cmp, event, helper) {
        
        helper.runFlow(cmp);
    },

    handleStatusChange : function (cmp, event, helper) {

        if (event.getParam('status') === "FINISHED") {
            helper.navigateToReturnUrl(cmp);
        }
    }
    
})
