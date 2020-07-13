export default (sequelize, Sequelize) => {
    const Post = sequelize.define('post', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contents: {
            type: Sequelize.STRING(10000),
            allowNull: false
        }
    });
    return Post;
};