document.addEventListener('DOMContentLoaded', () => {
    const phishing = document.getElementById('phishing');
    const zeroDay = document.getElementById('zeroDay');
    const opsec = document.getElementById('opsec');

    phishing.addEventListener('click', () => {
        GameState.addToList('toolset', 'phishing');
        location.href = './recon_start.html'
    });
    
    zeroDay.addEventListener('click', () => {
        GameState.addToList('toolset', 'zeroDay');
        location.href = './recon_start.html'
    });
    
    opsec.addEventListener('click', () => {
        GameState.addToList('toolset', 'opsec');
        location.href = './recon_start.html'
    });
    
});