const { Model, DataTypes } = require('sequelize');

class ApplicationConfigItemModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            apiKeyId: DataTypes.INTEGER,
            variable: DataTypes.STRING,
            value: DataTypes.STRING
        }, 
        { sequelize, modelName: 'application_config_item', tableName: 'application_config_item', force: force });
    }
}

module.exports = ApplicationConfigItemModel;