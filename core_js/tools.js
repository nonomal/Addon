/*
* ClearURLs
* Copyright (c) 2017-2019 Kevin Röbert
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*jshint esversion: 6 */
/*
* This script is responsible for some tools.
*/

/*
* To support Waterfox.
*/
Array.prototype.rmEmpty = function() {
    return this.filter(v => v);
};

/*
* To support Waterfox.
*/
Array.prototype.flatten = function() {
    return this.reduce((a, b) => a.concat(b), []);
};

/**
* Check if an object is empty.
* @param  {Object}  obj
* @return {Boolean}
*/
function isEmpty(obj)
{
    return (Object.getOwnPropertyNames(obj).length === 0);
}

/**
* Translate a string with the i18n API.
*
* @param {string} string Name of the attribute used for localization
*/
function translate(string)
{
    return browser.i18n.getMessage(string);
}

/**
* Reloads the extension.
*/
function reload()
{
    browser.runtime.reload();
}

/**
* Check if it is an android device.
* @return bool
*/
function checkOSAndroid()
{
    if(os === undefined || os === null || os === "") {
        chrome.runtime.getPlatformInfo(function(info) {
            os = info.os;
        });
    }

    if(os == "android")
    {
        return true;
    }
    else{
        return false;
    }
}

/**
* Return the number of parameters query strings.
* @param  {String}     url URL as String
* @return {int}        Number of Parameters
*/
function countFields(url)
{
    return extractFileds(url).length;
}

/**
* Returns true if fields exists.
* @param  {String}     url URL as String
* @return {boolean}
*/
function existsFields(url)
{
    var matches = (url.match(/\?.+/i) || []);
    var count = matches.length;

    return (count > 0);
}

/**
* Extract the fields from an url.
* @param  {String} url URL as String
* @return {Array}     Fields as array
*/
function extractFileds(url)
{
    if(existsFields(url)) {
        var fields = url.replace(new RegExp(".*?\\?", "i"), "");
        if(existsFragments(url)) {
            fields = fields.replace(new RegExp("#.*", "i"), "");
        }

        return (fields.match(/[^\/|\?|&]+=?[^&]*/gi) || []);
    }

    return [];
}

/**
* Return the number of fragments query strings.
* @param  {String}     url URL as String
* @return {int}        Number of fragments
*/
function countFragments(url)
{
    return extractFragments(url).length;
}

/**
* Extract the fragments from an url.
* @param  {String} url URL as String
* @return {Array}     fragments as array
*/
function extractFragments(url)
{
    if(existsFragments(url)) {
        var fragments = url.replace(new RegExp(".*?#", "i"), "");
        return (fragments.match(/[^&]+=?[^&]*/gi) || []);
    }

    return [];
}

/**
* Returns true if fragments exists.
* @param  {String}     url URL as String
* @return {boolean}
*/
function existsFragments(url)
{
    var matches = (url.match(/\#.+/i) || []);
    var count = matches.length;

    return (count > 0);
}

/**
* Load local saved data, if the browser is offline or
* some other network trouble.
*/
function loadOldDataFromStore()
{
    localDataHash = storage.dataHash;
}

/**
* Save the hash status to the local storage.
* The status can have the following values:
*  1 "up to date"
*  2 "updated"
*  3 "update available"
*  @param status_code the number for the status
*/
function storeHashStatus(status_code)
{
    switch(status_code)
    {
        case 1: status_code = "hash_status_code_1";
        break;
        case 2: status_code = "hash_status_code_2";
        break;
        case 3: status_code = "hash_status_code_3";
        break;
        default: status_code = "hash_status_code_4";
    }

    storage.hashStatus = status_code;
}

/**
* Increase by {number} the GlobalURLCounter
* @param  {int} number
*/
function increaseGlobalURLCounter(number)
{
    if(storage.statisticsStatus)
    {
        storage.globalurlcounter += number;
    }
}

/**
* Increase by one the URLCounter
*/
function increaseURLCounter()
{
    if(storage.statisticsStatus)
    {
        storage.globalCounter++;
    }
}

/**
* Change the icon.
*/
function changeIcon()
{
    if(!checkOSAndroid()) {
        if(storage.globalStatus){
            browser.browserAction.setIcon({path: "img/clearurls_128x128.png"});
        } else{
            browser.browserAction.setIcon({path: "img/clearurls_gray_128x128.png"});
        }
    }
}

/**
* Get the badged status from the browser storage and put the value
* into a local variable.
*
*/
function setBadgedStatus()
{
    if(!checkOSAndroid() && storage.badgedStatus){
        browser.browserAction.setBadgeBackgroundColor({
            'color': '#'+storage.badged_color
        });
    }
}

/**
* Returns the current URL.
* @return {String} [description]
*/
function getCurrentURL()
{
    return currentURL;
}

/**
* Check for browser.
*/
function getBrowser() {
    if(typeof InstallTrigger !== 'undefined') {
        return "Firefox";
    } else {
        return "Chrome";
    }
}
