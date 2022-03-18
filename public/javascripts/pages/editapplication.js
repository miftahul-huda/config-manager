export class EditApplicationPage
{
    constructor(){
        this.appID = null;
        this.app = null;
        this.tblDomains = null;
        this.tblConfigs = null;
    }
    
    init(appID)
    {
        
        var me  = this;
        if(appID == "")
            appID = null;
        me.appID = appID;
        
        $("#popupConfig").hide();
        $("#popupDomain").hide();

        $("#processgif").show();
        $.getScript("/javascripts/pages/api/applicationApi.js", 
            function() {
                me.initControls(me)
                me.getApp(me, me.appID,  { success: me.displayApp, fail: null} )
            }
        );
    }

    makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
        }
        return result;
    }

    initControls(me)
    {
        $("#appTitle").on("keyup", function(){
            let title = $(this).val()
            let appID = title.toLowerCase().replace(/\s/gi, "-");
            $("#appID").val(appID);
            
        })

        $("#btnGenerateKey").on("click", function(){
            let clientKey = me.makeid(10)
            let clientSecret = me.makeid(10)
            $("#clientKey").val(clientKey)
            $("#clientSecret").val(clientSecret)

            let httpHeader = "Basic " + me.getBase64ForClient(clientKey, clientSecret)
            $("#httpHeader").val(httpHeader);
        })

        $("#btn-add-domain").on("click", function(){
            $("#popupDomain").show("slow");
           
        })

        $("#btn-add-config").on("click", function(){
            $("#popupConfig").show("slow");
        })

        $("#btnOkConfig").on("click", function(){
            $("#popupConfig").hide("slow");
            let configKey = $("#configKey").val();
            let configValue = $("#configValue").val();
            let newConfig = { variable: configKey, value: configValue  }
            newConfig = me.setConfigData([newConfig])
            newConfig = newConfig[0]
            me.app.configs.push(newConfig);
           
            me.dispplayTableConfig(me, me.app.configs);
        })

        $("#btnCancelConfig").on("click", function(){
            $("#popupConfig").hide("slow");
            
        })

        $("#btnOkDomain").on("click", function(){
            $("#popupDomain").hide("slow");
            let domain = $("#domain").val();
            let newDomain = { domain: domain  }
            newDomain = me.setDomainData([newDomain])
            newDomain = newDomain[0]
            me.app.domains.push(newDomain);
            me.dispplayTableDomain(me, me.app.domains);
        })

        $("#btnCancelDomain").on("click", function(){
            $("#popupDomain").hide("slow");
        })

        $("#btn-save-app").on("click", function(){
            me.save(me);
        })

        $("#btn-cancel-app").on("click", function(){
            me.cancel(me);
        })

        
    }

    getBase64ForClient(clientKey, clientSecret)
    {
        let s = clientKey + ":" + clientSecret;
        var encodedString = btoa(s);
        return encodedString;
    }

    getApp(me, appId, callback)
    {

        if(appId != null)
        {
            applicationApi.get(appId, {
                success: (payload) =>{
                    me.app = payload;
                    $("#processgif").hide();
                    if(callback != null && callback.success != null)
                        callback.success(me, me.app)
                }
            })
        }
        else
        {
            me.app = {};
            me.app.domains = [];
            me.app.configs = [];
            $("#processgif").hide();
            if(callback != null && callback.success != null)
                callback.success(me, me.app)
        }

    }

    displayApp(me, payload)
    {
        console.log(payload)
        $("#appID").val(payload.appID);
        $("#appTitle").val(payload.appTitle);
        $("#appInfo").val(payload.appInfo);
        $("#clientKey").val(payload.clientKey);
        $("#clientSecret").val(payload.clientSecret);

        let httpHeader = "Basic " + me.getBase64ForClient(payload.clientKey, payload.clientSecret)
        $("#httpHeader").val(httpHeader);

        payload.domains = me.setDomainData(payload.domains)
        payload.configs = me.setConfigData(payload.configs)


        console.log("domains")
        console.log(payload.domains)

        console.log("configs")
        console.log(payload.configs)

        
        me.dispplayTableDomain(me, payload.domains)
        me.dispplayTableConfig(me, payload.configs)

    }

    dispplayTableDomain(me, domains)
    {
        if(me.tblDomains != null)
            me.tblDomains.destroy();

        me.tblDomains = $("#domains").DataTable( {
            data: domains,
            columns: [{ data: 'domain' }, { data: 'colDelete' }],
            paging: false,
            searching: false
        })


        $(".domain-delete[data]").on("click", function() {
            let data = $(this).attr("data")
            me.removeDomain(me, data)
            me.dispplayTableDomain(me, me.app.domains)
        })
    }

    dispplayTableConfig(me, configs)
    {
        if(me.tblConfigs != null)
            me.tblConfigs.destroy();

        me.tblConfigs = $("#configs").DataTable( {
            data: configs,
            columns: [{ data: 'variable' }, { data: 'value' }, { data: 'colDelete' }],
            paging: false,
            searching: false
        })

        $(".config-delete[data]").on("click", function() {
            let data = $(this).attr("data")
            me.removeConfig(me, data)
            me.dispplayTableConfig(me, me.app.configs)
        })
    }

    setDomainData(domains)
    {
        for(var i = 0; i < domains.length; i++)
        {
            domains[i].colDelete = "<div data='" + domains[i].domain + "' class='domain-delete text-delete'>x</div>";
        }
        return domains;
    }

    setConfigData(configs)
    {
        for(var i = 0; i < configs.length; i++)
        {
            configs[i].colDelete = "<div data='" + configs[i].variable + "' class='config-delete text-delete'>x</div>";
        }
        return configs;
    }

    removeDomain(me, domain)
    {
        var index = me.app.domains.map(function(e) { return e.domain; }).indexOf(domain);
        if (index !== -1) {
            me.app.domains.splice(index, 1);
        }

        console.log(me.app.domains)
    }

    removeConfig(me, config)
    {
        var index = me.app.configs.map(function(e) { return e.variable; }).indexOf(config);
        if (index !== -1) {
            me.app.configs.splice(index, 1);
        }

        console.log(me.app.configs)
    }

    save(me)
    {
        $("#processgif").show();
        me.app.appTitle = $("#appTitle").val();
        me.app.appInfo = $("#appInfo").val();
        me.app.appID = $("#appID").val();
        me.app.clientKey = $("#clientKey").val();
        me.app.clientSecret = $("#clientSecret").val();

        if(me.appID != null)
            applicationApi.update(me.appID, me.app, { success: function(result){ me.afterSave(me) }, fail: function(result){ $("#processgif").hide(); alert("Failed to save: " + result.message); }  })
        else
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