// blocks/submit-button/submit-button.js
export default function decorate(block) {
  // Authors provide two lines in UE:
  // Line 1: button label
  // Line 2: endpoint URL
  const lines = block.textContent
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const label = lines[0] || 'Send';
  const endpoint = lines[1] || 'http://localhost:3000/contact';

  // Build markup for the block
  block.innerHTML = `
    <button class="submit-button__button" type="button">${label}</button>
    <div class="submit-button__status"></div>
    <span class="submit-button__endpoint">${endpoint}</span>
  `;

  const button = block.querySelector('.submit-button__button');
  const statusEl = block.querySelector('.submit-button__status');
  const endpointEl = block.querySelector('.submit-button__endpoint');

  // Hide endpoint text visually but keep it editable in UE
  endpointEl.style.display = 'none';

  // Adjust selector to match your AF form element
  const afForm = document.querySelector('form.cmp-adaptiveform__form');
  if (!button || !afForm) return;

  button.addEventListener('click', async () => {
    const url = endpointEl.textContent.trim();
    if (!url) {
      statusEl.textContent = 'Submit endpoint not configured.';
      return;
    }

    const formData = new FormData(afForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      statusEl.textContent = 'Sending…';

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      statusEl.textContent = 'Thanks, your message was sent.';
      afForm.reset();
    } catch (e) {
      console.error('Custom submit failed', e);
      statusEl.textContent = 'Sorry, something went wrong.';
    }
  });
}
