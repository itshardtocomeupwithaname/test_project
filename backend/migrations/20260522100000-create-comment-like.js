'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CommentLikes', {
      commentId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Comments', key: 'id' },
        onDelete: 'CASCADE',
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.addConstraint('CommentLikes', {
      fields: ['commentId', 'userId'],
      type: 'unique',
      name: 'comment_likes_commentId_userId_unique',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CommentLikes');
  }
};
