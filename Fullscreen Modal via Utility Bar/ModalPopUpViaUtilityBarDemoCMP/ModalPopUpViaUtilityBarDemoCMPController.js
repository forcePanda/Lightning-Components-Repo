({
    showModal : function(cmp, event, helper) {
        var modalBody = cmp.find("modalBody").get("v.value");

        cmp.find('overlayLib').showCustomModal({
            header: cmp.get("v.modalTitle"),
            body: modalBody,
            showCloseButton: true,
            closeCallback: function() {
                //Do nothing
            }
        });
    }
})
