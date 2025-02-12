'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Borrowing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Borrowing.belongsTo(models.Book, {
        foreignKey: 'book_id'
      });

      Borrowing.belongsTo(models.Member, {
        foreignKey: 'member_id'
      });

    }
  }
  Borrowing.init({
    id:{
      type: DataTypes.UUID,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    book_id:{
      type: DataTypes.UUID,
      allowNull: false,
    },
    member_id:{
      type: DataTypes.UUID,
      allowNull: false,
    },
    borrow_date:{
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    return_date:{
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null
    },
    status:{
      type: DataTypes.ENUM,
      values: ['BORROWED', 'RETURNED'],
      allowNull: false,
      defaultValue: 'BORROWED',
    }
  }, {
    sequelize,
    modelName: 'Borrowing',
    timestamps: true,
    createdAt:'created_at',
    updatedAt:'updated_at',
  });
  return Borrowing;
};
