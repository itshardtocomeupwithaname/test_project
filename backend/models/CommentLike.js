"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommentLike extends Model {
    static associate({ Comment, User }) {
      // define association here
    }
  }
  CommentLike.init(
    {
      commentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "CommentLike",
      timestamps: false,
    },
  );
  return CommentLike;
};
