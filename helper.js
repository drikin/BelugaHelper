(function() {
    function submit(event) {
        last_update_id++;

        var ct = document.getElementById("composetext");
        if (ct.value.replace(/\n/g, "") !== "") {
            var cf = document.getElementById("composeform");
            cf.submit();
            ct.value = "";
        }
    }

    function keydown(event) {
        if (event.keyIdentifier === "Enter") {
            if (!(event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)) {
                submit(event);
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

    function showNotification(msg) {
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

    // attach events
    document.addEventListener("keydown", keydown, false);
    document.addEventListener("DOMNodeInserted", update, false);
    document.getElementById("composebutton").addEventListener("click", submit, false);
})();
// vim:ts=4:sw=4:expandtab
