const express = require('express');
const moment = require('moment');

const {
  create,
  readAll,
  readOne,
  update,
  del,
} = require('./notes');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/* todo útfæra api */

router.get('/', function(req, res, next) {
  readAll().then(function(data) {
    res.send(data);
  });
});

router.post('/', function(req, res, next) {
  if(req.body.datetime === null || req.body.title === null || req.body.text === null) {
    res.send({error:'Invalid JSON'});
    return;
  }
  
  let errormsg = [];

  if(req.body.title.length < 1 || req.body.title.length > 255) {
    errormsg.push({field:'title', message:'Title must be a string of length 1 to 255 characters'});
  }

  if(!(typeof req.body.text === 'string' || req.body.text instanceof String)) {
    errormsg.push({field:'text', message:'Text must be string'});
  }

  if(!(moment(req.body.datetime, moment.ISO_8601, true).isValid())) {
    errormsg.push({field:'datetime', message:'Datetime must be a ISO 8601 date'});
  }

  if(errormsg.length > 0) {
    res.status(400).send(errormsg);
  } else {
    create(req.body).then(function(data) {
      let skil = {
        id: data[0].id,
        title: req.body.title,
        text: req.body.text,
        datetime: req.body.datetime
      };
      res.status(201).send(skil);
    });
  }
});

router.get('/:id', function(req, res, next) {
  readOne(req.params.id).then(function(data) {
    res.send(data);
  });
});

router.put('/:id', function(req, res, next) {
  if(req.body.datetime === null || req.body.title === null || req.body.text === null) {
    res.send({error:'Invalid JSON'});
    return;
  }
  
  let errormsg = [];

  if(req.body.title.length < 1 || req.body.title.length > 255) {
    errormsg.push({field:'title', message:'Title must be a string of length 1 to 255 characters'});
  }

  if(!(typeof req.body.text === 'string' || req.body.text instanceof String)) {
    errormsg.push({field:'text', message:'Text must be string'});
  }

  if(!(moment(req.body.datetime, moment.ISO_8601, true).isValid())) {
    errormsg.push({field:'datetime', message:'Datetime must be a ISO 8601 date'});
  }

  if(errormsg.length > 0) {
    res.status(400).send(errormsg);
  } else {
    update(req.params.id, req.body).then(function(data) {
      if(data === 1) {
        let skil = {
          id: req.params.id,
          title: req.body.title,
          text: req.body.text,
          datetime: req.body.datetime
        };
        res.status(201).send(skil);
      } else {
        res.status(404).send("error: not found");
      }
    });
  }
});

router.delete('/:id', function(req, res, next) {
  del(req.params.id).then(function(data) {
    if(data === 1) {
      res.status(204).send();
    } else {
      res.status(404).send("error: not found");
    }
  });
});

module.exports = router;