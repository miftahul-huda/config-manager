var applicationApi = {
    findAll: function (offset, limit, callback)
    {
        let url = CONFIG.apiUrl + "/applications/all/" + offset + "/" + limit;
        $.get(url, function(result){
            let data = result.payload;
            console.log(data)
            if(result.success )
            {
                if(callback != null && callback.success != null)
                    callback.success(data);
            }
            else
            {
                if(callback != null && callback.error != null)
                    callback.fail(result);
            }
        })
    }
    ,
    findByKeyword: function (keyword, offset, limit, callback)
    {
        let url = CONFIG.apiUrl + "/applications/find/" + keyword + "/" + offset + "/" + limit;
        $.get(url, function(result){
            let data = result.payload;
            if(result.success )
            {
                if(callback != null && callback.success != null)
                    callback.success(data);
            }
            else
            {
                if(callback != null && callback.error != null)
                    callback.fail(result);
            }
        })
    }
    ,
    get: function (appID, callback)
    {
        let url = CONFIG.apiUrl + "/applications/get-by-appid/" + appID;
        console.log(url)
        $.get(url, function(result)
        {
            let data = result.payload;
            console.log(data)
            if(result.success )
            {
                if(callback != null && callback.success != null)
                    callback.success(data);
            }
            else
            {
                if(callback != null && callback.fail != null)
                    callback.fail(result);
            }
        })
    }
    ,
    update: function (appID, app, callback)
    {
        let url = CONFIG.apiUrl + "/applications/update-all/" + appID;
        console.log(url)
        console.log(appID)
        console.log(app)

        for(var i=0; i < app.domains.length; i++)
        {
            app.domains[i].appID = app.appID;
        }

        for(var i=0; i < app.configs.length; i++)
        {
            app.configs[i].appID = app.appID;
        }

        $.post(url, JSON.stringify(app), function(result)
        {
            let data = result.payload;
            console.log(data)
            if(result.success )
            {
                if(callback != null && callback.success != null)
                    callback.success(data);
            }
            else
            {
                if(callback != null && callback.fail != null)
                    callback.fail(result);
            }
        })
    }
    ,
    create: function (app, callback)
    {
        let url = CONFIG.apiUrl + "/applications/create-all";
        console.log(url)
        console.log(appID)
        console.log(app)

        for(var i=0; i < app.domains.length; i++)
        {
            app.domains[i].appID = app.appID;
        }

        for(var i=0; i < app.configs.length; i++)
        {
            app.configs[i].appID = app.appID;
        }

        $.post(url, JSON.stringify(app), function(result)
        {
            let data = result.payload;
            console.log(result)
            if(result.success )
            {
                if(callback != null && callback.success != null)
                    callback.success(data);
            }
            else
            {
                if(callback != null && callback.fail != null)
                    callback.fail(result);
            }
        })
    }
    ,
    delete: function (appID, callback)
    {
        let url = CONFIG.apiUrl + "/applications/delete-all/" + appID;
        console.log(url)
        console.log(appID)

        $.get(url, function(result)
        {
            let data = result.payload;
            console.log(data)
            if(result.success )
            {
                if(callback != null && callback.success != null)
                    callback.success(data);
            }
            else
            {
                if(callback != null && callback.fail != null)
                    callback.fail(result);
            }
        })
    }
}