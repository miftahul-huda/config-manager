export class EditApplicationPage
{
    constructor(){
        this.appID = null;
        this.app = null;
        this.tblDomains = null;
        this.tblConfigs = null;
        this.apiKeys = [];
    }
    
    init(appID)
    {
        
        var me  = this;
        if(appID == "")
            appID = null;
        me.appID = appID;
        
        $("#popupConfig").hide();
        $("#popupDomain").hide();
        $("#popupApiKey").hide();

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
            me.onSaveConfig(me)
        })

        $("#btnCancelConfig").on("click", function(){
            $("#popupConfig").hide("slow");
            
        })

        $("#btnOkDomain").on("click", function(){
            $("#popupDomain").hide("slow");
            me.onSaveDomain(me)
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

        $("#btn-add-apikey").on("click", function(){
            let apiKey = me.makeid(90)
            $("#apiKey").val(apiKey)
            $("#popupApiKey").show("slow");
        })


        $("#btnCancelApiKey").on("click", function(){
            
            $("#popupApiKey").hide("slow");
        })


        $("#btnOkApiKey").on("click", function(){
            $("#popupApiKey").hide("slow");
            me.saveApiKey(me)
        })
        

        $("#apiKeys").on("change", function(){
            let apiKeyId = $(this).val();
            me.getAndDisplayConfigs(me, apiKeyId )
            me.getAndDisplayDomains(me, apiKeyId)
        })

        $("#btn-remove-apikey").on("click", function(){
            me.onDeleteApiKey(me)
        })

        $("#btn-copy-apikey").on("click", function(){
            me.onCopyApiKey(me)
        })
    }

    onDeleteApiKey(me)
    {
        $("#processgif").show();
        me.deleteApiKey(me, function(response){
            me.getAndDisplayApiKeys(me);
            $("#processgif").hide();
        }, function(resonse){
            $("#processgif").hide();
            alert(resonse.message)
        })
    }

    onCopyApiKey(me)
    {
        let apiKey = $("#apiKeys option:selected").text();
        navigator.clipboard.writeText(apiKey)
        alert("api key is coppied to clipboard")
    }

    deleteApiKey(me, callback, callbackError)
    {
        let apiKeyId = $('#apiKeys').val();
        let url = "/application-apikeys/delete/" + apiKeyId;
        $.get(url, function(response){
            if(response.success)
            {
                if(callback != null)
                    callback(response)
            }
            else {
                if(callbackError != null)
                    callbackError(response)
            }
        })
    }

    onSaveDomain(me)
    {
        let domain = $("#domain").val();
        let apiKeyId  =  $("#apiKeys").val();

        let newDomain = { domain: domain, apiKeyId: apiKeyId  }
        $("#processgif").show();
        me.saveDomain(newDomain, function(resonse){
            $("#processgif").hide();

            me.getAndDisplayDomains(me, apiKeyId)

        }, function(error){
            alert(error)
            $("#processgif").hide();
        })
    }

    saveDomain(domain, callback, callbackError)
    {
        let url = "/application-domains/create"
        $.post(url, JSON.stringify(domain), function(response){
            if(response.success)
            {
                if(callback != null)
                    callback(response)
            }
            else  
            {
                if(callbackError != null)
                    callbackError(response)

            }
        })
    }


    onSaveConfig(me)
    {
        let key = $("#configKey").val();
        let value = $("#configValue").val();
        let apiKeyId  =  $("#apiKeys").val();

        let newConfig = { variable: key, value: value, apiKeyId: apiKeyId  }
        $("#processgif").show();
        me.saveConfig(newConfig, function(resonse){
            $("#processgif").hide();
            me.getAndDisplayConfigs(me, apiKeyId)

        }, function(error){
            alert(error)
            $("#processgif").hide();
        })
    }

    saveConfig(config, callback, callbackError)
    {
        let url = "/application-configs/create"
        $.post(url, JSON.stringify(config), function(response){
            if(response.success)
            {
                if(callback != null)
                    callback(response)
            }
            else  
            {
                if(callbackError != null)
                    callbackError(response)

            }
        })
    }

    saveApiKey(me)
    {
        let apikey = $("#apiKey").val();
        let newApiKey = {}
        newApiKey.appID = me.appID;
        newApiKey.apiKey = apikey;
        console.log(newApiKey)
        let url = "/application-apikeys/create";
        $.post(url, JSON.stringify(newApiKey), function(response){
            console.log(response)
            me.getAndDisplayApiKeys(me)
        })
    }

    getAndDisplayApiKeys(me)
    {
        me.getApiKeys(me, function(response){
            console.log("REsponse")
            console.log(response)
            me.displayApiKeys(response.payload)
            let apiKeyId = $("#apiKeys").val();
            me.getAndDisplayConfigs(me, apiKeyId)
            me.getAndDisplayDomains(me, apiKeyId)
        })
    }

    getApiKeys(me, callback)
    {
        let url = "/application-apikeys/find-by-app/" + me.appID;

        $.get(url, function(response){
            if(callback != null)
                callback(response)
        })
    }

    displayApiKeys(apikeys)
    {
        $("#apiKeys").html("")
        apikeys.map((apikey)=>{
            let opt = document.createElement("option")
            $(opt).html(apikey.apiKey)
            $(opt).attr("value", apikey.id)
            $("#apiKeys").append(opt)
        })
    }

    getAndDisplayDomains(me, apiKeyId)
    {
        if(apiKeyId != null)
        {
            me.getDomains(me, apiKeyId, function(response){
                console.log("REsponse domains")
                console.log(response)
                let domains = response.payload;
                domains = me.setDomainData(domains)
                me.displayTableDomain(me, domains)
            })
        }
        else
        {
            me.displayTableDomain(me, [])
        }
    }

    getDomains(me, apiKeyId, callback)
    {
        let url = "/application-domains/find-by-apikey/" + apiKeyId;
        $.get(url, function(response){
            if(callback != null)
                callback(response)
        })
    }

    getAndDisplayConfigs(me, apiKeyId)
    {

        if(apiKeyId != null)
        {
            me.getConfigs(me, apiKeyId, function(response){

                let configs = response.payload;
                configs = me.setConfigData(configs)
                me.displayTableConfig(me, configs)
            })
        }
        else 
        {
            me.displayTableConfig(me, [])
        }

    }

    getConfigs(me, apiKeyId, callback)
    {
        let url = "/application-configs/find-by-apikey/" + apiKeyId;
        $.get(url, function(response){
            if(callback != null)
                callback(response)
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

        me.getAndDisplayApiKeys(me)
        
        //me.displayTableDomain(me, payload.domains)
        //me.displayTableConfig(me, payload.configs)

    }

    displayTableDomain(me, domains)
    {
        if(me.tblDomains != null)
        {
            me.tblDomains.destroy();
            me.tblDomains  = null;
        }

        console.log("Domains")
        console.log(domains)
            
        me.tblDomains = $("#domains").DataTable( {
            data: domains,
            columns: [{ data: 'domain' }, { data: 'colDelete' }],
            paging: false,
            searching: false
        })


        $(".domain-delete[data]").off("click");
        $(".domain-delete[data]").on("click", function() {
            let data = $(this).attr("data")
            me.onRemoveDomain(me, data)
        })
    }

    displayTableConfig(me, configs)
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
            me.onRemoveConfig(me, data)
        })
    }

    setDomainData(domains)
    {
        for(var i = 0; i < domains.length; i++)
        {
            domains[i].colDelete = "<div data='" + domains[i].id + "' class='domain-delete text-delete'>x</div>";
        }
        return domains;
    }

    setConfigData(configs)
    {
        for(var i = 0; i < configs.length; i++)
        {
            configs[i].colDelete = "<div data='" + configs[i].id + "' class='config-delete text-delete'>x</div>";
        }
        return configs;
    }

    onRemoveDomain(me, id)
    {
        let url = "/application-domains/delete/" + id;
        $("#processgif").show()
        $.get(url, function(response){

            console.log("response from " + url)
            console.log(response)
            $("#processgif").hide()
            let apiKeyId = $("#apiKeys").val();
            me.getAndDisplayDomains(me, apiKeyId )
        })
    }   

    onRemoveConfig(me, id)
    {
        let url = "/application-configs/delete/" + id;
        $("#processgif").show()
        $.get(url, function(response){
            $("#processgif").hide()
            let apiKeyId = $("#apiKeys").val();
            me.getAndDisplayConfigs(me, apiKeyId )
        })
    }

    save(me)
    {
        $("#processgif").show();
        me.app.appTitle = $("#appTitle").val();
        me.app.appInfo = $("#appInfo").val();
        me.app.appID = $("#appID").val();

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