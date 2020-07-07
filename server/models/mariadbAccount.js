export default (sequelize, Sequelize) => {
    const Account = sequelize.define('account', {
        username: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        admin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    return Account;
};