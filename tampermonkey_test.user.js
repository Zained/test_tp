// ==UserScript==
// @name         Pokiba
// @version      1.2
// @updateURL    https://raw.githubusercontent.com/Zained/Github-userscripts/master/tampermonkey_test.user.js
// @downloadURL  https://raw.githubusercontent.com/Zained/Github-userscripts/master/tampermonkey_test.user.js
// @include      http://cohiba.aramisauto.com*
// @include      https://cohiba.aramisauto.com*
// @include      http://cohiba.aramisauto.com/s/vo/vehicle*
// @include      http://cohiba.aramisauto.com/page-vehicule*
// @include      http://cohiba.aramisauto.com/vehicule-equipment*
// @include      http://cohiba.aramisauto.com/vehicule-options*
// @include      http://cohiba.aramisauto.com/picto-options-equipement*
// @author       Zained
// @grant       GM_getValue
// @grant       GM_setValue
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.js
// ==/UserScript==

const scriptname = 'POKIBA';
const version = 'AAA';
const utc = new Date().toJSON().replace(/\"/g, "").slice(0, 10);
console.log(utc);

if (GM_getValue('POKIBA_last_check_update') != utc) {
    console.log("checking...");
    GM_setValue('POKIBA_last_check_update', utc);

    fetch("https://script.google.com/macros/s/AKfycbzGPIjLDnNGE2lyaT6V0aIN_ur2qkDkV_GMym_IZsmtSzTVOMTDO9QWrFxSlYsR43_l8g/exec", {
        method: 'GET',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        }
    }).then(response => {
        if (response.ok) {
            response.text().then(html => {
                var text = JSON.parse(html);
                if (text[scriptname].version == version) {
                    console.log("system is up to date");
                }
                else {
                    if (confirm("POKIBA need an UPDATE!\nVisit WebAppStore?")) {
                        window.open("https://script.google.com/a/macros/aramisauto.com/s/AKfycby62lwYShfB1gTFszmHIsBaeLRaMvHKrI53YbI1OoDpqqKKDpp4-hL18Ibu4KGmkn5VQw/exec",'_blank');
                    }
                }
            });
        }
    });
}

$(document).ready(function(){
    console.log('loading complete');
    $('#bt_save').on('click', doCheck);
    $("[name='Equipement']").on('click', doCheckClean);
});

document.addEventListener('keydown', function(event) {
    console.log(event.keyCode);

    if (event.keyCode == 222) {
        if (window.location.href.indexOf("vehicule-equipment") > 0) {
            console.log(GM_getValue('index_alert'));
            if (GM_getValue('index_alert') == 2) {
                alert(GM_getValue('last_alert'));
            }
        }
    }
});

function doCheck() {
    console.log('download base...');
    fetch("https://script.google.com/a/macros/yuso-aa.com/s/AKfycby_UDterx2R0Hnak1Ca1n44SMAKa-ZZBSoPgj-MlsPqnkZV21NBMO8HmBszYOs9CRR-Dg/exec", {
        method: 'GET',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        }
    }).then(response => {
        if (response.ok) {
            response.text().then(html => {
                doSearchMatch(html);
                //console.log(html);
            });
        }
    });
}

function doSearchMatch(text) {
    console.log('compare base + offer');
    var code_ape = $('#ref_aramis').val().substr(0, 6);
    var line = text.split('\n');
    for (var x = 0; x < line.length; x++) {
        var egal = line[x].split('=');
        if (code_ape == egal[0]) {
            console.log('match found !--');
            GM_setValue('index_alert', 1);
            GM_setValue('last_alert', egal[1]);
            alert(egal[1]);
            return;
        }
    }
    console.log('no match--');
}

function doCheckClean() {
    if (GM_getValue('index_alert') == 1) {
        GM_setValue('index_alert', 2);
        console.log('last alert');
        return;
    }
    else if (GM_getValue('index_alert') == 2) {
        GM_setValue('index_alert', 0);
        GM_setValue('last_alert', '');
        console.log('alert is cleaned');
        return;
    }
}
