const { Model, DataTypes } = require('sequelize');

class ApplicationModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            appID: DataTypes.STRING,
            appTitle: DataTypes.STRING,
            appInfo: DataTypes.STRING,
            clientKey: DataTypes.STRING,
            clientSecret: DataTypes.STRING,
            username: DataTypes.STRING
        }, 
        { sequelize, modelName: 'application', tableName: 'application', force: force });
    }
}

module.exports = ApplicationModel;