// VERLAUF
let pastCommands = [];
let timesPressedUp = 0;

// Event-Listener
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        timesPressedUp = 0;
        addComment();
        document.querySelector(".comment-div").scrollIntoView();
    } else if (e.key === "ArrowUp") {
        if (pastCommands.length > timesPressedUp) timesPressedUp++;
        let lastCommand = pastCommands[pastCommands.length - timesPressedUp];
        document.querySelector(".user-command").value = lastCommand || "";
    } else if (e.key === "ArrowDown") {
        if (timesPressedUp > 0) timesPressedUp--;
        let lastCommand = pastCommands[pastCommands.length - timesPressedUp];
        document.querySelector(".user-command").value = lastCommand || "";
    } else if (e.key === "Tab") {
        e.preventDefault();
        let input = document.querySelector(".user-command").value;
        let dict = Object.keys(rootCmds);
        if (input !== "") {
            dict.forEach((cmd) => {
                if (cmd.startsWith(input)) {
                    document.querySelector(".user-command").value = cmd;
                }
            });
        }
    }
});

export let commentsDiv = document.querySelector(".comments");

let rootCmds = {
    "neofetch": `<div>Systeminfo wird angezeigt...</div>`,
};

let mainCmds = ["clear", "ls", "help", "zphisher"];
let allCmds = [...mainCmds, ...Object.keys(rootCmds)];

let userCommandDiv = document.querySelector(".user-command");
userCommandDiv.addEventListener("focus", (e) => e.preventDefault());

function addComment() {
    let newComment = document.createElement("div");
    newComment.classList.add("user-comment");

    let userCommand = userCommandDiv.value.trim();
    if (userCommand === "") {
        commentsDiv.innerHTML += `<div>Bitte gib einen Befehl ein.</div>`;
        return;
    }

    pastCommands.push(userCommand);
    newComment.innerText = `> ${userCommand}`;
    commentsDiv.appendChild(newComment);

    if (allCmds.includes(userCommand)) {
        if (userCommand === "clear") {
            commentsDiv.innerHTML = "";
        } else if (userCommand === "help") {
            let cmds = [...Object.keys(rootCmds), ...mainCmds];
            commentsDiv.innerHTML += `<ul>${cmds.map((c) => `<li>${c}</li>`).join("")}</ul>`;
        } else if (userCommand === "ls") {
            commentsDiv.innerHTML += `<div>${Object.keys(rootCmds).map((c) => `<div>${c}</div>`).join("")}</div>`;
        } else if (userCommand === "zphisher") {
            let success = Math.random() < 0.7; // 70% Erfolgschance
            if (success) {
                commentsDiv.innerHTML += `<div><pre>
[zphisher] loading template: nova-login-light
[zphisher] creating temporary site -> https://nova-login.sim/
[zphisher] ngrok tunnel (mock) -> https://nl-sim.ngrok.fake
[zphisher] starting listener (simulated)
[zphisher] waiting for target...

[2025-09-18 21:33:09] [INFO] Incoming connection from 103.45.77.122
[2025-09-18 21:33:13] [SUCCESS] Captured credentials (simulated):
  username: j.meyer@novadyne.local
  password: ***** (placeholder masked)
[2025-09-18 21:33:13] [INFO] IP geolocation (mock): DE, Hamburg
[2025-09-18 21:33:16] [INFO] Saved session -> /tmp/zphisher_sessions/ session_20250918_213316.json

[zphisher] session complete (mock). Clean up temporary files.
</pre><br><h3><a href="./decrypt_files.html">Klicke hier, um fortzufahren</a></h3></div>`;
            } else {
             commentsDiv.innerHTML += `<div><pre>[zphisher] loading template: nova-sso-dark
[zphisher] creating temporary site -> https://auth-nova.sim/
[zphisher] starting listener (simulated)
[zphisher] waiting for target...

[2025-09-18 21:40:02] [WARNING] Multiple failed connection attempts detected
[2025-09-18 21:40:05] [ALERT] Target triggered adaptive security rule: suspicious 로그인 flow
[2025-09-18 21:40:06] [ALERT] NovaSentinel notifier: "Unusual authentication traffic to auth-nova.sim" — forwarded to SOC
[2025-09-18 21:40:08] [INFO] Trace increase: +18 (current traceLevel: 62)   <-- story flag
[zphisher] listener terminated (mock). Session logged to /tmp/zphisher_alerts/alert_20250918_214008.json</pre><h3><a href="./trap_detected.html">Klicke hier, um fortzufahren</a></h3></div>`   
            }
            
        } else if (rootCmds[userCommand]) {
            commentsDiv.innerHTML += rootCmds[userCommand];
        }
    } else {
        handleInvalidCommand(userCommand);
    }

    userCommandDiv.value = "";
}

function handleInvalidCommand(cmd) {
    commentsDiv.innerHTML += `<div>Der Befehl <span class="green">'${cmd}'</span> wurde nicht erkannt. Tippe <span class="red">help</span> für eine Liste möglicher Befehle.</div>`;
}
