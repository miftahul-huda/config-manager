const ApplicationModel  = require( './modules/models/application_model')
const ApplicationDomainModel  = require( './modules/models/application_domain_model')
const ApplicationConfigItemModel  = require( './modules/models/application_config_item_model')
const ApplicationAPiKeyModel = require("./modules/models/application_apikey_model")

const { Sequelize, Model, DataTypes } = require('sequelize');
const process = require('process');


const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: process.env.DBENGINE,
    logging: false
});


class Initialization {
    static async initializeDatabase(){

        let force = false;
        await ApplicationModel.initialize(sequelize, force );
        await ApplicationDomainModel.initialize(sequelize, force );
        await ApplicationConfigItemModel.initialize(sequelize, force );
        await ApplicationAPiKeyModel.initialize(sequelize, force );
        await sequelize.sync();
    }
}

module.exports = Initialization



