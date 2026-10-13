console.log('home.js file attached ');

const buttons  = document.querySelectorAll('.add-to-cart');

buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const listingID = btn.dataset.listingId;
        console.log(listingID);
    })
});