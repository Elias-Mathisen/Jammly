document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add("fade-in");
  });
  
  window.addEventListener("beforeunload", function() {
    document.body.classList.add("fade-out");
  });


  function checkAccessCode() {
    var hasAccessCode = false;

    if (!hasAccessCode) {
      document.getElementById('profile-picture-head').classList.add('hidden');
      document.getElementById('profile-text').textContent = 'Log in';
    }
  }

  checkAccessCode();