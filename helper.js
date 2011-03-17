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

document.addEventListener("keydown", keydown, false);
