const pool = require('../../core/database');
module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into registration (firstName, lastName, gender, email, password, number) values(?,?,?,?,?,?)`,
            [
                data.firstName,
                data.lastName,
                data.gender,
                data.email,
                data.password,
                data.number
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                
                return callBack(null, results);
            }
        )
    },
    getUsers: callBack => {
        pool.query(
            `select id, firstName, lastName, gender, email, number from registration`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    getUserByUserId: (id, callBack) => {
        pool.query(
            `select id, firstName, lastName, gender, email, number from registration where id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    updateUser: (id, data, callBack) => {
        pool.query(
            `UPDATE registration SET firstName=?, lastName=?, gender=?, email=?, password=?, number=? WHERE id=?`,
            [
                data.firstName,
                data.lastName,
                data.gender,
                data.email,
                data.password,
                data.number,
                id
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getUserByUserId: (id, callBack) => {
        pool.query(
            `select id, firstName, lastName, gender, email, number from registration where id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    deleteUser: (id, callBack) => {
        pool.query(
            `delete from registration where id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        )
    },

}