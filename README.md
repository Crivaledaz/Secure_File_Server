Secure File Server
==================

This project implements a nodeJS File Server with client side encryption : Key and Plaintext are never sent to the server.

## Overview

You want to share a file with your friends, but it is oversized to send it by email, and you would like to avoid using a proprietary and close file server. You want to be sure your data are in good hand and will not be hacked.

This project provides a light and secure file server to deploy where you want, even on an untrustable server. In fact, data encryption handles on client side (in javascript) and the plaintext data or the encryption key will never be sent to the server. So an attacker won't be able to retrieve your data on the server side or with traffic interception. 

## Module Description

This module provides a nodeJS web server based on Express to upload and download file securely. This project is very light and want to be very easy to deploy and use. You can also easily adapt the project for your own use.

## Setup 
### Requirements
This module requires the following : 

* NodeJS
* npm

The following NPM modules are also required :

* Express (> 4.16.2)
* express-fileupload (> 0.4.0)
* express-force-ssl (> 0.3.2)
* express-recaptcha (> 3.0.1)

### Pre-install

Install required packages :

* For Centos 7, RHEL 7 and Fedora :
```
#Install nodejs and npm which are in EPEL (git and openssl are optional)
sudo yum -y --nogpgcheck install npm nodejs git openssl
```
* For Debian, ubuntu, Mint :
```
#Install nodejs and npm which are in offical repo (git and openssl are optional)
sudo apt-get -y install nodejs npm git openssl
```

Your system is ready to install and run Secure File Server.


## Install
Clone (or download and extract) this repository in the directory of your choice (assume that is /opt) :
```
cd /opt
git clone https://github.com/crivaledaz/Secure_File_Server.git
cd /opt/Secure_File_Server/
```

There is a package.json in the repository, you just need to run npm with and it will install Secure_File_Server and required dependencies
```
npm install package.json
```

Beside you can install dependencies by hand (could be skipped using npm and the project package.json)
```
#You should install the latest version for each module
npm install express@latest
npm install express-file-upload@latest
npm install express-force-ssl@latest
npm install express-recaptcha@latest
```

You need to create a folder to store uploaded files. By default, this folder is on the server root directory and is named "files", but you can change that in the config.json. To create the folder use :
```
mkdir /opt/Secure_File_Server/files/
```

Secure_File_Server is now installed and just need some configuration.


## Configuration

The server configuration is gathered in the config.json file. You can change the listening port, and you need to add recaptcha keys. You can also modify the path of your HTTPS certificate. 

* Recaptcha config
Get recaptcha keys from Google on : https://www.google.com/recaptcha/admin, and copy paste them in the config file. Be careful the public key and the private key should not be inverted and the private key had to stay secret.

You need to put your public recaptcha key in the upload.html file by modifying the following line :
```
<div class="g-recaptcha" data-sitekey="XXXXXXXXXXXXXXXXXXXXXXXXX"></div>
```

* SSL certificate
HTTPS protocol needs certificates to work. So you need to generate a pair of certificate. With Openssl you can use the following command :

```
# Generate the private key
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 
```

This command creates an RSA 2048 key and the associate certificate. Put these files in the folder you have chosen in the config.js https section. Our certificates are untrusted by common browser because no certification authority have signed it. That's the reason why a warning appears on your browser and you must add an exception for your certificate. You can also use Let's encrypt to sign your certificate and prevent browser warning.

* Port

By default, the Secure File Server listens on port 80, but you can change this and choose another not used port. 

## Usage
You only need to run the index.js with nodeJS :
```
node index.js
```

The prompt should print : "Secure File Server listenning on port 80". Well, your server is runnng, try to upload some files to check. To do that, go in your browser and type : http://YOUR_HOSTNAME/

## Limitation
This module has been tested on Centos 7, Kali and Ubuntu.

Others operating systems has not been tested yet but should work fine.

## To do list

Error and exception management

## Thanks

I wish to thank my friend Nami for the light and beautiful CSS she has added.


## Known issues

