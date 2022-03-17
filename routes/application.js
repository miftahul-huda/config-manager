const CrudRouter = require("./crudrouter");

class ApplicationRouter extends CrudRouter{
    static getRouter(logic)
    {
        let router = CrudRouter.getRouter(logic);
        router.get("/:id", (req, res, next)=>{
            
            console.log("hereeeeeee")
            let id = req.params.id;
            let clientSecret = req.headers["authorization"];
            console.log("header: " + clientSecret)
            clientSecret = clientSecret.replace("Basic ", "")
            clientSecret = clientSecret.replace("basic ", "")
            let buff = new Buffer(clientSecret, 'base64');
            clientSecret = buff.toString('ascii');
            console.log(clientSecret)
            let domain = req.get("host")
            console.log(domain)

            let clientInfos = clientSecret.split(":")
            let clientKey = clientInfos[0]
            clientSecret = clientInfos[1]

            let logic = router.logic;
            logic.session = req.session;
            logic.getConfig(id, clientKey, clientSecret, domain).then(function (os)
            {
                res.send(os);
            }).catch(function (err){
                console.log("error")
                console.log(err)
                res.send(err);
            })
        })

        router.get("/get-by-appid/:id", (req, res, next)=>{
            
            console.log("hereeeeeee")
            let id = req.params.id;
            let logic = router.logic;
            logic.session = req.session;
            logic.getConfigMain(id).then(function (os)
            {
                res.send(os);
            }).catch(function (err){
                console.log("error")
                console.log(err)
                res.send(err);
            })
        })

        router.post("/update-all/:appID", (req, res, next)=>{
            
            let appID = req.params.appID;
            let logic = router.logic;
            logic.session = req.session;
            let app = req.body;
            logic.updateAll(appID, app).then(function (os)
            {
                res.send(os);
            }).catch(function (err){
                console.log("error")
                console.log(err)
                res.send(err);
            })
        })

        router.post("/create-all", (req, res, next)=>{
            
            let logic = router.logic;
            logic.session = req.session;
            let app = req.body;
            logic.createAll(app).then(function (os)
            {
                res.send(os);
            }).catch(function (err){
                console.log("error")
                console.log(err)
                res.send(err);
            })
        })

        router.get("/delete-all/:appID", (req, res, next)=>{
            
            let logic = router.logic;
            logic.session = req.session;
            let appID = req.params.appID;
            let app = req.body;
            logic.deleteAll(appID).then(function (os)
            {
                res.send(os);
            }).catch(function (err){
                console.log("error")
                console.log(err)
                res.send(err);
            })
        })

        return router;
    }
}

module.exports = ApplicationRouter;