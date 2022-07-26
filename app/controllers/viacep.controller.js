const db = require('../models');
const Viacep = db.viacep;
const Op = db.Sequelize.Op;
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

exports.create = (req, res) => {
  if (!req.body.zipcode) {
    res.status(400).send({
      message: "ZipCode can't be empty."
    });
    return;
  }
  if (!req.body.address) {
    res.status(400).send({
      message: "Address can't be empty."
    });
    return;
  }
  if (!req.body.city) {
    res.status(400).send({
      message: "City can't be empty."
    });
    return;
  }
  if (!req.body.state) {
    res.status(400).send({
      message: "State can't be empty."
    });
    return;
  }

  const cep = {
    zipcode: req.body.zipcode.trim().replace(/[^0-9]/g, ''),
    address: req.body.address,
    complement: req.body.complement,
    neighborhood: req.body.neighborhood,
    city: req.body.city,
    state: req.body.state
  };

  Viacep.create(cep)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error while creating the CEP."
      });
    });
};

exports.findAll = (req, res) => {
  const zipcode = req.query.zipcode.trim().replace(/[^0-9]/g, '');

  if (!zipcode) {
    res.status(400).send({
      message: "ZipCode can't be empty."
    });
    return;
  }

  var isCached = false;
  if (myCache.has(zipcode)) {
    var dataCached = myCache.get(zipcode);
    if (dataCached !== undefined && dataCached.length) {
      isCached = true;
      console.log('Loaded by cached');
      res.send((dataCached));
    } 
  } 

  if (!isCached){

    Viacep.findAll({
        where: { zipcode: { [Op.eq]: zipcode }}
      })
      .then(data => {
        myCache.set(zipcode, JSON.stringify(data), 3600);
        console.log('Loaded by database');
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error while search CEP"
        });
      });

  }
};

exports.update = (req, res) => {
  const id = req.params.id;

  Viacep.update(req.body, {
      where: {id: id}
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "CEP was update successfully."
        });
      }
      else {
        res.send({
          message: `Can't update CEP with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error update CEP with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Viacep.destroy({
      where: {id: id}
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "CEP deleted successfully!"
        });
      }
      else {
        res.send({
          message: `Can't delete CEP with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete CEP with id=" + id
      });
    });
};