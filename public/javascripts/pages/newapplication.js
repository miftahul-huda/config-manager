export class NewApplicationPage
{
    constructor(){
        this.appID = null;
        this.app = null;
    }
    
    init()
    {
        
        var me  = this;

        $("#processgif").show();
        $.getScript("/javascripts/pages/api/applicationApi.js", 
            function() {
                $("#processgif").hide();
                me.initControls(me)
            }
        );
    }


    initControls(me)
    {
        $("#appTitle").on("keyup", function(){
            let title = $(this).val()
            let appID = title.toLowerCase().replace(/\s/gi, "-");
            $("#appID").val(appID);
            
        })

        $("#btn-save-app").on("click", function(){
            me.save(me)
        })
        
    }

    save(me)
    {
        $("#processgif").show();
        me.app= {}
        me.app.appTitle = $("#appTitle").val();
        me.app.appInfo = $("#appInfo").val();
        me.app.appID = $("#appID").val();
        
        applicationApi.create(me.app, { success: function(result){ me.afterSave(me) }, fail: function(result){ $("#processgif").hide();  alert("Failed to save: " + result.message); }   });
    }

    afterSave(me)
    {
        $("#processgif").hide();
        alert("Saved!")
        location = "/";
    }

    cancel(me)
    {
        location = "/";
    }
}