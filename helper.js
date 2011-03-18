function submit(event) {
    removeAllNotifications();
    _last_update_id++;

    var ct = document.getElementById('composetext');
    if (ct.value.replace(/\n/g, '') !== '') {
        var cf = document.getElementById('composeform');
        cf.submit();
        ct.value = '';
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
                _notifications.push(event.target);
                setTimeout(function(){
                    removeNotification(event.target);
                }, 4000);
            }
            notification.show();
        } catch (e) {
        }
    }
}

function removeAllNotifications() {
    for (i = 0, n = _notifications.length; i < n; i++) {
        _notifications[i].cancel();
    }
    _notifications.length = 0;
}

function removeNotification(notification) {
    for (var i = 0, n = _notifications.length; i < n; i++) {
        if (_notifications[i] === notification) {
            _notifications[i].cancel();
            _notifications.splice(i, 1);
            break;
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
var _notifications = [];


// attach events
document.addEventListener("keydown", keydown, false);
document.addEventListener("DOMNodeInserted", update, false);
document.getElementById('composebutton').addEventListener("click", submit, false);

