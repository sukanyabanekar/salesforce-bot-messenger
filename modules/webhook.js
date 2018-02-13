"use strict";

let nforce = require('nforce');

const express = require("express");
const bodyParser = require("body-parser");
let UserName;


const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);
restService.use(bodyParser.json());
restService.post("/echo", function(req, res) {
console.log('echoechoecho reatched ******');
const events = req.body.entry[0].messaging;     
console.log('events**********',events);

});
  


let request = require('request'),
    salesforce = require('./salesforce'),
    formatter = require('./formatter-messenger');


let sendMessage = (message, recipient) => {
    request({
        url: 'https://graph.facebook.com/v2.6/'+recipient+'/messages',
        qs: {access_token: process.env.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipient},
            message: message
        }
    }, (error, response) => {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};



let getUserDetails = (message, recipient) => {
request({
	url: 'https://graph.facebook.com/v2.6/1579154208820112/?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=EAACsqFPeZBroBALfdQcMoW48JPqZAdCU0M9mSpaDwGxYhOhZACeGKiBYMBx0qgVAankOkSrBcIsFRfXknJQZBegRQKLWVXKLyyw0jZCmnaFjNG2cKD44aBW5gPwyuajW9nFZBD2NUy3foWbR3uxBf49OoDnZCHq337jJuGTQ3GT0AZDZD',
        method: 'GET'
    }, (error, response) => {
	console.log('response************',response);
	console.log('response.body************',response.body);
	console.log('response.body.first_name************',response.body[first_name]);
	console.log('response.body.first_name************,response.body['first_name']);
	let body =response.body;
	let firstName = body['first_name'];
	let last_name = body['last_name'];
	UserName = firstName +' '+ last_name;
	console.log('name************',UserName);
	if (error) {
            console.log('Error sending message: ********', error);
        } else if (response.body.error) {
            console.log('Error: **********', response.body.error);
        }
    });	
};


let processText = (text, sender)  => {
    console.log('sender facebook user id',sender);
    let match;
    let accountId;	
    match = text.match(/help/i);
    if (match) {
    console.log('help match',match);   
        sendMessage({text:
            `You can ask me things like:
    Search account Acme
    Search Acme in accounts
    Search contact Smith
    What are my top 3 opportunities?
        `}, sender);
        return;
    }

    match = text.match(/search account (.*)/i);
    console.log('Account match',match);
    if (match) {
        salesforce.findAccount(match[1]).then(accounts => {
            accountId = accounts[0]._fields.id;		
	    sendMessage({text: `Here are the accounts I found matching "${match[1]}":`}, sender);
            sendMessage(formatter.formatAccounts(accounts), sender)
        });
        return;
    }

    match = text.match(/search (.*) in accounts/i);
    if (match) {
        salesforce.findAccount(match[1]).then(accounts => {
            sendMessage({text: `Here are the accounts I found matching "${match[1]}":`}, sender);
            sendMessage(formatter.formatAccounts(accounts), sender)
        });
        return;
    }

    match = text.match(/search contact (.*)/i);
    if (match) {
        salesforce.findContact(match[1]).then(contacts => {
            sendMessage({text: `Here are the contacts I found matching "${match[1]}":`}, sender);
            sendMessage(formatter.formatContacts(contacts), sender)
        });
        return;
    }

    match = text.match(/top (.*) opportunities/i);
    if (match) {
        console.log('match opportunities************',match);
        salesforce.getTopOpportunities(match[1]).then(opportunities => {
            sendMessage({text: `Here are your top ${match[1]} opportunities:`}, sender);
            sendMessage(formatter.formatOpportunities(opportunities), sender)
        });
        return;
    }
	
	 match = text.match(/viewContact/i);
	 console.log('View Contact matched',match);
   	    if (match) {
		 let accId = text.split(" ");
		 console.log('Account Id',accId);
		 console.log('Account Id',accId[1]);
		 let accountIdFiteen = accId[1].substr(0,accId[1].length - 3);
		 console.log('Account accountIdFiteen',accountIdFiteen); 
		 salesforce.findContactsByAccount(accountIdFiteen).then(contacts => {
			sendMessage({text: `Here are your top coantacts :`}, sender);
			sendMessage(formatter.formatContacts(contacts), sender)
		});
			return;
	}		
};

let handleGet = (req, res) => {
    if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
};



let handlePost = (req, res) => { 
	console.log('User Request From Api.ai*****',req);
	console.log('user Sesstion Id******',req.body.sessionId);
	console.log('user sender id body data***',req.body.originalRequest.data.sender.id);
	var sender = req.body.originalRequest.data.sender.id;
	
	var Name =
			req.body.result &&
			req.body.result.parameters &&
			req.body.result.parameters.echoText
			? req.body.result.parameters.echoText
			: "";
	
	
	var parameters =
			req.body.result &&
			req.body.result.parameters;
			
	console.log('******parameters******',parameters);
	console.log('Name',Name);
	console.log('oauth Token APi.Ai',salesforce.org.oauth);
	
	
	getUserDetails('user',sender);
	console.log('User Name Details******',UserName);
	
	
	
		/* return res.json({
		speech: 'Text',
		displayText: 'Text',
		source: "webhook-echo-sample"
		}); */
	
/*	var acc = nforce.createSObject('Account');
			
			acc.set('Name', Name);
			acc.set('BotUserId__c',req.body.sessionId);
			    salesforce.org.insert({ sobject: acc, oauth: salesforce.org.oauth }, function(err, resp){
				console.log('resp',resp);
					if(!err) console.log('It worked!');
			}); */
	
	
	/* processText('/'+Name,sender);  */
	
	
	/*	let events = req.body.entry[0].messaging;
		for (let i = 0; i < events.length; i++) {
			let event = events[i];
			console.log('Event*****Details',event);
			let sender = event.sender.id;
			if (process.env.MAINTENANCE_MODE && ((event.message && event.message.text) || event.postback)) {
				sendMessage({text: `Sorry I'm taking a break right now.`}, sender);
			} else if (event.message && event.message.text) {


			var acc = nforce.createSObject('Account');
			acc.set('BotUserId__c',event.sender.id);
			acc.set('Name', 'BotUserAccount');
		    org.insert({ sobject: acc, oauth: oauth }, function(err, resp){
				console.log('resp',resp);
					if(!err) console.log('It worked!');
			});
			console.log('Account**** object created',acc);
				console.log('Inside processText',event.message.text);
				
			  salesforce.createBotUserAccount(acc);  
				processText(event.message.text, sender);
			} else if (event.postback) {
				let payload = event.postback.payload.split(",");
				if (payload[0] === "view_contacts") {
					sendMessage({text: "OK, looking for your contacts at " + payload[2] + "..."}, sender);
					salesforce.findContactsByAccount(payload[1]).then(contacts => sendMessage(formatter.formatContacts(contacts), sender));
				} else if (payload[0] === "close_won") {
					sendMessage({text: `OK, I closed the opportunity "${payload[2]}" as "Close Won". Way to go Christophe!`}, sender);
				} else if (payload[0] === "close_lost") {
					sendMessage({text: `I'm sorry to hear that. I closed the opportunity "${payload[2]}" as "Close Lost".`}, sender);
				}
			}
		} */
		res.sendStatus(200);
	}; 


exports.handleGet = handleGet;
exports.handlePost = handlePost;
