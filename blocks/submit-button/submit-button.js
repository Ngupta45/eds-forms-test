export default function decorate(block) {
  // Read content from block rows
  const rows = [...block.children];
  const label = rows[0]?.textContent.trim() || 'Submit';
  const loadingLabel = rows[1]?.textContent.trim() || 'Submitting…';

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button';
  button.textContent = label;
  button.dataset.label = label;
  button.dataset.loadingLabel = loadingLabel;

  button.addEventListener('click', (e) => {
    e.preventDefault();

    const form = block.closest('form') || document.querySelector('form');
    if (!form) return;

    if (button.disabled || form.getAttribute('data-submitting') === 'true') return;

    button.disabled = true;
    button.textContent = button.dataset.loadingLabel;

    const restoreButton = () => {
      button.disabled = false;
      button.textContent = button.dataset.label;
    };

    form.addEventListener('submit-success', restoreButton, { once: true });
    form.addEventListener('submit-failure', restoreButton, { once: true });

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });

  block.textContent = '';
  block.append(button);
}
