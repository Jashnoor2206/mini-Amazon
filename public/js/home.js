
const cartCount = document.querySelector('.cart-count');
const buttons  = document.querySelectorAll('.add-to-cart');

buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const listingID = btn.dataset.listingId;
        btn.disabled = true;
        try{
            const res = await fetch('/user/cart/add', {
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({listingID})
            });

            if(res.status === 401){
                window.location.href = '/amazon-clone/login';
                return;
            }
            const data = await res.json();
            if(!res.ok){
                alert(data.error || 'Could not add to cart')
                return;
            }

            cartCount.textContent = data.cartCount;
        }catch(err){
            console.log(err);
        }finally{
            btn.disabled = false;
        }
    })
});