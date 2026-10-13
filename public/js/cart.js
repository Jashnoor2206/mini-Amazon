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
            }
            if(!res.ok){
                alert(data.message || 'Some error occurred while adding product');
            }

            btn.previousElementSibling.textContent=Number(btn.previousElementSibling.textContent) + 1;

        }catch(err){
            console.log(err);
        }finally{
            btn.disabled = false;
        }
    })
});