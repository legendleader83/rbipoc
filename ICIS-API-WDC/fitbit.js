var myConnector = tableau.makeConnector();

myConnector.init = function () {
    $('.section-description').html("In just a few clicks, you'll be able to get your ICIS data. When you're ready, hit the button below and you'll be asked to give Tableau access to your ICIS data. Once complete, an extract of your data will be created and you can start vizzing!</br><a class='button button-primary button-margin' id='letsgo'>Let's go!</a>");
    $('#letsgo').bind('click', function () {
        $('.ajax-loading').show();
        window.location.href = "...";
    });
    tableau.initCallback();
}

myConnector.setConnection = function (access_token, refresh_token, user_id) {
    var connData = [access_token, refresh_token, user_id];
    tableau.connectionData = JSON.stringify(connData);
    tableau.connectionName = 'Fitbit Activity'; // name the data source. This will be the data source name in Tableau
};

myConnector.getColumnHeaders = function () {
    var fieldNames = ["ActivityDate", "Steps", "Distance", "Calories", "minutesSedentary", "minutesLightlyActive", "minutesFairlyActive", "minutesVeryActive", "BMI", "Fat", "Weight"];
    var fieldTypes = ["date", "int", "float", "int", "int", "int", "int", "int", "float", "float", "float"];
    tableau.headersCallback(fieldNames, fieldTypes); // tell tableau about the fields and their types
};

myConnector.getTableData = function () {

    var stepsArray = [];
    var distanceArray = [];
    var floorsArray = [];
    var caloriesArray = [];
    var elevationArray = [];
    var minutesSedentaryArray = [];
    var minutesLightlyActiveArray = [];
    var minutesFairlyActiveArray = [];
    var minutesVeryActiveArray = [];
    var bmiArray = [];
    var fatArray = [];
    var weightArray = [];

    var connectionAuth = JSON.parse(tableau.connectionData);
    var access_token = connectionAuth[0];
    var user_id = connectionAuth[2];

    var MyRequestsCompleted = (function () {
        var numRequestToComplete, requestsCompleted, callBacks, singleCallBack;

        return function (options) {
            if (!options) options = {};

            numRequestToComplete = options.numRequest || 0;
            requestsCompleted = options.requestsCompleted || 0;
            callBacks = [];
            var fireCallbacks = function () {
                //alert("we're all complete");
                for (var i = 0; i < callBacks.length; i++) callBacks[i]();
            };
            if (options.singleCallback) callBacks.push(options.singleCallback);

            this.addCallbackToQueue = function (isComplete, callback) {
                if (isComplete) requestsCompleted++;
                if (callback) callBacks.push(callback);
                if (requestsCompleted == numRequestToComplete) fireCallbacks();
            };
            this.requestComplete = function (isComplete) {
                if (isComplete) requestsCompleted++;
                if (requestsCompleted == numRequestToComplete) fireCallbacks();
            };
            this.setCallback = function (callback) {
                callBacks.push(callBack);
            };
        };
    })();
    var baseURL = 'https://api.icis.com/v1';
    var steps_request_data = {
        url: baseURL + '?access_token=' + access_token + '&req=activities&type=steps&userid=' + user_id,
        method: 'GET'
    };
    var distance_request_data = {
        url: baseURL + '?access_token=' + access_token + '&req=activities&type=distance&userid=' + user_id,
        method: 'GET'
    };
    var floors_request_data = {
        url: baseURL + '?access_token=' + access_token + '&req=activities&type=floors&userid=' + user_id,
        method: 'GET'
    };
    var calories_request_data = {
        url: baseURL + '?access_token=' + access_token + '&req=activities&type=calories&userid=' + user_id,
        method: 'GET'
    };
    var elevation_request_data = {
        url: baseURL + '?access_token=' + access_token + '&req=activities&type=elevation&userid=' + user_id,
        method: 'GET'
    };
    var minutesSedentary_request_data = {
        url: baseURL + '?access_token=' + access_token + '&req=activities&type=minutesSedentary&userid=' + user_id,
        method: 'GET'
    };
    var minutesLightlyActive_request_data = {
        url: baseURL + '?access_token=' + access_token + '&req=activities&type=minutesLightlyActive&userid=' + user_id,
        method: 'GET'
    };
    var minutesFairlyActive_request_data = {
        url: baseURL + '?access_token=' + access_token + '&req=activities&type=minutesFairlyActive&userid=' + user_id,
        method: 'GET'
    };
    var minutesVeryActive_request_data = {
        url: baseURL + '?access_token=' + access_token + '&req=activities&type=minutesVeryActive&userid=' + user_id,
        method: 'GET'
    };
    var bmi_request_data = {
        url: baseURL + '?access_token=' + access_token + '&req=body&type=bmi&userid=' + user_id,
        method: 'GET'
    };
    var fat_request_data = {
        url: baseURL + '?access_token=' + access_token + '&req=body&type=fat&userid=' + user_id,
        method: 'GET'
    };
    var weight_request_data = {
        url: baseURL + '?access_token=' + access_token + '&req=body&type=weight&userid=' + user_id,
        method: 'GET'
    };



    var requestCallback = new MyRequestsCompleted({
        numRequest: 10,
        singleCallback: function () {
            var toRet = [];
            for (var i = 0; i < stepsArray.length; i++) {
                var entry = {};
                entry.ActivityDate = stepsArray[i].ActivityDate;
                entry.Steps = stepsArray[i].Steps;
                entry.Distance = distanceArray[i].Distance;
                entry.minutesSedentary = minutesSedentaryArray[i].minutesSedentary;
                entry.minutesLightlyActive = minutesLightlyActiveArray[i].minutesLightlyActive;
                entry.minutesFairlyActive = minutesFairlyActiveArray[i].minutesFairlyActive;
                entry.minutesVeryActive = minutesVeryActiveArray[i].minutesVeryActive;
                entry.BMI = bmiArray[i].bmi;
                entry.Fat = fatArray[i].fat;
                entry.Weight = weightArray[i].weight;
                toRet.push(entry);
            }
            tableau.dataCallback(toRet, toRet.length.toString(), false);
        }
    });

    $.ajax({
        url: steps_request_data.url,
        type: steps_request_data.method,
        dataType: 'json',
        success: function (data) {
            var activitiesSteps = data["activities-steps"];
            for (var i = 0; i < activitiesSteps.length; i++) {
                var entry = {};
                entry.ActivityDate = activitiesSteps[i].dateTime;
                entry.Steps = activitiesSteps[i].value;
                stepsArray.push(entry);
            }
            requestCallback.requestComplete(true);
        }
    });
    $.ajax({
        url: distance_request_data.url,
        type: distance_request_data.method,
        dataType: 'json',
        success: function (data) {
            var activitiesDistance = data["activities-distance"];
            for (var i = 0; i < activitiesDistance.length; i++) {
                var entry = {};
                entry.ActivityDate = activitiesDistance[i].dateTime;
                entry.Distance = activitiesDistance[i].value;
                distanceArray.push(entry);
            }
            requestCallback.requestComplete(true);
        }
    });
    $.ajax({
        url: calories_request_data.url,
        type: calories_request_data.method,
        dataType: 'json',
        success: function (data) {
            var activitiesCalories = data["activities-calories"];
            for (var i = 0; i < activitiesCalories.length; i++) {
                var entry = {};
                entry.ActivityDate = activitiesCalories[i].dateTime;
                entry.Calories = activitiesCalories[i].value;
                caloriesArray.push(entry);
            }
            requestCallback.requestComplete(true);
        }
    });
    $.ajax({
        url: minutesSedentary_request_data.url,
        type: minutesSedentary_request_data.method,
        dataType: 'json',
        success: function (data) {
            var activitiesMinutesSedentary = data["activities-minutesSedentary"];
            for (var i = 0; i < activitiesMinutesSedentary.length; i++) {
                var entry = {};
                entry.ActivityDate = activitiesMinutesSedentary[i].dateTime;
                entry.minutesSedentary = activitiesMinutesSedentary[i].value;
                minutesSedentaryArray.push(entry);
            }
            requestCallback.requestComplete(true);
        }
    });
    $.ajax({
        url: minutesLightlyActive_request_data.url,
        type: minutesLightlyActive_request_data.method,
        dataType: 'json',
        success: function (data) {
            var activitiesMinutesLightlyActive = data["activities-minutesLightlyActive"];
            for (var i = 0; i < activitiesMinutesLightlyActive.length; i++) {
                var entry = {};
                entry.ActivityDate = activitiesMinutesLightlyActive[i].dateTime;
                entry.minutesLightlyActive = activitiesMinutesLightlyActive[i].value;
                minutesLightlyActiveArray.push(entry);
            }
            requestCallback.requestComplete(true);
        }
    });
    $.ajax({
        url: minutesFairlyActive_request_data.url,
        type: minutesFairlyActive_request_data.method,
        dataType: 'json',
        success: function (data) {
            var activitiesMinutesFairlyActive = data["activities-minutesFairlyActive"];
            for (var i = 0; i < activitiesMinutesFairlyActive.length; i++) {
                var entry = {};
                entry.ActivityDate = activitiesMinutesFairlyActive[i].dateTime;
                entry.minutesFairlyActive = activitiesMinutesFairlyActive[i].value;
                minutesFairlyActiveArray.push(entry);
            }
            requestCallback.requestComplete(true);
        }
    });
    $.ajax({
        url: minutesVeryActive_request_data.url,
        type: minutesVeryActive_request_data.method,
        dataType: 'json',
        success: function (data) {
            var activitiesMinutesVeryActive = data["activities-minutesVeryActive"];
            for (var i = 0; i < activitiesMinutesVeryActive.length; i++) {
                var entry = {};
                entry.ActivityDate = activitiesMinutesVeryActive[i].dateTime;
                entry.minutesVeryActive = activitiesMinutesVeryActive[i].value;
                minutesVeryActiveArray.push(entry);
            }
            requestCallback.requestComplete(true);
        }
    });
    $.ajax({
        url: bmi_request_data.url,
        type: bmi_request_data.method,
        dataType: 'json',
        success: function (data) {
            var bodyBmi = data["body-bmi"];
            for (var i = 0; i < bodyBmi.length; i++) {
                var entry = {};
                entry.ActivityDate = bodyBmi[i].dateTime;
                entry.bmi = bodyBmi[i].value;
                bmiArray.push(entry);
            }
            requestCallback.requestComplete(true);
        }
    });
    $.ajax({
        url: fat_request_data.url,
        type: fat_request_data.method,
        dataType: 'json',
        success: function (data) {
            var bodyFat = data["body-fat"];
            for (var i = 0; i < bodyFat.length; i++) {
                var entry = {};
                entry.ActivityDate = bodyFat[i].dateTime;
                entry.fat = bodyFat[i].value;
                fatArray.push(entry);
            }
            requestCallback.requestComplete(true);
        }
    });
    $.ajax({
        url: weight_request_data.url,
        type: weight_request_data.method,
        dataType: 'json',
        success: function (data) {
            var bodyWeight = data["body-weight"];
            for (var i = 0; i < bodyWeight.length; i++) {
                var entry = {};
                entry.ActivityDate = bodyWeight[i].dateTime;
                entry.weight = bodyWeight[i].value;
                weightArray.push(entry);
            }
            requestCallback.requestComplete(true);
        }
    });

};

tableau.registerConnector(myConnector);

function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

$(document).ready(function () {
    $('.button').hide();
    var curURL = window.location.href;
    curURL = curURL.replace("#", "?");
    var query = getQueryParams(curURL);
    if (tableau.connectionData) {
        tableau.submit();
    } else if (!query["access_token"]) {

    } else {
        myConnector.setConnection(query["access_token"], "", query["user_id"]);
        tableau.submit();
    }
});