export default function decorate(block) {
  const button = block.querySelector('.af-custom-submit__button');
  const statusEl = block.querySelector('.af-custom-submit__status');
  const endpointEl = block.querySelector('.af-custom-submit__endpoint');

  // Adaptive Form form element (adjust selector if needed)
  const afForm = document.querySelector('form.cmp-adaptiveform__form');

  if (!button || !afForm || !endpointEl) {
    return;
  }

  const getEndpoint = () => endpointEl.textContent.trim();

  button.addEventListener('click', async () => {
    const endpoint = getEndpoint();
    if (!endpoint) {
      console.warn('No endpoint configured for af-custom-submit block');
      statusEl.textContent = 'Configuration error: no endpoint.';
      return;
    }

    const formData = new FormData(afForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      statusEl.textContent = 'Sending…';

      const res = await fetch(endpoint, {
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