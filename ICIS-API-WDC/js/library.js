/*\
|*|
|*|  JXON Snippet #3 - Mozilla Developer Network
|*|
|*|  https://developer.mozilla.org/en-US/docs/JXON
|*|  https://developer.mozilla.org/User:fusionchess
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
\*/

function parseText(sValue) {
    if (/^\s*$/.test(sValue)) { return null; }
    if (/^(?:true|false)$/i.test(sValue)) { return sValue.toLowerCase() === "true"; }
    if (isFinite(sValue)) { return parseFloat(sValue); }
    //if (isFinite(Date.parse(sValue))) { return new Date(sValue); }
    return sValue;
}

function getJXONTree(oXMLParent) {
    var vResult = /* put here the default value for empty nodes! */ true, nLength = 0, sCollectedTxt = "";
    if (oXMLParent.hasAttributes && oXMLParent.hasAttributes()) {
        vResult = {};
        for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
            oAttrib = oXMLParent.attributes.item(nLength);
            vResult["@" + oAttrib.name.toLowerCase()] = parseText(oAttrib.value.trim());
        }
    }
    if (oXMLParent.hasChildNodes()) {
        for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
            oNode = oXMLParent.childNodes.item(nItem);
            if (oNode.nodeType === 4) { sCollectedTxt += oNode.nodeValue; } /* nodeType is "CDATASection" (4) */
            else if (oNode.nodeType === 3) { sCollectedTxt += oNode.nodeValue.trim(); } /* nodeType is "Text" (3) */
            else if (oNode.nodeType === 1 /*&& !oNode.prefix*/) { /* nodeType is "Element" (1) */
                if (nLength === 0) { vResult = {}; }
                sProp = oNode.nodeName.toLowerCase();
                vContent = getJXONTree(oNode);
                if (vResult.hasOwnProperty(sProp)) {
                    if (vResult[sProp].constructor !== Array) { vResult[sProp] = [vResult[sProp]]; }
                    vResult[sProp].push(vContent);
                } else { vResult[sProp] = vContent; nLength++; }
            }
        }
    }
    if (sCollectedTxt) { nLength > 0 ? vResult.keyValue = parseText(sCollectedTxt) : vResult = parseText(sCollectedTxt); }
    /* if (nLength > 0) { Object.freeze(vResult); } */
    return vResult;
}

String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

String.prototype.endsWith = function (suffix) {
    return (this.substr(this.length - suffix.length) === suffix);
}

String.prototype.startsWith = function (prefix) {
    return (this.substr(0, prefix.length) === prefix);
}