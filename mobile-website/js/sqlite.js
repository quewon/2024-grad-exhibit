const Database = require('better-sqlite3');
const fs = require('fs');
var db;

const RESET_DB = false;

if (!fs.existsSync('db')) {
    fs.mkdirSync('db');
} else if (RESET_DB) {
    if (fs.existsSync('db/db.db')) fs.unlinkSync('db/db.db');
}
if (!fs.existsSync('db/db.db')) {
    db = new Database('db/db.db');
    db.exec(`
        CREATE TABLE "photos" (
            "photo_id"	INTEGER,
            "position" TEXT,
            "path"	TEXT,
            "printed"	INTEGER,
            PRIMARY KEY("photo_id")
        )
    `);
} else {
    db = new Database('db/db.db');
}

exports.db = db;

exports.insert = (table, obj) => {
    var keynames = "";
    var keys = "";
    for (let key in obj) {
        keynames += key + ",";
        keys += "@" + key + ",";
    }
    keynames = keynames.slice(0, -1);
    keys = keys.slice(0, -1);

    const stmt = db.prepare("INSERT INTO " + table + "(" + keynames + ") VALUES (" + keys + ")");
    return stmt.run(obj);
}

exports.delete = (table, obj) => {
    var conditions = "";
    for (let key in obj) {
        conditions += "WHERE " + key + "=@" + key + " AND ";
    }
    conditions = conditions.slice(0, -5);

    const stmt = db.prepare("DELETE FROM " + table + " " + conditions);
    return stmt.run(obj);
}

exports.update = (table, where, set) => {
    var obj = {};

    var where_conditions = "";
    for (let key in where) {
        obj["where_"+key] = where[key];
        where_conditions += "WHERE " + key + "=@where_" + key + " AND ";
    }
    where_conditions = where_conditions.slice(0, -5);

    var set_conditions = "";
    for (let key in set) {
        obj["set_"+key] = set[key];
        set_conditions += "SET " + key + "=@set_" + key + " AND ";
    }
    set_conditions = set_conditions.slice(0, -5);

    const stmt = db.prepare("UPDATE " + table + " " + set_conditions + " " + where_conditions);
    return stmt.run(obj);
}

exports.query = (table, obj) => {
    var conditions = "";
    for (let key in obj) {
        conditions += "WHERE " + key + "=@" + key + " AND ";
    }
    conditions = conditions.slice(0, -5);

    const stmt = db.prepare("SELECT * FROM " + table + " " + conditions);
    return stmt.get(obj);
}

exports.queryall = (table, obj, additional) => {
    var conditions = "";
    for (let key in obj) {
        conditions += "WHERE " + key + "=@" + key + " AND ";
    }
    conditions = conditions.slice(0, -5);

    if (additional) conditions += " " + additional;

    const stmt = db.prepare("SELECT * FROM " + table + " " + conditions);

    return stmt.all(obj);
}