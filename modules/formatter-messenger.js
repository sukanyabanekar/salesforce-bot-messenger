"use strict";

let formatAccounts = accounts => {
    console.log('formatAccount',accounts);
    let elements = [];
    accounts.forEach(account =>
        elements.push({
            title: account.get("Name"),
            subtitle: account.get("BillingStreet") + ", " + account.get("BillingCity") + " " + account.get("BillingState") + " · " + account.get("Phone"),
            "image_url": account.get("Picture_URL__c"),
            "buttons": [{
                "type":"postback",
                "title":"View Contacts",
                "payload": "/viewContact," + account.getId()
            },{
                "type": "web_url",
                "url": "https://login.salesforce.com/" + account.getId(),
                "title": "Open in Salesforce"
            },
]
        })
    );
    console.log('elements*********',elements);
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};

let formatContacts = contacts => {
    console.log('Contact to format',contacts);
    let elements = [];
    contacts.forEach(contact => {
        elements.push({
            title: contact.get("Name"),
            subtitle: contact.get("Title") + " with " + contact.get("MobilePhone"),
            "image_url": contact.get("Picture_URL__c"),
            "buttons": [
                {
                    "type": "postback",
                    "title": "View Notes",
                    "payload": "view_notes," + contact.getId() + "," + contact.get("Name")
                },
                {
                    "type": "web_url",
                    "url": "https://login.salesforce.com/" + contact.getId(),
                    "title": "Open in Salesforce"
                }]
        })
    });
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};

let formatOpportunities = opportunities => {
    let elements = [];
    opportunities.forEach(opportunity =>
        elements.push({
            title: opportunity.get("Name"),
            subtitle: opportunity.get("StageName").Name + " · $" + opportunity.get("Amount"),
            "image_url": "https://s3-us-west-1.amazonaws.com/sfdc-demo/messenger/opportunity500x260.png",
            "buttons": [
                {
                    "type":"postback",
                    "title":"Close Won",
                    "payload": "close_won," + opportunity.getId() + "," + opportunity.get("Name")
                },
                {
                    "type":"postback",
                    "title":"Close Lost",
                    "payload": "close_lost," + opportunity.getId() + "," + opportunity.get("Name")
                },
                {
                    "type": "web_url",
                    "url": "https://login.salesforce.com/" + opportunity.getId(),
                    "title": "Open in Salesforce"
                }]
        })
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};

function getAccountRelatedContacts(accounts,accountId){
    console.log('accountId*********parameter',accountId);
    let elements = [];
    accounts.forEach(account =>
        elements.push({
            title: account.get("Name"),
            subtitle: account.get("BillingStreet") + ", " + account.get("BillingCity") + " " + account.get("BillingState") + " · " + account.get("Phone"),
            "image_url": account.get("Picture_URL__c"),
            "buttons": [{
                "type":"postback",
                "title":"View Contacts",
                "payload": "/viewContact," + account.getId()
            },{
                "type": "web_url",
                "url": "https://login.salesforce.com/" + account.getId(),
                "title": "Open in Salesforce"
            },
]
        })
    );
    console.log('elements*********',elements);
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};

exports.formatAccounts = formatAccounts;
exports.formatContacts = formatContacts;
exports.formatOpportunities = formatOpportunities;
exports.getAccountRelatedContacts = getAccountRelatedContacts;
