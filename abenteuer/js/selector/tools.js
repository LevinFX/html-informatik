document.addEventListener('DOMContentLoaded', () => {
    const phishing = document.getElementById('phishing');
    const zeroDay = document.getElementById('zeroDay');
    const opsec = document.getElementById('opsec');

    phishing.addEventListener('click', () => {
        location.href = './recon_start.html'
    });
    
    zeroDay.addEventListener('click', () => {
        location.href = './recon_start.html'
    });
    
    opsec.addEventListener('click', () => {
        location.href = './recon_start.html'
    });
    
});