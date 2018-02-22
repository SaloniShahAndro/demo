var express = require('express');
var upload_files = require('multer')();
var app=express();
app.set('views','./views');
app.set('view engine', 'ejs');
// .. regular set-up for 'app' ..
app.get('/batch/upload',function(req,res){
    res.render('dropzone')
}); 

app.post('/batch/upload', upload_files.array('source_file[]'), process_upload); 

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var sanitize = require("sanitize-filename");

function process_upload(req, res) {
  if(req.files) { 
    console.log("req.files.length = ", req.files.length);
    
    var upload_dir='uploads';  //somewhere relevant
    
    Promise.resolve(req.files)
      .each(function(file_incoming, idx) {
          console.log("  Writing POSTed data :", file_incoming.originalname);
          var sanitized_filename = sanitize(file_incoming.originalname);
          var file_to_save = path.join( upload_dir, sanitized_filename );
          
          return fs
            .writeFileAsync(file_to_save, file_incoming.buffer)    
      })
      // .catch() code not included for clarity : Clearly you'll need to do some error checking...
      .then( _ => {
        console.log("Added files : Success");
        return res.sendStatus(200);
      });

  }
  
}

app.listen(5002)