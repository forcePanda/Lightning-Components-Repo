({
	createMediaPlayerComponent : function(cmp,mediaFile) {
        $A.createComponent(
            "c:MediaPlayerComponent",
            { 
                'mediaFile' : mediaFile
            },
            function(element){
                var player = cmp.find("mediaPlayer");
                if (player.isValid()) {
                    var body = player.get("v.body");
                    body.push(element);
                    player.set("v.body", body);
                }
            }
        );
	}
})