module.exports = (sequelize, Sequelize) => {
    const Viacep = sequelize.define("viacep", {
      zipcode: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      complement: {
        type: Sequelize.STRING
      },
      neighborhood: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
    });
    
    return Viacep;
  };