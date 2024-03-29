const CrudRouter = require("./crudrouter");

class ApplicationConfigItemRouter extends CrudRouter{
    static getRouter(logic)
    {
        let router = CrudRouter.getRouter(logic);
        router.get('/find-by-apikey/:apikeyid', (req, res, next)=>{
            let apikeyid = req.params.apikeyid;

            logic.findByApiKey(apikeyid).then(function (savedO)
            {
                res.send(savedO);
            }).catch(function (err){
                console.log("error")
                console.log(err)
                res.send(err);
            })
            
        });

        return router;
    }
}

module.exports = ApplicationConfigItemRouter;