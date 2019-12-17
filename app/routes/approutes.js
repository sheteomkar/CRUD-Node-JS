'use strict';
module.exports = function (app) {

    // import required controllers
    var emp = require('../controller/employeeController');

    // Routes
    app.route("/employee")
            .get(emp.getEmployee)
            .post(emp.addEmployee)
            .delete(emp.deleteEmployee)
            .put(emp.updateEmployee);

    app.route("/employee/:id")
            .get(emp.getEmployee);

};