const checkboxes = document.querySelectorAll('input[type="checkbox"][name="opsec"]');
const finishBtn = document.getElementById('finishBtn');

function updateState() {
    const checked = [...checkboxes].filter(cb => cb.checked);
    const unchecked = [...checkboxes].filter(cb => !cb.checked);

    if (checked.length >= 2) {
        unchecked.forEach(cb => cb.closest('label').classList.add('disabled'));
    } else {
        unchecked.forEach(cb => cb.closest('label').classList.remove('disabled'));
    }

    if (checked.length === 2) {
        finishBtn.classList.add('enabled');
        finishBtn.disabled = false;
    } else {
        finishBtn.classList.remove('enabled');
        finishBtn.disabled = true;
    }
}

checkboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
        const checked = [...checkboxes].filter(c => c.checked);
        if (checked.length > 2) {
            e.target.checked = false;
            const label = e.target.closest('label');
            label.classList.add('shake');
            setTimeout(() => label.classList.remove('shake'), 300);
        }
        updateState();
    });
});

updateState();

finishBtn.addEventListener('click', () => {
    const checked = [...checkboxes].filter(cb => cb.checked).map(cb => cb.value);
    if (checked.length !== 2) return;

    if (checked.includes('logs')) {
        window.location.href = './end/captured_end.html';
    } else if (checked.includes('vpn') && checked.includes('tor')) {
        window.location.href = './recon_start.html';
    }
});