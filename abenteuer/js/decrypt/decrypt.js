const btn = document.getElementById('decryptBtn');
const bar = document.getElementById('progressBar');
const status = document.getElementById('status');
const log = document.getElementById('log');
const files = document.getElementById('files');
const continueBtn = document.getElementById('continueBtn');

const messages = [
    "Initialisiere AES-256 Key...",
    "Session Key geladen.",
    "Entschlüsselung gestartet...",
    "Block 1/10 entschlüsselt.",
    "Block 2/10 entschlüsselt.",
    "Block 3/10 entschlüsselt.",
    "Integrity-Check bestanden.",
    "Block 4/10 entschlüsselt.",
    "Block 5/10 entschlüsselt.",
    "Block 6/10 entschlüsselt.",
    "Key-Expansion erfolgreich.",
    "Block 7/10 entschlüsselt.",
    "Block 8/10 entschlüsselt.",
    "Block 9/10 entschlüsselt.",
    "Block 10/10 entschlüsselt.",
    "Überprüfung CRC32...",
    "Validierung abgeschlossen."
];

btn.addEventListener('click', () => {
    let progress = 0;
    let step = 0;
    status.textContent = "Entschlüsselung läuft...";
    btn.disabled = true;
    log.innerHTML = "";

    const interval = setInterval(() => {
        progress += 100 / messages.length;
        if (progress > 100) progress = 100;
        bar.style.width = progress + "%";

        if (step < messages.length) {
            const p = document.createElement("p");
            p.textContent = messages[step];
            log.appendChild(p);
            log.scrollTop = log.scrollHeight; 
            step++;
        }

        // Fertig
        if (step === messages.length) {
            clearInterval(interval);
            status.textContent = "Entschlüsselung abgeschlossen!";
            files.style.display = "block";
            continueBtn.style.display = "block"; 
            continueBtn.onclick = () => window.location.href = './choose_ending.html';
        }
    }, 500);
});