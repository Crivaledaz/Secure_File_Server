/***
 * NodeJS server index
 *
 * @author Denis CLAVIER <clavierd at gmail dot com>
**/

//Include modules
const express = require('express');
const fs = require('fs');
const https = require('https');
const forceSSL = require('express-force-ssl');
const fileUpload = require('express-fileupload');
const Recaptcha = require('express-recaptcha').RecaptchaV2;

//Include configuration file
var config = require('./config.json');

//Create an Express app
const app = express()
app.use(fileUpload())

//HTTPS Configuration
https.createServer({
    key: fs.readFileSync(config.httpsKey),
    cert: fs.readFileSync(config.httpsCert)
}, app).listen(config.portHTTPS);

// Force SSL serttings
app.set('forceSSLOptions', {
  enable301Redirects: true,
  trustXFPHeader: false,
  httpsPort: config.portHTTPS,
  sslRequiredMessage: 'SSL Required.'
});

//ReCaptchaV2 configuration
var recaptcha = new Recaptcha(config.recaptchaPublic, config.recaptchaPrivate);

//Dafault page loaded
app.get('/', forceSSL, function (req, res) {
    res.sendFile(__dirname+'/upload.html')
})

//SJCL library
app.get('/sjcl.js', function (req, res) {
    res.sendFile(__dirname+'/sjcl.js')
})

//Upload page (GET)
app.get('/upload.html', forceSSL, function (req, res) {
    res.sendFile(__dirname+'/upload.html')
})

//Upload request (POST) to save the encrypted file
app.post('/upload.html', function(req, res) {
    //Check if the request contain a file to save, if not raise a server error
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
        //Recaptcha verification to avoid robot or forged request
        recaptcha.verify(req, function(error,data){
        if(!error) {
            //Retrieve the uploaded file
            let uploadedFile = req.files.cryptFile;
            //Generate a file id with a nonce to avoid collision
            const fileName = Date.now() + Math.trunc(Math.random()*100);
            // Use the mv() method to place the file in the file directory
            uploadedFile.mv(config.storageFolder + fileName, function(err) {
                //If error occur during save process, raise a server error
                if (err){
                    return res.status(500).send(err);
                }
                //return the file id
                  res.send(fileName.toString());
            });
        }
        //If captcha verification failed
        else
        {
            console.log("Captcha failure :" + error);
        }
    })
});

//Download page (Generate)
app.get('/download.html', function (req, res) {
    res.sendFile(__dirname+'/download.html')
})

//Check file id format and return the requested file
app.get('/:id([0-9]{13}$)$', function (req, res) {
    res.sendFile(__dirname+'/' + config.storageFolder + req.params.id)
})

//Start the server on the port 80
app.listen(config.portHTTP, function () {
    console.log('Secure File Server is listening on port ' + config.portHTTP + ' and ' + config.portHTTPS + ' !')
})
