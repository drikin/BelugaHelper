(function() {
	// Event handlers
    function focus() {
        resetCount();
    }

    function keydown(event) {
        if (event.keyIdentifier === "Enter") {
            if (!(event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)) {
                var cb = document.getElementById("composebutton");
                cb.click();
                // workaround. make sure for clearing
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
            var img_url = lu.getElementsByClassName("userimg")[0].src;
            var name = lu.getElementsByClassName("uname")[0].textContent;
            var status = lu.getElementsByClassName("ustatus")[0].textContent;
            showNotification({"image_url": img_url, "name": name, "status": status});
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

    function getLastUpdateElement() {
        var ru = document.getElementById("realupdates");
        return ru.getElementsByClassName("update")[0];
    }

    function getLastUpdateId() {
        var lu = getLastUpdateElement();
        return lu.id;
    }



    var base_title = document.title;
    var last_update_id = getLastUpdateId();
    var unread_count = 0;

    // Attach events
    window.addEventListener("focus", focus, false);
    document.addEventListener("keydown", keydown, false);
    document.addEventListener("DOMNodeInserted", update, false);
})();
