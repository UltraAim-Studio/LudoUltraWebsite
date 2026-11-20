const deletionForm = document.getElementById('deletionForm');
const deletionReason = document.getElementById('deletionReason');
const customReasonField = document.getElementById('customReasonField');
const customReason = document.getElementById('customReason');
const deletionStatus = document.getElementById('deletionStatus');
const deletionButton = deletionForm.querySelector('button[type="submit"]');
const deletionEndpoint = 'https://docs.google.com/forms/d/e/1FAIpQLSffWVVOygSy-FsRCO3yV0xfUbNnQyt8HEnCUaLh7qdrIJ4buQ/formResponse';
let deletionSubmitting = false;
// A browser-side deterrent, not a security boundary. Store no account details.
const deletionCooldownKey = 'ludoUltra.deletionCooldownUntil';
const deletionCooldownMs = 5 * 60 * 1000;
const deletionCooldownNote = document.getElementById('deletionCooldown');
let deletionCooldownUntil = 0;

function readDeletionCooldown() {
    try {
        const stored = Number(localStorage.getItem(deletionCooldownKey));
        if (Number.isFinite(stored) && stored > Date.now()) {
            deletionCooldownUntil = Math.max(deletionCooldownUntil, Math.min(stored, Date.now() + deletionCooldownMs));
        }
    } catch {
        // Storage can be unavailable; retain the in-memory cooldown.
    }
    return Math.max(0, deletionCooldownUntil - Date.now());
}

function refreshDeletionCooldown() {
    const seconds = Math.ceil(readDeletionCooldown() / 1000);
    deletionButton.disabled = deletionSubmitting || seconds > 0;
    if (!deletionSubmitting) {
        deletionButton.textContent = seconds > 0
            ? `Please wait ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
            : 'Submit deletion request';
    }
    deletionCooldownNote.textContent = seconds > 0
        ? 'A request was recently attempted in this browser. Please wait for the timer before submitting again. Your entries are preserved.'
        : 'To reduce duplicate requests, this page allows one submission attempt every five minutes in this browser.';
}

function startDeletionCooldown() {
    deletionCooldownUntil = Date.now() + deletionCooldownMs;
    try {
        localStorage.setItem(deletionCooldownKey, String(deletionCooldownUntil));
    } catch {
        // Continue with the in-memory limit when storage is blocked.
    }
    refreshDeletionCooldown();
}

function updateCustomReason() {
    const isOther = deletionReason.value === 'other';
    customReasonField.hidden = !isOther;
    customReason.disabled = !isOther;
    customReason.required = isOther;
}

deletionReason.addEventListener('change', updateCustomReason);
updateCustomReason();

deletionForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (deletionSubmitting || readDeletionCooldown() > 0) {
        refreshDeletionCooldown();
        return;
    }
    updateCustomReason();
    if (!deletionForm.reportValidity()) return;

    const fields = [
        ['deletionEmail', 'entry.1321541377'],
        ['gameUserId', 'entry.1860942795'],
        [deletionReason.value === 'other' ? 'customReason' : 'deletionReason', 'entry.1999220963'],
        ['deletionFeedback', 'entry.417291868'],
    ];
    const body = new URLSearchParams();
    for (const [id, entry] of fields) {
        const field = document.getElementById(id);
        const value = field.value.trim();
        if (!value) {
            deletionStatus.textContent = 'Please complete all required fields. Spaces alone are not valid.';
            field.focus();
            return;
        }
        body.set(entry, value);
    }
    const timing = deletionForm.querySelector('input[name="deletionTiming"]:checked');
    if (!timing) return;
    body.set('entry.1791135655', timing.value === 'immediately' ? 'Immediately' : 'After 30 days');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    deletionSubmitting = true;
    // Reserve the cooldown before sending, including uncertain/failed delivery.
    startDeletionCooldown();
    deletionButton.disabled = true;
    deletionButton.textContent = 'Sending request...';
    deletionForm.setAttribute('aria-busy', 'true');
    deletionStatus.textContent = 'Sending your deletion request...';

    try {
        // An opaque response is not confirmation of receipt or account deletion.
        await fetch(deletionEndpoint, {
            method: 'POST',
            mode: 'no-cors',
            credentials: 'omit',
            body,
            signal: controller.signal,
        });
        deletionStatus.textContent = 'Your deletion request was sent. Your account will be reviewed before any action is taken.';
    } catch (error) {
        deletionStatus.textContent = error.name === 'AbortError'
            ? 'The request timed out. Please try again later.'
            : 'We could not send your request. Please check your connection and try again.';
    } finally {
        clearTimeout(timeout);
        deletionSubmitting = false;
        refreshDeletionCooldown();
        deletionForm.removeAttribute('aria-busy');
    }
});

// Keep submission disabled when JavaScript is unavailable.
refreshDeletionCooldown();
setInterval(refreshDeletionCooldown, 1000);
window.addEventListener('storage', refreshDeletionCooldown);
window.addEventListener('pageshow', refreshDeletionCooldown);