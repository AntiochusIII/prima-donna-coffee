import { Api } from './modules/api.js';

// Lightweight enhancement: update the final paragraph with a hook from story.json if available
document.addEventListener('DOMContentLoaded', async () => {
  const paras = document.querySelectorAll('main .story p');
  if (!paras.length) return;
  const last = paras[paras.length - 1];

  try {
    const story = await Api.getStoryHighlights();
    if (story && story.hook) {
      last.textContent = story.hook;
    }
  } catch (e) {
    // Silent fail; page content is already meaningful without this.
  }
});
