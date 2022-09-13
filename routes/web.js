const CrudRouter = require("./crudrouter");

class WebRouter {

    static getConfig()
    {
        return {};
    }

    static getRouter(logic)
    {
        var express = require('express');
        var router = express.Router();
        const path = require('path');
        router.logic = logic;
        let me = this;

        router.get('', (req, res)=>{

            let session = req.session;
            if(session.login != true)
                res.redirect("/web/signin")

            var dir = __dirname;
            var p = path.resolve( dir, "../public/pages/", "index");
            res.render(p, { session: session, config: me.getConfig() } )
        });

        router.get('/edit-application/:appID', (req, res)=>{
            let session = req.session;
            if(session.login != true)
                res.redirect("/web/signin")

            var dir = __dirname;
            var p = path.resolve( dir, "../public/pages/", "editapplication");
            res.render(p, { appID: req.params.appID, session: session, config: me.getConfig() } )
        });

        router.get('/new-application', (req, res)=>{
            let session = req.session;
            if(session.login != true)
                res.redirect("/web/signin")

            var dir = __dirname;
            var p = path.resolve( dir, "../public/pages/", "newapplication");
            res.render(p, { appID: "", session: session,  config: me.getConfig() } )
        });

        router.get('/signin', (req, res)=>{
            var dir = __dirname;
            var p = path.resolve( dir, "../public/pages/", "signin");
            res.render(p, { config: me.getConfig() } )
        });

        router.get('/loggedin', (req, res)=>{
            var appSession = req.session;
            var id = req.query.id;
            var email = req.query.email;
            var name = req.query.name;
            var image = req.query.photo;

            //appSession.id = id;
            appSession.email = email;
            appSession.name = name;
            appSession.image = image;   
            appSession.login = true;

            console.log("/loggedin")
            res.redirect('/')  
        });

        router.get('/signout', (req, res)=>{
            var appSession = req.session;
            appSession.email = null;
            appSession.name = null;
            appSession.login = null;

            var dir = __dirname;
            var p = path.resolve( dir, "../public/pages/", "signout");
            res.render(p, { config: me.getConfig() } )
        });

        return router;
    }
}

module.exports = WebRouter;