const cartCount = document.querySelector('.cart-count');
const buttons  = document.querySelectorAll('.add-to-cart');

buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const listingID = btn.dataset.listingId;
        const card = btn.closest('.product-card');
        const productName = card ? card.querySelector('h3').textContent.trim() : 'Item';
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
                showToast(data.error || 'Could not add to cart', 'error', 2200);
                return;
            }

            cartCount.textContent = data.cartCount;

            // restart the bump animation
            cartCount.classList.remove('bump');
            void cartCount.offsetWidth;
            cartCount.classList.add('bump');

            showToast(productName + ' added to cart');
        }catch(err){
            console.log(err);
            showToast('Something went wrong', 'error', 2200);
        }finally{
            btn.disabled = false;
        }
    })
});