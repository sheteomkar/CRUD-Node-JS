"use strict";
// Import model
var emp = require('../model/empModel');

exports.getEmployee = function (req, res) {
    emp.getEmployee(req.params.id, (err, response) => {
        if (err)
            res.send("Error : " + err);
//        res.send(response);
        res.render('pages/employee', {
            result: response,
        });
    });
};

exports.addEmployee = function (req, res) {
    var add_emp = new emp(req.body);
    if (typeof (add_emp.name) === "undefined" || add_emp.name === "") {
        res.send({status: "0", message: 'Please provide employee name.'});
    } else if (typeof (add_emp.age) === "undefined" || add_emp.age === "") {
        res.send({status: "0", message: 'Please provide employee age.'});
    } else {
        emp.addEmployee(add_emp, (err, response) => {
            if (err)
                res.send("Error : " + err);
            res.send(response);
        });
    }
};

exports.deleteEmployee = function (req, res) {
    emp.deleteEmployee(req.body.id, (err, response) => {
        if (err)
            res.send("Error : " + err);
        res.send(response);
    });
};


exports.updateEmployee = function (req, res) {
    emp.updateEmployee(req.body.id, new emp(req.body), (err, response) => {
        if (err)
            res.send("Error : " + err);
        res.send(response);
    });

};



