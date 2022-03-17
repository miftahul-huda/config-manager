const { Sequelize, Model, DataTypes } = require('sequelize');
const { Op } = require("sequelize");

const CrudLogic = require("./crudlogic");

class ApplicationConfigItemLogic extends CrudLogic {

    static getModel()
    {
        const model = require("../models/application_config_item_model");
        return model;
    }

    static getPk(){
        return "id";
    }

    static getWhere(search)
    {
        let where = {
            [Op.or] :
            [
                {
                    variable : {
                        [Op.like] : "%" + search + "%"
                    }
                } 
                ,
                {
                    value : {
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
}

module.exports = ApplicationConfigItemLogic;