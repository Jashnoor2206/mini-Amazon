const incrementBtns = document.querySelectorAll('[data-cart-action="inc"]');
const decrementBtns = document.querySelectorAll('[data-cart-action="dec"]');
const formatINR = n => '₹' + n.toLocaleString('en-IN');
const removeBtns = document.querySelectorAll('.remove-btn');
const checkoutBtn = document.querySelector('.btn-primary');


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

checkoutBtn.addEventListener('click', (e) => {
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