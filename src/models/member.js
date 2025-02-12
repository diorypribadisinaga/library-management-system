'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Member.hasMany(models.Borrowing, {
        foreignKey: 'member_id',
      })
    }
  }
  Member.init({
    id:{
      type: DataTypes.UUID,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    phone:{
      type: DataTypes.STRING(13),
      allowNull: false,
    },
    address:{
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Member',
    timestamps: true,
    createdAt:'created_at',
    updatedAt:'updated_at',
  });
  return Member;
};
