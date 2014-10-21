"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    title: DataTypes.STRING,
    blog: DataTypes.STRING,
    AuthorId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(db) {
        Post.belongsTo(db.Author);
        // associations can be defined here
      }
    }
  });

  return Post;
};
