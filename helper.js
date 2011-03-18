function submit() {
    var ct = document.getElementById('composetext');
    if (!(event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)) {
        if (ct.value.replace(/\n/g, '') !== '') {
            var cf = document.getElementById('composeform');
            cf.submit();
            ct.value = '';
        }
    }
}

function keydown(event) {
	if (event.keyIdentifier === "Enter") {
        submit();
    }
}

function update(event) {
    var id = getLastUpdateId();
    if (id > _last_update_id) {
        _last_update_id = id;

        // update window title
        _unread_count++;
        document.title = "(" + _unread_count + ") " + _title;

        // show notification
        var lu = getLastUpdateElement();
        var img_url = lu.getElementsByClassName("userimg")[0].src;
        var name = lu.getElementsByClassName("uname")[0].textContent;
        var status = lu.getElementsByClassName("ustatus")[0].textContent;
        try {
            var notification = webkitNotifications.createNotification(
                img_url,
                name,
                status);
            notification.ondisplay = function(event) {
                setTimeout(function(){event.target.cancel();}, 4000);
            }
            notification.show();
        } catch (e) {
        }
    }
}

function getLastUpdateElement() {
    var ru = document.getElementById("realupdates");
    return ru.getElementsByClassName("update")[0];
}

function getLastUpdateId() {
    var lu = getLastUpdateElement();
    return lu.id;
}

var _title = document.title;
var _last_update_id = getLastUpdateId();
var _unread_count = 0;

// attach events
document.addEventListener("keydown", keydown, false);
document.addEventListener("DOMNodeInserted", update, false);

