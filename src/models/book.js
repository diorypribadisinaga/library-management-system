'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.hasMany(models.Borrowing, {
        foreignKey: 'book_id'
      })
    }
  }
  Book.init({
    id:{
      type: DataTypes.UUID,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    author:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    published_year:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isbn:{
      type: DataTypes.STRING(13),
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Book',
    timestamps: true,
    createdAt:'created_at',
    updatedAt:'updated_at',
  });
  return Book;
};
