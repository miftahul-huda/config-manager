const { Model, DataTypes } = require('sequelize');

class ApplicationAPiKeyModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            appID: DataTypes.STRING,
            apiKey: DataTypes.STRING,
            username: DataTypes.STRING
        }, 
        { sequelize, modelName: 'application_apikey', tableName: 'application_apikey', force: force });
    }
}

module.exports = ApplicationAPiKeyModel;