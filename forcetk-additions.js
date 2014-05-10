/**
 * forcetk-additions.js
 * depends on forcetk.js - https://github.com/developerforce/Force.com-JavaScript-REST-Toolkit/forcetk.js
 */

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
