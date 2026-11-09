const incrementBtns = document.querySelectorAll('[data-cart-action="inc"]');
const decrementBtns = document.querySelectorAll('[data-cart-action="dec"]');
const formatINR = n => '₹' + n.toLocaleString('en-IN');
const removeBtns = document.querySelectorAll('.remove-btn');
const checkoutBtn = document.getElementById('checkout-btn');


function updateSummary() {
    let totalItems = 0;
    let grandTotal = 0;
    const selectedIds = [];

    document.querySelectorAll('.cart-item').forEach(row => {
        const checkbox = row.querySelector('.select-item');
        if (!checkbox.checked) return;          // skip unticked items

        const q = Number(row.querySelector('.qty span').textContent);
        totalItems += q;
        grandTotal += Number(row.dataset.price) * q;
        selectedIds.push(checkbox.dataset.listingId);
    });

    document.getElementById('summary-items').textContent = totalItems;
    document.getElementById('summary-total').textContent = formatINR(grandTotal);

    checkoutBtn.href = '/amazon-clone/checkout?items=' + selectedIds.join(',');
    // path before the ? is the actual path and the path after it is the query string that gets sent in the url , since we dont have order or way to deal with orders in the database , we pass like this else we would have passed some post or patch request 
    checkoutBtn.classList.toggle('disabled', selectedIds.length === 0); // if nothing is selected we add a disabled class 
}

document.querySelectorAll('.select-item').forEach(cb => {
    cb.addEventListener('change', updateSummary);
});

// Start with every item unticked. Browsers (Firefox on reload, and any browser when
// you come back with the Back button) restore a checkbox's previous state, which made
// items look pre-selected even though the HTML has no `checked` attribute.
function resetSelection() { // it resets the checkbox buttons
    document.querySelectorAll('.select-item').forEach(cb => { cb.checked = false; });
    if (checkoutBtn) updateSummary();
}
resetSelection();
window.addEventListener('pageshow', (e) => {
    const nav = performance.getEntriesByType('navigation')[0];
    if (e.persisted || (nav && nav.type === 'back_forward')) location.reload();
}); // 'pageshow' means that when page is shown do this event which is listed next to it . performance is built in broswer object that records how the page was loaded . Everytime page opens browser writes down a visit record for something like :
// { type: 'back_forward', name: 'http://localhost/amazon-clone/cart', ... }
// type says how you arrived , line 44 reads this record and line 45 decided from it whether to reload 
// performance is a built-in object, like document or window. It’s the browser’s notebook of timing records for this page: when the page started loading, when each image and script loaded, and so on.
// 'navigation' is the type we ask for. A navigation record is the record of how the page itself was opened. Other types exist too, like 'resource' (one record per image, CSS or JS file), but we only care about the page visit. It’s a fixed built-in word, just like 'click' or 'pageshow'. The function always returns an array, even though a page has only one navigation record. So the result looks like [ { type: 'back_forward', ... } ]. [0] takes the first (and only) item out of the array, so we get the record object itself. const nav = ... stores that record in a variable called nav. nav is just a name I picked, short for navigation.
// e.persisted asks: “was this page restored from the frozen snapshot?” true or false. nav && nav.type === 'back_forward' asks: “does the record exist, and did the user arrive with Back or Forward?” The nav && part is only a safety check so we never read .type from something empty. || means OR: if either answer is true, run location.reload(), which refreshes the page from the server.

//In plain English: “If this page is an old copy, either a frozen snapshot or opened with the Back/Forward arrows, refresh it so the cart shows the real data.”

if (checkoutBtn) checkoutBtn.addEventListener('click', (e) => { // when cart is empty ejs page does not render the checkout button so it will return null state and rest of the code wont run below it , it is a safeguard
    console.log('checkout button clicked');
    updateSummary(); // refresh the href one last time before the browser follows it

    if (checkoutBtn.classList.contains('disabled')) { // this checks that does the box currently have the disabled class 
        console.log('if statement run');
        e.preventDefault();
        showToast('Select at least one item to checkout', 'error', 2000);
    }
});

removeBtns.forEach(btn => {
    btn.addEventListener('click', async() =>{
        btn.disabled = true;
        const listingID = btn.dataset.listingId;
        const item = btn.closest('.cart-item');
        try{
            const res = await fetch('/user/cart/removeItem', {
                method : 'PATCH',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({listingID})
            })

            const data = await res.json();
            if(!res.ok){
                showToast(data.message || 'Could not remove the item', 'error', 2000);
                return;
            }
            if(data.removed){
                item.remove();
                if(!document.querySelector('.cart-item')){
                    location.reload();
                    return;
                }
                updateSummary();
                return;
            }else{
                showToast('Something went wrong' , 'error', 2000);
            }
        }catch(err){
            console.log(err);
        }finally{
            btn.disabled = false;
        }
    })
});

incrementBtns.forEach(btn =>{
    btn.addEventListener('click', async() =>
    {
        const item = btn.closest('.cart-item');
        const listingID = btn.dataset.listingId;
        btn.disabled = true;

        try{
            const res = await fetch('/user/cart/incrementQuantity', {
                method : 'PATCH',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({listingID})
            })

            const data = await res.json();
            if(res.status === 400){
                showToast(data.error || 'Could not increase the quantity ' , 'error' , 2000);
                return ;
            }
            if(!res.ok){
                showToast(data.error || 'Some error occurred while adding product' , 'error' , 2000);
                return ;
            }

            btn.previousElementSibling.textContent = data.quantity;
            item.querySelector('.line-total').textContent = formatINR(data.quantity * data.price);
            updateSummary(data.price);

        }catch(err){
            console.log(err);
        }finally{
            btn.disabled = false;
        }
    })
});

decrementBtns.forEach(btn => {
    btn.addEventListener('click', async() =>{
        const listingID = btn.dataset.listingId;
        const item = btn.closest('.cart-item');
        btn.disabled = true;

        try{
            const res = await fetch('/user/cart/decrementQuantity', {
                method : 'PATCH',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({listingID})
            })
            const data = await res.json();
            if(!res.ok){
                showToast(data.error || 'Could not decrease the quantity' , 'error' , 2000);
                return;
            }
            if(data.removed){
                item.remove();
                if (!document.querySelector('.cart-item')) { // checks whether any rows are left in the cart or not , if no then reload the page
                    location.reload();
                    return;
                }
                updateSummary();
                return;
            }

            btn.nextElementSibling.textContent = data.quantity;
            item.querySelector('.line-total').textContent = formatINR(data.quantity * data.price);
            updateSummary();

        }catch(err){
            console.log(err);
        }finally{
            btn.disabled = false;
        }
    })
});