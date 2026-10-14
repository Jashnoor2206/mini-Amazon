const incrementBtns = document.querySelectorAll('[data-cart-action="inc"]');
const decrementBtns = document.querySelectorAll('[data-cart-action="dec"]');
const formatINR = n => '₹' + n.toLocaleString('en-IN');

function updateSummary(price) {
    let totalItems = 0;
    let grandTotal = 0;
    document.querySelectorAll('.cart-item').forEach(row => {
        const q = Number(row.querySelector('.qty span').textContent);
        totalItems += q;
        grandTotal += Number(price) * q;
    });
    document.getElementById('summary-items').textContent = totalItems;
    document.getElementById('summary-total').textContent = formatINR(grandTotal);
}

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
                alert(data.message);
                return ;
            }
            if(!res.ok){
                alert(data.message || 'Some error occurred while adding product');
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
                alert(data.error);
                return;
            }

            btn.nextElementSibling.textContent = data.quantity;
            item.querySelector('.line-total').textContent = formatINR(data.quantity * data.price);
            updateSummary(data.price);

        }catch(err){
            console.log(err);
        }finally{
            btn.disabled = false;
        }
    })
});