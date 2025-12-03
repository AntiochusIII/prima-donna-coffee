// Google Sign-In (GIS) demo — replace client_id in HTML
window.handleCredentialResponse = (response) => {
  const out = document.getElementById('loginStatus');
  if (!out) return;
  out.textContent = 'Signed in! (JWT credential received)\n' + response.credential.slice(0, 40) + '...';
};

document.addEventListener('DOMContentLoaded', () => {
  const clearBtn = document.getElementById('clearLoginStatus');
  const out = document.getElementById('loginStatus');
  if (clearBtn && out) {
    clearBtn.addEventListener('click', () => {
      out.textContent = 'Signed-out locally. (For demo only.)';
    });
  }
});
