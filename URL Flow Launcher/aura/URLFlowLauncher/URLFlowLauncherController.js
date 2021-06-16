({
    init : function (cmp, event, helper) {
        helper.runFlow(cmp);
    },

    refresh : function (cmp, event, helper) {
        $A.get('e.force:refreshView').fire();
    },

    handleStatusChange : function (cmp, event, helper) {

        if (event.getParam('status') === "FINISHED") {
            helper.navigateToReturnUrl(cmp);
        }
    }
    
})
