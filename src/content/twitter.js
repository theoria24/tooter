var tootConfig, mastodonPost;

chrome.storage.local.get('settings', function(res) {
    tootConfig = res.settings;
    if (tootConfig && tootConfig.access_token) {
        run();
    }
});

function run() {
    var path = window.location.pathname;
    switch (true) {
    case /intent\/tweet/.test(path):
        addToIntentForm();
        break;
    }
}

function errorStatus(text) {
    var alert = document.createElement('p');
    alert.className = 'error notice noarrow';
    alert.id = 'post-error';
    alert.innerText = text;
    document.querySelector('#bd').appendChild(alert);
}

function tootClicked(event) {
    event.preventDefault();
    var tootText = document.querySelector('#status').value;
    mastodonPost(tootText)
        .then(function(t) {
            if (t.url) {
                window.location.href = t.url;
            } else {
                errorStatus('An error occurred');
            }
        })
        .catch(function(e) {
            errorStatus(`An error occurred: ${e}`);
        });
}

function tweetTootClicked(event) {
    event.preventDefault();
    var tootText = document.querySelector('#status').value;
    var tweetButton = document.querySelector('input.submit');
    mastodonPost(tootText)
        .then(function(t) {
            if (t.url) {
                tweetButton.click();
            } else {
                errorStatus('An error occurred.');
            }
        })
        .catch(function(e) {
            errorStatus(`An error occurred: ${e}`);
        });
}

function addToIntentForm() {
    addIntentButtonStyle();
    var submitFields = document.querySelector('fieldset.submit');
    var tootButton = newIntentButton('toot', 'Toot');
    submitFields.appendChild(tootButton);
    tootButton.addEventListener('click', tootClicked);
    if (document.body.classList.contains('logged-in')) {
        // If not logged in, don't offer Tweet and Toot,
        // since they will have that option after logging in
        var tweetTootButton = newIntentButton('tweettoot', 'Tweet and Toot');
        submitFields.appendChild(tweetTootButton);
        tweetTootButton.addEventListener('click', tweetTootClicked);
    }
}

function addIntentButtonStyle() {
    var style = document.createElement('style');
    style.innerHTML = `
    .button.toot.selected {
            border-color: #454b5e;
            background-color: #454b5e;
            margin-right: 3px;
    }
    .button.tweettoot.selected {
            border-color: #454b5e;
            background: linear-gradient(90deg, #1da1f2 0%, #1da1f2 50%, #454b5e 50%, #454b5e 100%)
    }`;
    document.head.appendChild(style);
}

function newIntentButton(classes, label) {
    var newButton = document.createElement('input');
    newButton.setAttribute('class', 'button selected ' + classes);
    newButton.setAttribute('type', 'submit');
    newButton.setAttribute('value', label);
    return newButton;
}
