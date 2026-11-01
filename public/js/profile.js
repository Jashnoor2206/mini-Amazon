const dialog = document.getElementById('logout-dialog');

document.getElementById('logout-open').addEventListener('click', () => {
    dialog.showModal();
});

document.getElementById('logout-no').addEventListener('click', () => {
    dialog.close();
});

dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
});
