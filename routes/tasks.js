const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
//require('mongoose-currency').loadType(mongoose);
//var Currency = mongoose.Types.Currency;

const Task = require('../models/task');
const taskRouter = express.Router();
const authenticate = require('../authenticate');
taskRouter.use(bodyParser.json());
var cors = require('./cors');

taskRouter.route("/")
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Task.find({auhter:req.user.id}).sort({createdAt:-1})
            .then((tasks) => {
                if (tasks != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(tasks);
                }
                else {
                    err = new Error('No Tasks yet , Please add Task! ');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));

    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Task.create(req.body)
            .then((task) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(task);
            }, err => next(err))
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /task');

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /task');
    });
      

taskRouter.route('/:taskId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Task.find({_id:req.params.taskId,author:req.user._id})
            .then((task) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(task);
            }, err => next(err))
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /task/' + req.params.taskId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
        Tasks.updateOne({_id:req.params.taskId,author:req.user._id}, { $set: req.body }, { runValidators: true })
            .then((task) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end("task " + task._id + " updated.");
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
        Task.deleteOne({ _id: req.params.taskId ,author:req.user._id})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end("task  deleted.");
            }, err => next(err))
            .catch(err => next(err));
    });
module.exports = taskRouter;
