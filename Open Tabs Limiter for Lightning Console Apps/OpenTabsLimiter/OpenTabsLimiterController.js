({
    init : function(cmp, event, helper) {
        var workspace = cmp.find("workspace");
        if(!workspace.isConsoleNavigation()) {
            var error = 'Oops! This component only works in console applications.';
            helper.fireToast(cmp, cmp.get("v.cmpName")+ ' Error!', 'error', error );
            throw error;
        }
    },

    handleTabCreation : function(cmp, event, helper) {
        var workspace = cmp.find("workspace");
        workspace.getAllTabInfo().then(function(tabs) {
            if(tabs.length > cmp.get("v.maxTabsLimit")) {
                helper.fireToast(cmp, 'Error!', 'error', cmp.get("v.maxLimitErrorMessage") );
                var tab = { 'tabId': event.getParam('tabId')};
                workspace.closeTab(tab).then(function(result) {
                    //Succes, do nothing
                }).catch(function(e) {
                    helper.fireToast(cmp, cmp.get("v.cmpName")+ ' Error!', 'error', JSON.stringify(e) );
                });
            }
        }).catch(function(e) {
            helper.fireToast(cmp, cmp.get("v.cmpName")+ ' Error!', 'error', JSON.stringify(e) );
        });
    }
})
