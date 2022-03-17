export class GenericListPage {
    
    constructor(){
        this.offset = 0;
        this.totalData = 0;
        this.limit  =  10;
        this.table = null;
        this.api = null;
    }

    getApiScript()
    {
        return ["/javascripts/pages/api/documentApi.js", "documentApi"];
    }

    getTableId()
    {
        return "documentlist";
    }

    init()
    {
        var me  = this;
        let script = me.getApiScript();
        $.getScript(script[0], 
            function() {
                eval("me.api = " + script[1]);
                console.log(me.api)

                me.loadData(me,  { success: function(payload){ me.loadDataSuccess(me, payload) }, error: null} )
                
            }
        );
    }
    
    loadDataSuccess (me, payload)
    {
        $("#processgif").hide();
        if(me.table != null)
            me.table.destroy();

        let rows = payload.rows;
        for(var i = 0; i < rows.length; i++)
        {
            rows[i].no = i + 1;
        }

        rows = me.initRows(me, rows);
        console.log("rows:")
        console.log(rows)

        console.log(rows);
        let cols = me.getColumns();
        console.log(cols);

        me.table = $('#' + me.getTableId()).DataTable( {
            data: rows,
            columns: cols,
            paging: false,
            searching: false
        });

        me.totalData = payload.count;
        let totalPage = Math.floor( me.totalData / me.limit)  + 1;
        me.createPaginationButtons(totalPage);
        
        $("select.limitselect").unbind("change");
        $("select.limitselect").val(me.limit);
        $("a[data-dt-idx]").on("click",function(){
            let page = $(this).text();
            console.log(page)
            me.offset = (page - 1) * me.limit;
            me.loadData(me,  { success: function(payload){ me.loadDataSuccess(me, payload) }, error: null} );
        })

        $("select.limitselect").on("change", function(){
            //console.log($(this).val())
            me.offset = 0;
            me.loadData(me,  { success: function(payload){ me.loadDataSuccess(me, payload) }, error: null} );
        });

        me.initControls(me);
    }
    
    createPaginationButtons(total)
    {
        
        $("div.dataTables_paginate > span").html("");
        for(var i = 0; i < total; i++)
        {
            let num = i + 1;
            let btn = "<a class=\"paginate_button current\"  data-dt-idx=\"" + num + "\" tabindex=\"" + i + "\">" + num + "</a>";
            $("div.dataTables_paginate > span").append(btn);
        }
    }

    getColumns()
    {
        return [
            { data: 'no' },
            { data: 'filename'},
            { data: 'upload_date' },
            { data: 'upload_by' },
            { data: 'document_size' }
        ];
    }

    initRows(me,rows)
    {
        return rows;
    }
    
    initControls(me)
    {
        $("#btn-upload").click(function() {
            location = "/documents/upload";  
        })

        
    }
    
    loadData(me, callback)
    {
        let search = $("input[type=search").val();
        let offset = me.offset;
        let limit = $("select.limitselect").val();
        if(limit == null)
            limit  = 10;
        
        console.log("limit : " +  limit)
        me.limit = limit;

        $("#processgif").show();
        me.api.findAll(offset, me.limit, callback);
    }
}