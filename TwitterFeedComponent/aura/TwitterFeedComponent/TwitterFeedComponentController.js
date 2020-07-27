({
    handleRecordUpdated : function(component, event, helper) {
       
       //Setting the Twitterhandle attribute to record's TwitterHandle
       if(component.get("v.recordId")){
           if(component.get("v.simpleRecord.Twitter_Handle__c"))
               component.set("v.twitterHandle",component.get("v.simpleRecord.Twitter_Handle__c"));
       }
   }
})