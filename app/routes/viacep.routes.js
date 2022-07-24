module.exports = app => {
    const viacep = require("../controllers/viacep.controller.js");

    var router = require("express").Router();

    // Create new
    router.post("/", viacep.create);

    // Retrieve a single with
    router.get("/", viacep.findAll);

    // Update with id
    router.put("/:id", viacep.update);

    // Delete with id
    router.delete("/:id", viacep.delete);

    app.use('/api/viacep', router);
}; 