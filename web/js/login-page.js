// Google Sign-In (GIS) demo — replace client_id in HTML
window.handleCredentialResponse = (response) => {
  const out = document.getElementById('loginStatus');
  out.textContent = 'Signed in! (JWT credential received)\n' + response.credential.slice(0,40) + '...';
};
