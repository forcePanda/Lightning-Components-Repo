({
    openDeletedFieldsWindow : function(component, event, helper) {
        var closeQuickActionModal = $A.get("e.force:closeQuickAction");
        closeQuickActionModal.fire();
        var pageURL = window.location.href;
        const pageURLMidString = component.get("v.pageURLMidString");
        const pageURLEndString = component.get("v.pageURLEndString");

        if(!pageURL.includes(pageURLMidString) || !pageURL.includes(pageURLEndString)) {
            alert(component.get("v.warningMessage"));
            return;
        }

        var startIndex = pageURL.indexOf(pageURLMidString) + pageURLMidString.length;
        var endIndex = pageURL.indexOf('/',startIndex);
        var sObjectId = pageURL.substring(startIndex,endIndex);
        
        var url = component.get("v.deletedFieldsPageURL") + sObjectId;
        var w = component.get("v.popupWidth");
        var h = component.get("v.popupHeight");
        var left = component.get("v.positionLeft");
        var top = component.get("v.positionTop");
        window.open(url, 'Deleted Fields', 'width='+w+', height='+h+', top='+top+', left='+left);
    }
})