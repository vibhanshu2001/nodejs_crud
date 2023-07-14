const { create, getUserByUserId, getUsers, updateUser, deleteUser } = require('./userService');
const { genSaltSync, hashSync, compareSync } = require('bcrypt')
const { sign } = require('jsonwebtoken')
const logger = require('../../core/logger')
const redis = require('redis');
const { UserDataNotFoundException } = require('../../core/exception');

module.exports = {
    createUser: async (req, res) => {
        try {
            const body = req.body;
            const salt = genSaltSync(10);
            body.password = hashSync(body.password, 10);

            create(body, async (err, results) => {
                if (err) {
                    logger.info('[createUser] Database connection error: ' + err);
                    return res.status(500).json({
                        success: 0,
                        message: 'Database connection error'
                    });
                }
                const client = redis.createClient({ host: 'localhost', port: 6379 });
                client.on('error', (err) => console.log('Redis Client Error' + err));
                await client.connect();
                const insertedId = results.insertId;
                const cacheKey = `user:${insertedId}`;
                client.set(cacheKey, JSON.stringify(body));


                logger.info('[createUser] Created the user: ' + results);
                return res.status(200).json({
                    success: 1,
                    message: results
                });
            });
        } catch (error) {
            logger.error('[createUser] Error creating user: ' + error);
            return res.status(500).json({
                success: 0,
                message: 'Error creating user'
            });
        }
    },
    getUserByUserId: async (req, res) => {
        try {
            const id = req.params.id;
            const cacheid = `user:${id}`;
            const client = redis.createClient({ host: 'localhost', port: 6379 });

            client.on('error', (err) => {
                console.log('Redis Client Error: ' + err);
                throw err;
            });

            await client.connect();

            client.get(cacheid)
                .then((cachedData) => {
                    if (cachedData) {
                        logger.info('[getUserByUserId][cache] User detected with id: ' + cacheid);
                        return JSON.parse(cachedData);
                    } else {
                        // Wrap the getUserByUserId call in a Promise to use async/await
                        return new Promise((resolve, reject) => {
                            getUserByUserId(id, (err, results) => {
                                if (err) {
                                    logger.error('[getUserByUserId] Error occurred: ' + err);
                                    reject(new UserDataNotFoundException('User'));
                                }

                                if (!results) {
                                    logger.info('[getUserByUserId] Record not found');
                                    reject(new UserDataNotFoundException('User'));
                                }

                                logger.info('[getUserByUserId] User found');
                                resolve(results);
                            });
                        });
                    }
                })
                .then((results) => {
                    return res.json({
                        success: 1,
                        data: results,
                        cache: false
                    });
                })
                .catch((err) => {
                    logger.error('[getUserByUserId] Redis error occurred: ' + err);
                    return res.status(500).json({
                        success: 0,
                        message: 'Internal server error'
                    });
                });
        } catch (err) {
            logger.error('[getUserByUserId] Unexpected error occurred: ' + err);
            return res.status(500).json({
                success: 0,
                message: 'Internal server error'
            });
        }
    },

    getUsers: (req, res) => {
        getUsers((err, results) => {
            if (err) {
                logger.info('[getUsers] Error detected: ' + err);
                return;
            }
            logger.info('[getUsers] Get All Users request successfull: ' + results);
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    updateUsers: (req, res) => {
        const id = req.params.id;
        const data = req.body;
        const salt = genSaltSync(10);
        data.password = hashSync(data.password, 10);

        updateUser(id, data, (err, results) => {
            if (err) {
                logger.error('[updateUsers] Error occurred:' + err);
                return res.status(500).json({
                    success: 0,
                    message: 'An error occurred while updating the user'
                });
            }

            if (!results.affectedRows) {
                logger.info("[updateUsers] Record not found, can't update");
                return res.status(404).json({
                    success: 0,
                    message: "Record not found, can't update"
                });
            }

            logger.info('[updateUsers] User detected with id:' + id);
            return res.json({
                success: 1,
                updateStatus: 'updated successfully'
            });
        });
    },
    deleteUser: (req, res) => {
        const id = req.params.id;
        deleteUser(id, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "[deleteUser] Record not found, can't delete"
                })
            }
            return res.json({
                success: 1,
                data: "User deleted successfully"
            })
        })
    },
}