const CrudRouter = require("./crudrouter");

class ApplicationApiKeyRouter extends CrudRouter{
    static getRouter(logic)
    {
        let router = CrudRouter.getRouter(logic);
        router.get('/find-by-app/:appId', (req, res, next)=>{
            let appId = req.params.appId;
            logic.findByAppIDAndUser(appId, req.session.email).then(function (savedO)
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

module.exports = ApplicationApiKeyRouter;