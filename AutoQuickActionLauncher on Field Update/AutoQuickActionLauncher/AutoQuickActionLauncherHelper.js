({
    subscribe : function(cmp) {
        const empApi = cmp.find('empApi');
        const channel = cmp.get('v.eventName');
        const replayId = -1;
        
        // Subscribe to an event
        empApi.subscribe(channel, replayId, $A.getCallback(eventReceived => {
            // Process event (this is called each time we receive an event)
            //console.log('Received event ', JSON.stringify(eventReceived));
            cmp.set("v.eventPayload",JSON.stringify(eventReceived));
            this.eventHandler(cmp,eventReceived);
        })).then(subscription => {
            console.log('Subscribed to channel ', subscription.channel);
            cmp.set('v.subscription', subscription);
        });
        empApi.onError($A.getCallback(error => {
            console.error('EMP API error: ', JSON.stringify(error));
            this.fireToast(cmp,'error', JSON.stringify(error));
        }));
    },
    
    // Invokes the unsubscribe method on the empApi component
    unsubscribe : function(cmp) {
        const empApi = cmp.find('empApi');
        const subscription = cmp.get('v.subscription');
        
        empApi.unsubscribe(subscription, $A.getCallback(unsubscribed => {
          console.log('Unsubscribed from channel '+ unsubscribed.subscription);
          cmp.set('v.subscription', null);
        }));
    },
    
    eventHandler : function(cmp, eventPayload) {
        var fieldName = cmp.get("v.fieldApiName");
        var fieldValue = cmp.get("v.newFieldValue") ? cmp.get("v.newFieldValue") : null;
        var payload = eventPayload.data.payload;

        /* Check to see if the change was being made my current logged in user */
        var userId = $A.get( "$SObjectType.CurrentUser.Id" );
        if(!payload.hasOwnProperty(fieldName) || 
            payload.ChangeEventHeader.commitUser !== userId
          ) {
            return;
          }

        if(payload.hasOwnProperty(fieldName)) { // Checking if the payload has the field as a property
            if(payload[fieldName] === fieldValue || cmp.get("v.detectAllChanges")) {
                this.fireQuickAction(cmp);
            }
        } else {}
    },

    validateUserInputs : function(cmp) {
        //Validate Quick Action's name and availability
        this.checkIsQuickActionAvailable(cmp);
    },

    checkIsQuickActionAvailable : function(cmp) {
        var actionAPI = cmp.find("quickActionAPI");
        var actionName = cmp.get("v.quickActionApiName");
        var helper = this;
        actionAPI.getAvailableActions().then(function(result) {
            var isActionAvailable = false;
            for(var i = 0; i < result.actions.length; i++) {
                if(result.actions[i].actionName === actionName) {
                    isActionAvailable = true;
                    break;
                }
            }
            cmp.set("v.isQuickActionAvailable",isActionAvailable);
            if(isActionAvailable) {
                helper.subscribe(cmp);
            } else {
                helper.fireToast(cmp,'error',cmp.get("v.quickActionNotAvailableError"));
            }
        }).catch(function(e) {
            helper.fireToast(cmp,'error', JSON.stringify(e));
        });
    },

    fireQuickAction : function(cmp){
        var helper = this;
        if(!cmp.get("v.isQuickActionAvailable")) {
            helper.fireToast(cmp,'error',cmp.get("v.quickActionNotAvailableError"));
            return;
        }
        
        var actionAPI = cmp.find("quickActionAPI");
        var action = {
            'actionName' : cmp.get("v.quickActionApiName")
        };
        actionAPI.selectAction(action).then( function(result) {
            //Do nothing
        }).catch(function(e) {
            helper.fireToast(cmp,'error',JSON.stringify(e));
        });
        
    },

    fireToast: function (cmp, type, message) {
        var title = 'AutoQuickActionLauncher'; //Name of the component
        if(type === 'error') {
            title = title + ' Error!';
        } else {
            title='';
        }
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: title,
            message: message,
            type : type
        });
        toastEvent.fire();
    },

    setAttributes : function(cmp) {
        // Set the event name to subsribe to
        var objectApiName = cmp.get("v.objectApiName");
        var channelPrefix = cmp.get("v.channelPrefix");
        var cdcEventSuffix = 'ChangeEvent';
        cmp.set(
            "v.eventName", 
            channelPrefix + ( objectApiName.includes('__c') ? objectApiName.replace('__c','__') : objectApiName) + cdcEventSuffix 
        );
    
        var actionName = cmp.get("v.objectApiName") + '.' +cmp.get("v.quickActionApiName");
        cmp.set("v.quickActionApiName",actionName);
    }
})