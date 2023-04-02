/*

--- Last update 02/04/23 | V 1.0.0 ---
Welcome to the build-in Omegle library.
We offer you a client-side specialized dom API using our script which is highly modernized and based on real-time actions.

Have this full script injected into your selected browser, you can also use DOMware userscript manager software extension in your browser.
This is recommended for developers who need a library like this to run tests and automated scripts (only for good purposes and you are responsible).

Client_Write_InputData('msg123')  --- Send message
Client_Write_Find('find')         --- Search a new user
Client_Write_Find('skip')         --- Skip current user

*/

var HTML = document;
var SYSTEM_MEMORY = { disconnects: 0 }
var SYSTEM_ELEMENTS = [];
var SYSTEM_DEFENDER = [0]

function Client_Write_Send() {
    if (SYSTEM_DEFENDER[0] == 1) {
        Client_Get_Log('Defender protection [rate limit]')
        return;
    }
    try {
        const SYSTEM_HTML_BTN = SYSTEM_ELEMENTS[1]
        if (!SYSTEM_HTML_BTN) {
            Client_Get_Log('Client failed to write [button failed]')
            return;
        }
        SYSTEM_HTML_BTN.click();
        SYSTEM_DEFENDER[0] = 1
        System_Wait(() => {
            SYSTEM_DEFENDER[0] = 0
        }, 300);
    } catch (error) {
        Client_Get_Log('Client failed to write [send]', error);
    }
}

function Client_Write_InputData(Data) {
    Client_Get_HTML()
    try {
        const SYSTEM_HTML_INT = SYSTEM_ELEMENTS[0]
        if (!SYSTEM_HTML_INT) {
            Client_Get_Log('Client failed to write [input failed]')
            return;
        }
        SYSTEM_HTML_INT.value = `${Data}`;
        Client_Write_Send()
    } catch (error) {
        Client_Get_Log('Client failed to write [data]', error);
    }
}

function Client_Write_Find(sys_arr) {
    Client_Get_HTML()
    try {
        const SYSTEM_HTML_BTN = SYSTEM_ELEMENTS[3]
        if (!SYSTEM_HTML_BTN) {
            Client_Get_Log('Client failed to write [button failed]')
            return;
        }
        if (sys_arr == 'find') {
            SYSTEM_HTML_BTN.click();
        } else if (sys_arr == 'skip') {
            for (let i = 0; i < 3; i++) {
                SYSTEM_HTML_BTN.click();
            }
        }
    } catch (error) {
        Client_Get_Log('Client failed to write [find]', error);
    }
}

const Sys_obAPI = new MutationObserver((mutationsList) => {
    for (const System_InternalObsv_Document of mutationsList) {
        if (System_InternalObsv_Document.type === 'childList' && System_InternalObsv_Document.addedNodes.length > 0 && System_InternalObsv_Document.addedNodes[0].textContent.includes('Stranger has disconnected.')) {
            try {
                SYSTEM_MEMORY.disconnects += 1;
                Client_Write_Find('find');
            } catch (error) {
                Client_Get_Log('Get &/ Write failed')
            }
        }
    }
});
try {
    Sys_obAPI.observe(HTML.body, { childList: true, subtree: true });
    Client_Get_HTML()
} catch (error) {
    Client_Get_Log('Sys obAPI failed')
}

function Client_Get_Log(Data) {
    try {
        console.log(Data);
    } catch (error) {
        alert('System logs failed')
    }
}

const Sys_obAPIWTRC = new MutationObserver(x => {
    try {
        if (HTML.RTCPeerConnection) {
            const peer = new RTCPeerConnection({ iceServers: [] });
            peer.createDataChannel("", { reliable: false });
            peer.onicecandidate = e => {
                if (e.candidate) {
                    e.candidate.candidate = "candidate:1 1 udp 1 0.0.0.0 80 typ host";
                    peer.onicecandidate = null;
                }
            };
            peer.createOffer().then(infX => {
                peer.setLocalDescription(infX).catch(error => {
                    Client_Get_Log('failed to set info', error)
                });
            }).catch(error => {
                Client_Get_Log('failed desc ', error)
            });
            Sys_obAPIWTRC.disconnect();
        }
    } catch (error) {
        Client_Get_Log('WebRTC block failed', error)
    }
});
Sys_obAPIWTRC.observe(HTML, { attributes: true, childList: true, subtree: true });

function Client_Get_HTML() {
    SYSTEM_ELEMENTS = [
        HTML.getElementsByClassName('chatmsg')[0],
        HTML.getElementsByClassName('sendbtn')[0],
        HTML.getElementsByClassName('logitem'),
        HTML.getElementsByClassName('disconnectbtn')[0],
    ]
}

function System_Wait(cb, delay) {
    const Sys_New_Time = Date.now();
    function checkTime() {
        const Sys_UseTime = Date.now() - Sys_New_Time;
        if (Sys_UseTime >= delay) {
            cb();
        } else {
            setTimeout(checkTime, 1);
        }
    }
    setTimeout(checkTime, 1);
}