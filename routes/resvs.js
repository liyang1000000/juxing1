var express = require('express');
var router = express.Router();
var Resv = require("../models/reservation");
var helper = require("../helpers/helper");
var User = require("../models/user");
var msger = require("../helpers/msger");

var getRoomPrice = function(room_size) {
    var price = '99.99';
    if (room_size === 1) {
        price = '35.00';
    }
    else if (room_size === 2) {
        price = '45.00';
    }
    else if (room_size === 3) {
        price = '55.00';
    }
    else {
        price = '99.99';
    }

    return price;
};

var roundTime = function(num){
    var result;
    if(num%1 !== 0){
        result = Math.floor(num) + 0.5;
    }else{
        result = num;
    }
    
    return result;
}

router.get('/get', function(req, res, next) {
    Resv.find({}, function(err, resvs) {
        if (err) return console.error(err);
        res.status(200).send(resvs);
    });
});


// Tweet.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
//   console.log( post );
// });


router.post('/getallbydate', function(req, res, next) {
    if (!req.body.resv_time) {
        res.status(200).send({
            act: "get all by date",
            success: 0,
            error: "missing resv_time"
        });
    }
    else {
        Resv.find({
            resv_time: new Date(req.body.resv_time) //need conversion
        }, function(err, resvs) {
            if (err) return console.error(err);
            res.status(200).send(resvs);
        });
    }
});

router.post('/getallbydateABS', function(req, res, next) {
    if (!req.body.resv_time_abs) {
        res.status(200).send({
            act: "get all by date",
            success: 0,
            error: "missing resv_time"
        });
    }
    else {
        Resv.find({
            resv_time_abs: req.body.resv_time_abs
        }, function(err, resvs) {
            if (err) return console.error(err);
            res.status(200).send(resvs);
        });
    }
});



// router.post('/getbyid', function(req, res, next) {

//     if (req.body.UID === undefined || req.body.UID === null) {
//         res.status(200).send({
//             act: "retrieve my reserv by id",
//             success: 0,
//             error: "missing user information"
//         });
//     }
//     else {
//         Resv.findOne({
//             UID: req.body.UID
//         }, null, {
//             sort: {
//                 created: -1
//             }
//         }, function(err, resv) {
//             if (err) return console.error(err);
//             if (resv) {
//                 var tempDate = new Date(resv.resv_time);
//                 var Datecheck = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()).getTime() + (1000 * 60 * 60 * 28); //28 hours after new day
//                 if (Date.now() <= Datecheck) {
//                     res.status(200).send({
//                         act: "add new resv",
//                         success: 1,
//                         error: "",
//                         _id: resv._id.toString(),
//                         name: resv.name,
//                         tel: resv.tel,
//                         start_time: resv.start_time,
//                         duration: resv.duration,
//                         party_size: resv.party_size,
//                         note: resv.note,
//                         status: resv.status,
//                         UID: resv.UID,
//                         resv_time: resv.resv_time,
//                         created: resv.created,
//                         room_size: resv.room_size
//                     });
//                 }
//                 else {
//                     res.status(200).send({
//                         act: "retrieve my reserv",
//                         success: 0,
//                         error: "Your reservation is expired!"
//                     });
//                 }
//             }
//             else {
//                 res.status(200).send({
//                     act: "retrieve my reserv",
//                     success: 0,
//                     error: "You have no reservation avaliable!"
//                 });
//             }
//         });
//     }
// });


router.post('/getbyid', function(req, res, next) {

    if (req.body.UID === undefined || req.body.UID === null) {
        res.status(200).send({
            act: "retrieve my reserv by id",
            success: 0,
            error: "missing user information"
        });
    }
    else {
        Resv.find({
            UID: req.body.UID,
            active: true
        }, {}, {
            sort: {
                created: -1
            }
        }, function(err, resv) {
            if (err) return console.error(err);
            if (resv) {
                for (var i = 0; i < resv.length; i++) {

                    // var tempDate = new Date(resv[i].resv_time);
                    var Datecheck = resv[i].resv_time_abs + ((resv[i].start_time + resv[i].duration + 1.5) * 60 * 60 * 1000); //28 hours after new day
                    var cutTime = Date.now() - (5 * 60 * 60 * 1000);
                    if (cutTime > Datecheck) {

                        Resv.findOneAndUpdate({
                                _id: resv[i]._id
                            }, {
                                active: false
                            },
                            function(err, doc) {
                                if (err) return console.error(err);
                            });


                        // res.status(200).send({
                        //     act: "add new resv",
                        //     success: 1,
                        //     error: "",
                        //     _id: resv[i]._id.toString(),
                        //     name: resv[i].name,
                        //     tel: resv[i].tel,
                        //     start_time: resv[i].start_time,
                        //     duration: resv[i].duration,
                        //     party_size: resv[i].party_size,
                        //     note: resv[i].note,
                        //     status: resv[i].status,
                        //     UID: resv[i].UID,
                        //     resv_time: resv[i].resv_time,
                        //     created: resv[i].created,
                        //     room_size: getRoomPrice(resv[i].room_size)
                        // });
                    }
                }
                Resv.find({
                    UID: req.body.UID,
                    active: true
                }, {}, {
                    sort: {
                        created: -1
                    }
                }, function(err, resv) {
                    if (err) return console.error(err);
                    if (resv) {
                        res.status(200).send({
                            act: "retrieve my reserv",
                            success: 1,
                            error: "",
                            resv_list: resv,
                            resv_number: resv.length
                        });

                    }
                    else {
                        res.status(200).send({
                            act: "retrieve my reserv",
                            success: 0,
                            error: "Your reservation is expired!"
                        });
                    }
                });
            }
            else {
                res.status(200).send({
                    act: "retrieve my reserv",
                    success: 0,
                    error: "You have no reservation avaliable!"
                });
            }
        });
    }
});

router.post('/add', function(req, res, next) {
    //Query database and send back all matched stores
    if (!req.body.name) {
        res.status(200).send({
            act: "add new resv",
            success: 0,
            error: "Missing name",
        });
    }
    else if (!req.body.tel) {
        res.status(200).send({
            act: "add new resv",
            success: 0,
            error: "Missing tel",
        });
    }
    else if (!req.body.party_size) {
        res.status(200).send({
            act: "add new resv",
            success: 0,
            error: "Missing party_size",
        });
    }
    else if (!req.body.start_time) {
        res.status(200).send({
            act: "add new resv",
            success: 0,
            error: "Missing start_time",
        });
    }
    else if (!req.body.duration) {
        res.status(200).send({
            act: "add new resv",
            success: 0,
            error: "Missing duration",
        });
    }
    else if (!req.body.resv_time) {
        res.status(200).send({
            act: "add new resv",
            success: 0,
            error: "Missing resv_time",
        });
    }
    else {
        
        var resv = new Resv({
            name: req.body.name,
            tel: req.body.tel,
            party_size: req.body.party_size,
            start_time: roundTime(req.body.start_time),
            duration: roundTime(req.body.duration),
            note: req.body.note,
            UID: req.body.UID,
            resv_time: new Date(req.body.resv_time),
            resv_time_abs: new Date(req.body.resv_time).getTime()
        });

        resv.save(function(err) {
            if (err) return console.error(err);
            console.log(resv.resv_time);
            res.status(200).send({
                act: "add new resv",
                success: 1,
                error: "",
                _id: resv._id.toString(),
                name: resv.name,
                tel: resv.tel,
                start_time: resv.start_time,
                duration: resv.duration,
                party_size: resv.party_size,
                note: resv.note,
                status: resv.status,
                UID: resv.UID,
                resv_time: resv.resv_time
            });
        });
    }
});

router.post('/delete', function(req, res, next) {

    if (req.body._id === undefined || req.body._id === null) {
        res.status(200).send({
            act: "delete reserv",
            success: 0,
            error: "missing reservation ID"
        });
    }
    else {
        Resv.findOne({
            _id: req.body._id
        }, function(err, reservs) {
            if (err) return console.error(err);
            if (reservs) {

                Resv.findOneAndRemove({
                    _id: req.body._id
                }, function(err, doc) {
                    if (err) return console.error(err);
                    res.status(200).send({
                        act: "reservation removed",
                        success: 1
                    });
                });

            }
            else {
                res.status(200).send({
                    act: "delete reserv",
                    success: 0,
                    error: "reservation not found!"
                });
            }
        });
    }
});



router.post('/update', function(req, res, next) {
    //Query database and send back all matched stores
    Resv.findOneAndUpdate({
            _id: req.body._id
        },
        req.body,
        function(err, resvs) {
            if (err) return console.error(err);
            res.status(200).send('success');
        });
});

// router.post('/showedup', function(req, res, next) {
//     //Query database and send back all matched stores
//     Resv.findOne({
//         _id: req.body._id
//     }, function(err, resvs) {
//         if (err) return console.error(err);
//         if (resvs) {
//             if (resvs.showed_up !== req.body.showed_up && req.body.showed_up !== undefined) {
//                 if (resvs.showed_up !== true) {
//                     Resv.findOneAndUpdate({
//                             _id: req.body._id
//                         },
//                         req.body,
//                         function(err, doc) {
//                             if (err) return console.error(err);
//                         });
//                     if (req.body.UID === undefined || req.body.UID === null) {
//                         res.status(200).send({
//                             act: "show_up reserv 1",
//                             success: 0,
//                             error: "no app reservation! show_up true"
//                         });
//                     }
//                     else {
//                         User.findOne({
//                             _id: req.body.UID
//                         }, function(err, users) {
//                             if (err) return console.error(err);
//                             if (users) {

//                                 var resvs_id = resvs._id;
//                                 var cur_resvs = {
//                                     "resvs_id": resvs_id
//                                 };
//                                 users.resvs.push(cur_resvs);
//                                 users.save(function(err) {
//                                     if (err) return console.error(err);
//                                     res.status(200).send('show_up true');
//                                 });
//                             }
//                         });
//                     }
//                 }
//                 else {
//                     Resv.findOneAndUpdate({
//                             _id: req.body._id
//                         },
//                         req.body,
//                         function(err, doc) {
//                             if (err) return console.error(err);
//                         });
//                     if (req.body.UID === undefined || req.body.UID === null) {
//                         res.status(200).send({
//                             act: "show_up reserv 2",
//                             success: 0,
//                             error: "no app reservation! show_up false"
//                         });
//                     }
//                     else {
//                         User.findOne({
//                             _id: req.body.UID
//                         }, function(err, users) {
//                             if (err) return console.error(err);
//                             if (users) {
//                                 users.resvs.pop();
//                                 //users.resvs.splice(resvs.length-1,1);
//                                 users.save(function(err) {
//                                     if (err) return console.error(err);
//                                     res.status(200).send('show_up false');
//                                 });
//                             }
//                         });
//                     }
//                 }
//             }
//             else {
//                 Resv.findOneAndUpdate({
//                         _id: req.body._id
//                     },
//                     req.body,
//                     function(err, resvs) {
//                         if (err) return console.error(err);
//                         res.status(200).send('success');
//                     });

//             }

//         }
//         else {
//             res.status(200).send({
//                 act: "show_up reserv 3",
//                 success: 0,
//                 error: "reservation not found!"
//             });
//         }
//     });
// });

router.post('/showedup', function(req, res, next) {
    //Show up behavior no reverse
    Resv.findOne({
        _id: req.body._id
    }, function(err, resvs) {
        if (err) return console.error(err);
        if (resvs) {
            req.body.room_price = getRoomPrice(req.body.room_size);
            if (resvs.showed_up !== true) {
                req.body.start_time = roundTime(req.body.start_time);
                req.body.duration = roundTime(req.body.duration);
                Resv.findOneAndUpdate({
                        _id: req.body._id
                    },
                    req.body,
                    function(err, doc) {
                        if (err) return console.error(err);
                    });
                if (req.body.UID === undefined || req.body.UID === null) {
                    res.status(200).send({
                        act: "show_up reserv 1",
                        success: 0,
                        error: "no app reservation! show_up true"
                    });
                }
                else {
                    User.findOne({
                        _id: req.body.UID
                    }, function(err, users) {
                        if (err) return console.error(err);
                        if (users) {
                            var resvs_id = resvs._id;
                            var cur_resvs = {
                                "resvs_id": resvs_id
                            };
                            if(req.body.showed_up === true){
                                users.resvs.push(cur_resvs);
                            }
                            users.save(function(err) {
                                if (err) return console.error(err);
                                res.status(200).send('show_up true');
                            });
                        }
                    });
                }
            }
            else {
                Resv.findOneAndUpdate({
                        _id: req.body._id
                    },
                    req.body,
                    function(err, doc) {
                        if (err) return console.error(err);
                    });
                res.status(200).send({
                    act: "show_up reserv 1",
                    success: 0,
                    error: "no app reservation! show_up false"
                });

            }
        }
        else {
            res.status(200).send({
                act: "show_up reserv 3",
                success: 0,
                error: "reservation not found!"
            });
        }
    });
});

module.exports = router;