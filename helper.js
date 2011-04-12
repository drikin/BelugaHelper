(function() {
    // Settings
    var settings = {};

    function initSettings() {
        chrome.extension.sendRequest({action: "initSettings"}, function(value) {
            settings = value;
        });
        chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
            if(request["action"] === "updateSetting") {
                settings[request["key"]] = request["value"];
            }
            sendResponse();
        });
    }

    initSettings();

    // Event handlers
    function focus() {
        resetCount();
    }

    function click() {
        last_update_id++;
    }

    function keydown(event) {
        if (event.keyIdentifier === "Enter") {
            var withModifierKey = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
            var useShiftEnterToPost = settings["useShiftEnterToPost"];
            if (useShiftEnterToPost && withModifierKey || !useShiftEnterToPost && !withModifierKey) {
                var cf = document.getElementById("composeform");
                cf.submit();
                last_update_id++;
                // make sure for clearing
                setTimeout(function() {
                    document.getElementById("composetext").value = "";
                }, 0);
            }
        }
    }

    function update(event) {
        var id = getLastUpdateId();
        if (id > last_update_id) {
            last_update_id = id;

            // update window title
            unread_count++;
            document.title = "(" + unread_count + ") " + base_title;

            // show notification
            var lu = getLastUpdateElement();
            if (is_mobile()) {
                var img_url = lu.getElementsByClassName("user-tile upic")[0].childNodes[1].src;
                var name = lu.getElementsByClassName("text")[0].childNodes[2].textContent;
                var status = lu.getElementsByClassName("utext")[0].textContent;
            } else {
                var img_url = lu.getElementsByClassName("userimg")[0].src;
                var name = lu.getElementsByClassName("uname")[0].textContent;
                var status = lu.getElementsByClassName("ustatus")[0].textContent;
            }
            showNotification({"image_url": img_url, "name": name, "status": status});
            openUrlFromText(status);
        }
    }

    // Common functions
    function resetCount() {
        document.title = base_title;
        unread_count = 0;
    }

    function showNotification(msg) {
        msg.type = "notification";
        chrome.extension.sendRequest(msg);
    }

    function openUrlFromText(text) {
        var enableAutoOpenUrl = settings["enableAutoOpenUrl"];
        if (enableAutoOpenUrl) {
            var urls = text.match(/https?:\/\/\S+/g);
            if (urls) {
                for (var i = 0, n = urls.length; i < n; i++) {
                    chrome.extension.sendRequest({type:"openurl", url:urls[i]});
                }
            }
        }
    }

    function getLastUpdateElement() {
        var ru = document.getElementById("realupdates");
        if (is_mobile()) {
            return ru.getElementsByClassName("update-item")[0];
        } else {
            return ru.getElementsByClassName("update")[0];
        }
    }

    function getLastUpdateId() {
        var lu = getLastUpdateElement();
        return lu.id;
    }

    function is_mobile() {
        var fl = document.getElementById("footer-links");
        return (fl==null) ? false : true;
    }


    var base_title = document.title;
    var last_update_id = getLastUpdateId();
    var unread_count = 0;


    // Attach events
    window.addEventListener("focus", focus, false);
    document.addEventListener("keydown", keydown, false);
    document.addEventListener("DOMNodeInserted", update, false);
    document.getElementById("composebutton").addEventListener("click", click, false);
})();
// vim:set ts=4 sw=4 expandtab:
