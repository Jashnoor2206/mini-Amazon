const incrementBtns = document.querySelectorAll('[data-cart-action="inc"]');
const decrementBtns = document.querySelectorAll('[data-cart-action="dec"]');

incrementBtns.forEach(btn =>{
    btn.addEventListener('click', async() =>
    {
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
        }catch(err){
            console.log(err);
        }finally{
            btn.disabled = false;
        }
    })
});