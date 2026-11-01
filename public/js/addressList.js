const removeBtns = document.querySelectorAll('.remove-btn');
const emptyState = document.querySelector('.empty-state');
const dialog = document.getElementById('remove-dialog');

function askToRemove(){
    dialog.showModal();
    return new Promise(resolve => { answer = resolve; });
}
document.getElementById('remove-yes').addEventListener('click', () => { answer(true);  dialog.close(); });
document.getElementById('remove-no').addEventListener('click',  () => { answer(false); dialog.close(); });
dialog.addEventListener('click',  e => { if(e.target === dialog){ answer(false); dialog.close(); } });
dialog.addEventListener('cancel', () => answer(false)); // Esc

removeBtns.forEach(btn => {
    btn.addEventListener('click', async() => {
        if(!await askToRemove()) return;

        const addressId = btn.dataset.addressId;
        const card = btn.closest('.address-card');
        btn.disabled = true;

        try{
            const res = await fetch('/user/address/' + addressId, { method : 'DELETE' });

            if(res.status === 401){
                window.location.href = '/amazon-clone/login';
                return;
            }

            const data = await res.json();
            if(!res.ok){
                showToast(data.error || 'Could not remove the address', 'error', 2000);
                return;
            }

            card.remove();
            if(!document.querySelector('.remove-btn')){
                emptyState.hidden = false; // last address gone, show the empty message
            }
            showToast('Address removed');
        }catch(err){
            console.log(err);
            showToast('Something went wrong', 'error', 2000);
        }finally{
            btn.disabled = false;
        }
    })
});
