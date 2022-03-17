import { GenericListPage } from "./genericlistpage.js";

export class ApplicationPage extends GenericListPage
{
    getApiScript()
    {
        return ["/javascripts/pages/api/applicationApi.js", "applicationApi"];
    }

    getTableId()
    {
        return "applist";
    }

    initRows(me, rows)
    {

        for(var i = 0; i < rows.length; i++)
        {
            let appID = rows[i].appID
            rows[i].appID = "<a href='/web/edit-application/" + rows[i].appID + "'>" + rows[i].appID + "</a>";
            rows[i].colDelete = "<button data='" + appID + "' class='delete-app-button'>x</button>";
        }

        return rows;
    }

    removeApplication(me, appID)
    {
        applicationApi.delete(appID, { success: function( result ) { console.log(result); me.init(); }, fail: null })
    }

    getColumns()
    {
        return [
            { data: 'no' },
            { data: 'appID'},
            { data: 'appTitle' },
            { data: 'createdAt' },
            { data: 'colDelete' }
        ];
    }

    initControls(me)
    {
        $("#btnAddApp").on("click", function(e){
            location = "/web/new-application";
        })

        $(".delete-app-button").on('click', function(){
            let id = $(this).attr("data");
            me.removeApplication(me, id);
        })
    }
}