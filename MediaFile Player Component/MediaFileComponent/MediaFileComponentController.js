({
	doInit : function(component, event, helper) {
		component.set('v.mycolumns', [
            { label: 'File name', fieldName: 'name', type: 'text'},
            { label: 'Type', fieldName: 'type', type: 'text'},
            { label : 'Action', type: 'button-icon', typeAttributes: { iconName: 'utility:play', name:'play', title: 'Action', iconAlternativeText: 'Play' }}
        ]);
        var action = component.get("c.getRelatedMediaFiles");
        action.setParams({
            recordId : component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            var state=response.getState();
            if(state==="SUCCESS"){
                //console.log(response.getReturnValue());
                var mediaFileList=response.getReturnValue();
                component.set("v.mediaFiles",mediaFileList);
            }
            else{
                console.log('State: '+state);
                if(state==="ERROR")
                    console.log(response.getError());
            }
        });
        $A.enqueueAction(action);
    },
    
    playFile : function(component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        
        if(action.name === 'play') {
            console.log('Play file: ' + JSON.stringify(row));
            component.set("v.mediaFile", row);
            component.set("v.showModal", true);
        }
        
    },
    
    closeModal : function(component) {
        component.set("v.showModal", false);
        component.set("v.mediaFile", null);
    }
})