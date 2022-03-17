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
            app.username = this.session.email;
            await ApplicationModel.update(app, { where: { appID: appID } });
            await ApplicationDomainModel.destroy({ where: { appID: appID } });
            await ApplicationConfigItemModel.destroy({ where: { appID: appID } });

            await ApplicationDomainModel.bulkCreate(app.domains);
            await ApplicationConfigItemModel.bulkCreate(app.configs);

            return { success: true, payload: app };
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

    static async createAll(app)
    {
        try {

            console.log(app)

            app.username = this.session.email;

            let newApp = await ApplicationModel.create(app);
            await ApplicationDomainModel.destroy({ where: { appID: newApp.appID } });
            await ApplicationConfigItemModel.destroy({ where: { appID: newApp.appID } });

            await ApplicationDomainModel.bulkCreate(app.domains);
            await ApplicationConfigItemModel.bulkCreate(app.configs);

            return { success: true, payload: newApp };
        }
        catch(e)
        {
            throw  e;
        }
    }
}

module.exports = ApplicationLogic;