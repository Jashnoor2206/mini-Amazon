// Show / hide password buttons
document.querySelectorAll('.rp-toggle').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var input = document.getElementById(btn.dataset.target);
    var showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    btn.textContent = showing ? 'Show' : 'Hide';
    btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
  });
});

// Live "passwords match" hint + block submit if they don't match
(function () {
  var pw = document.getElementById('password');
  var confirm = document.getElementById('confirmPassword');
  var hint = document.getElementById('matchHint');
  function check() {
    if (!confirm.value) {
      hint.textContent = '';
      hint.className = 'rp-hint';
      confirm.setCustomValidity('');
      return;
    }
    var ok = pw.value === confirm.value;
    hint.textContent = ok ? 'Passwords match' : 'Passwords do not match';
    hint.className = 'rp-hint ' + (ok ? 'rp-hint-ok' : 'rp-hint-bad');
    confirm.setCustomValidity(ok ? '' : 'Passwords do not match');
  }
  pw.addEventListener('input', check);
  confirm.addEventListener('input', check);
})();
