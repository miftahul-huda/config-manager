const { Sequelize, Model, DataTypes } = require('sequelize');
const { Op } = require("sequelize");

const CrudLogic = require("./crudlogic");
const ApplicationModel = require("../models/application_model")
const ApplicationDomainLogic = require("./application_domain_logic")
const ApplicationConfigItemLogic = require("./application_config_item_logic");
const ApplicationDomainModel = require('../models/application_domain_model');
const ApplicationConfigItemModel = require('../models/application_config_item_model');

class ApplicationLogic extends CrudLogic {

    static getModel()
    {
        const model = require("../models/application_model");
        return model;
    }

    static getPk(){
        return "id";
    }

    static getDefaultWhere()
    {
        let session = this.session;
        let where = {
            username: {
                [Op.like] : "" + session.email + ""
            }
        }

        return where;
    }

    static getWhere(search)
    {
        let where = {
            [Op.or] :
            [
                {
                    appID : {
                        [Op.like] : "%" + search + "%"
                    }
                } 
                ,
                {
                    appTitle : {
                        [Op.like] : "%" + search + "%"
                    }
                } 
            ]
            
        }
        return where;
    }

    static getOrder()
    {
        let order = [['createdAt', 'DESC']];
        return order;
    }

    static async getConfig(appId, clientKey, clientSecret, domain)
    {
        try {

            let app = await ApplicationModel.findOne({ where: { appID: appId } })
            if(app.clientSecret != clientSecret || app.clientKey != clientKey)
            {
                return { success: false, message: "Invalid client secret for " + appId }
            }
            else
            {
                let result = await ApplicationDomainLogic.findByAppID(appId);
                let domains = result.payload;
                let domainExists = false;
                if(domains == null || domains.length == 0)
                    domainExists = true;

                if(domains != null && domains.length > 0)
                {
                    domains.forEach((dom) => {
                        if(dom.domain == domain)
                        {
                            domainExists = true;
                        }
                    })
                }

                if(domainExists == false)
                {
                    return { success: false, message: "Invalid domain request for " + appId }
                }

                result = await ApplicationConfigItemLogic.findByAppID(appId);
                let configs = result.payload;
                app = JSON.stringify(app)
                app = JSON.parse(app)
                app = this.cleanObject(app)
                app.configs = configs;

                return { success: true, payload: app };
            }
        }
        catch(e)
        {
            throw  e;
        }
    }

    static async getConfigMain(appId)
    {
        try {

            console.log(appId)

            let app = await ApplicationModel.findOne({ where: { appID: appId } });
            let domains = await ApplicationDomainModel.findAll({ where: { appID: appId } });
            let configs = await ApplicationConfigItemModel.findAll({ where: { appID: appId } });

            if(app == null)
                return { success: false, message: "No application with ID = " + appId }


            app = JSON.stringify(app)
            app = JSON.parse(app)
            //app = this.cleanObject(app)
            app.configs = configs;
            app.domains = domains;

            return { success: true, payload: app };
        }
        catch(e)
        {
            throw  e;
        }
    }

    static async updateAll(appID, app)
    {
        try {

            console.log(appID)
            //Validate app update
            let result = await this.validateUpdate(app);

            //If validation not valid
            if(result.success == false)
                return result;
            else 
            {
                app.username = this.session.email;
                await ApplicationModel.update(app, { where: { appID: appID } });
                await ApplicationDomainModel.destroy({ where: { appID: appID } });
                await ApplicationConfigItemModel.destroy({ where: { appID: appID } });
    
                await ApplicationDomainModel.bulkCreate(app.domains);
                await ApplicationConfigItemModel.bulkCreate(app.configs);
    
                app = this.cleanObject(app)
    
                return { success: true, payload: app };
            }

            
        }
        catch(e)
        {
            throw  e;
        }
    }

    static async deleteAll(appID)
    {
        try {

            console.log(appID)

            await ApplicationModel.destroy({ where: { appID: appID } });
            await ApplicationDomainModel.destroy({ where: { appID: appID } });
            await ApplicationConfigItemModel.destroy({ where: { appID: appID } });
            return { success: true, payload: appID };
        }
        catch(e)
        {
            throw  e;
        }
    }

    //Create app with configs and domains
    static async createAll(app)
    {
        try {


            //Validate app creation
            let result = await this.validateCreate(app);
            console.log("result")
            console.log(result)

            //If validation not valid
            if(result.success == false)
                return result;
            else
            {
                console.log("sdafadsfasaf")
                //Set username from session
                app.username = this.session.email;

                //Save app to database
                let newApp = await ApplicationModel.create(app);

                //Delete all domains and configs belong to app (just in case)
                await ApplicationDomainModel.destroy({ where: { appID: newApp.appID } });
                await ApplicationConfigItemModel.destroy({ where: { appID: newApp.appID } });

                //Save configs and domains
                await ApplicationDomainModel.bulkCreate(app.domains);
                await ApplicationConfigItemModel.bulkCreate(app.configs);

                //Clean newApp to remove protected properties 
                newApp = JSON.stringify(newApp)
                newApp = JSON.parse(newApp)
                newApp = this.cleanObject(newApp)

                //Return success result
                return { success: true, payload: newApp };
            }
        }
        catch(e)
        {
            throw  e;
        }
    }

    static cleanObject(app)
    {
        delete app.clientKey
        delete app.clientSecret
        return app
    }

    static async validateCreate(app)
    {
        if(app.appID == null || app.appID.trim().length == 0)
            return { success: false, message: "The application ID cannot be empty." };

        let  apps = await ApplicationModel.findAll({ where: { appID: app.appID } })
        if(apps.length > 0)
            return { success: false, message: "The name " + app.appID + " exists." };
        
        if(app.clientKey == null || app.clientKey.trim().length == 0)
            return { success: false, message: "Client key cannot be empty" };

        if(app.clientSecret == null || app.clientSecret.trim().length == 0)
            return { success: false, message: "Client secret cannot be empty" };

        return { success: true };
    }

    static async validateUpdate(app)
    {
        if(app.appID == null || app.appID.trim().length == 0)
            return { success: false, message: "The application ID cannot be empty." };

        let  apps = await ApplicationModel.findAll({ where: { appID: app.appID } })
        if(apps.length == 0)
            return { success: false, message: "The application '" + app.appID + "' does not exists." };

        if(app.clientKey == null || app.clientKey.trim().length == 0)
            return { success: false, message: "Client key cannot be empty" };

        if(app.clientSecret == null || app.clientSecret.trim().length == 0)
            return { success: false, message: "Client secret cannot be empty" };

        return { success: true };
    }
}

module.exports = ApplicationLogic;