const CrudRouter = require("./crudrouter");

class ApplicationConfigItemRouter extends CrudRouter{
    static getRouter(logic)
    {
        let router = CrudRouter.getRouter(logic);
        router.get('/find-by-app/:appId', (req, res, next)=>{
            let appId = req.params.appId;

            logic.findByAppID(appId).then(function (savedO)
            {
                res.send(savedO);
            }).catch(function (err){
                console.log("error")
                res.send(err);
            })
            
        });

        return router;
    }
}

module.exports = ApplicationConfigItemRouter;