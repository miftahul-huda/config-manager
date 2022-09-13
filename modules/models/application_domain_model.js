const { Model, DataTypes } = require('sequelize');

class ApplicationDomainModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            apiKeyId: DataTypes.INTEGER,
            domain: DataTypes.STRING
        }, 
        { sequelize, modelName: 'application_domain', tableName: 'application_domain', force: force });
    }
}

module.exports = ApplicationDomainModel;