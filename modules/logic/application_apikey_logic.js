const { Sequelize, Model, DataTypes } = require('sequelize');
const { Op } = require("sequelize");

const CrudLogic = require("./crudlogic");

class ApplicationDomainLogic extends CrudLogic {

    static getModel()
    {
        const model = require("../models/application_apikey_model");
        return model;
    }

    static getPk(){
        return "id";
    }

    static getWhere(search)
    {
        let where = {
            appID : {
                [Op.like] : "%" + search + "%"
            } 
        }
        return where;
    }

    static getOrder()
    {
        let order = [['createdAt', 'DESC']];
        return order;
    }

    static async findByAppID(appID)
    {
        try{
            const CurrentModel = this.getModel();

            let os  = await CurrentModel.findAll({
                where: {
                    appID: appID
                }
            })
            return { success: true, payload: os }
        }
        catch (error)
        {
            throw { success: false, message: '', error: error };
        }   
    }

    static async findByAppIDAndUser(appID, username)
    {
        try{
            const CurrentModel = this.getModel();

            let os  = await CurrentModel.findAll({
                where: {
                    [Op.and] :[
                        { appID: appID },
                        { username: username }
                    ]
                    
                }
            })
            return { success: true, payload: os }
        }
        catch (error)
        {
            throw { success: false, message: '', error: error };
        }   
    }

    static initCreate(o)
    {
        o.username = this.session.email;
        return o;
    }
}

module.exports = ApplicationDomainLogic;