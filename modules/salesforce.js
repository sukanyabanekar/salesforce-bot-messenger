"use strict";

let nforce = require('nforce'),

    SF_CLIENT_ID = process.env.SF_CLIENT_ID,
    SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
    SF_USER_NAME = process.env.SF_USER_NAME,
    SF_PASSWORD = process.env.SF_PASSWORD;

let org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/oauth/_callback',
    mode: 'single',
    autoRefresh: true
});

let login = () => {
    console.log('login called');
    org.authenticate({username: SF_USER_NAME, password: SF_PASSWORD}, err => {
        if (err) {
            console.error("Authentication error");
            console.error(err);
        } else {
            console.log("Authentication successful");
        }
    });
};

let findAccount = name => {
    console.log('findAccount');
    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, BillingStreet, BillingCity, BillingState, Phone FROM Account WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('findAccountError',err);
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let accounts = resp.records;
                console.log(accounts);
                resolve(accounts);
            }
        });
    });

};

let findContact = name => {

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Title,Phone, MobilePhone, Email FROM Contact WHERE Name ='"+name+"'";
	console.log('Contacts query',q);    
        org.query({query: q}, (err, resp) => {
            if (err) {
		console.log('findAccountError',err);
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let contacts = resp.records;
		console.log(contacts);   
                resolve(contacts);
            }
        });
    });

};

let findContactsByAccount = accountId => {
    console.log('accountId Details',accountId);
    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Title,Phone, MobilePhone,AccountId,Email FROM Contact WHERE AccountId='" + accountId + "' LIMIT 5";
        console.log('Query Details',q);
	    org.query({query: q}, (err, resp) => {
            if (err) {
		console.log('Error ',err);
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
		
                let contacts = resp.records;
		console.log('contacts*******',contacts);
                resolve(contacts);
            }
        });
    });

};


let createBotUserAccount = (acc) => {
      console.log("acc " + acc);
	  return new Promise((resolve, reject) => {
	  org.insert({ sobject: acc }, function(err, resp){
					if (err) {
		console.log('err',err);
							reject("An error as occurred while creating record");
					} else if (resp.records && resp.records.length>0) {
						let Account = resp.records;
		console.log('Account created',Account);
			resolve(Account);
					}
			   });
	});
};



let getTopOpportunities = count => {

    count = count || 5;

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Amount, Probability, StageName, CloseDate, Account.Name FROM Opportunity WHERE isClosed=false ORDER BY amount DESC LIMIT " + count;
        console.log('OpportunitiesQureis*******',q); 	    
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.error(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};


function getAccountRelatedContacts(accountId) {
	let contacts;
	let accountIdFiteen = accountId.substr(0,accountId.length - 3);
	console.log('*******accountId*******');
	
        let q ="SELECT Id, Name, Title,Phone, MobilePhone,AccountId,Email FROM Contact WHERE AccountId='"+accountIdFiteen+"'";
        console.log('Contacts query',q);    
        org.query({query: q}, (err, resp) => {
            if (err) {
		console.log('findAccountError',err);
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let contacts = resp.records;
	        console.log('contact records **********',contacts);   
                
            }
	});
	return contacts;
   
}



login();
console.log('login');
exports.org = org;
console.log('findAccount');
exports.findAccount = findAccount;
exports.findContact = findContact;
exports.findContactsByAccount = findContactsByAccount;
exports.getTopOpportunities = getTopOpportunities;
exports.createBotUserAccount = createBotUserAccount;
exports.getAccountRelatedContacts = getAccountRelatedContacts;
