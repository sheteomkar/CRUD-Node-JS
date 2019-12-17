var db = require("./db");

var Emp = function (emp) {
    this.name = emp.name;
    this.age = emp.age;
};
Emp.getEmployee = function (id, result) {
    var sql = "SELECT * FROM employee ";
    if (typeof (id) !== "undefined") {
        sql += " WHERE id = " + id;
//        sql += " WHERE id like '%" + id + "%' OR name like '%" + id + "%' OR age like '%" + id + "%'";
    }

    sql += " ORDER BY id DESC ";
    db.query(sql, function (err, res) {
        if (err)
            result(null, {"status": "0", "result": err});
        result(null, {"status": "1", "result": res});
    });

};

Emp.addEmployee = function (add_new, result) {
    db.query("INSERT INTO employee SET ? ", add_new, function (err, res) {
        if (err)
            result(null, {"status": "0", "result": err});
        result(null, {"status": "1", "result": res.insertId});
    });
}

Emp.deleteEmployee = function (id, result) {
    db.query("DELETE FROM employee WHERE id = ?", [id], function (err, res) {
        if (err)
            result(null, {"status": "0", "result": err});
        result(null, {"status": "1", "result": "Employee deleted successfully..!!!"});
    });
};

Emp.updateEmployee = function (id, update_data, result) {
    var sql = "UPDATE employee SET ";
    var ObjLength = Object.keys(update_data).length;
    var cnt = 1;
    Object.keys(update_data).forEach(function (key) {

        if (update_data[key] !== "" && update_data[key] !== undefined)
            if (ObjLength > cnt) {
                sql += " " + key + " =  '" + update_data[key] + "',";
            } else {
                sql += " " + key + " =  '" + update_data[key] + "' ";
            }
        cnt++;
    });
    sql += " WHERE id = " + id + " ";
    db.query(sql, function (err, res) {
        if (err)
            result(null, {"status": "0", "result": err});
        result(null, {"status": "1", "result": "Employee updated successfully..!!!"});
    });
};


module.exports = Emp;