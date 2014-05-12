/**
 * forcetk-additions.js
 * depends on forcetk.js - https://github.com/developerforce/Force.com-JavaScript-REST-Toolkit/forcetk.js
 */

// fetches the current user's userid
// leverages the resources to get the users identify URI and
// parse the userid from it
// e.g. identity URI: https://test.salesforce.com/id/00DZ000000N9pRiMAJ/005Z0000001Z905IAC
// orgId: 00DZ000000N9pRiMAJ
// userid: 005Z0000001Z905IAC
forcetk.Client.prototype.userid = function(callback, error) {
    return this.resources(function(result) {
        var identityURI = result['identity'];
        var userid = identityURI.substring(identityURI.lastIndexOf('/') + 1);
        callback(userid);     
    }, error);
}

// fetches all results even if >2000 records returned from query
forcetk.Client.prototype.queryAll = function(soql, callback, error) {
    var that = this;

    // first level call if previous result not on callback
    if (!callback.result) {

        return that.query(soql, function(result) {
            if (result.done) {
                callback(result);
            } else {
                callback.result = result;
                that.queryAll(soql, callback, error);
            }
        }, error);

        
    } else {

        return that.queryMore(callback.result.nextRecordsUrl, function(result) {
            callback.result.records = callback.result.records.concat(result.records);
            if (result.done) {
                callback(callback.result);
            } else {
                callback.result.nextRecordsUrl = result.nextRecordsUrl;
                that.queryAll(soql, callback, error);
            }
            
        }, error );
        
    }         
}
