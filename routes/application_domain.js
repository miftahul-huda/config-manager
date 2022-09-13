const CrudRouter = require("./crudrouter");

class ApplicationDomainRouter extends CrudRouter{
    static getRouter(logic)
    {
        let router = CrudRouter.getRouter(logic);
        router.get('/find-by-apikey/:appKeyId', (req, res, next)=>{
            let appKeyId = req.params.appKeyId;

            logic.findByApiKey(appKeyId).then(function (savedO)
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

module.exports = ApplicationDomainRouter;