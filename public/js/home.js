const cartCount = document.querySelector('.cart-count');
const buttons  = document.querySelectorAll('.add-to-cart');
const wishlistBtns = document.querySelectorAll('.wishlist-btn');

buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const listingID = btn.dataset.listingId;
        const card = btn.closest('.product-card');
        const productName = card ? card.querySelector('h3').textContent.trim() : 'Item';
        btn.disabled = true;
        try{
            const res = await fetch('/user/cart/add', {
                method : 'PATCH',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({listingID})
            });

            if(res.status === 401){
                setTimeout(() => {
                    window.location.href = '/amazon-clone/login';
                    return;
                }, 1500);
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


wishlistBtns.forEach(btn =>{
    btn.addEventListener('click' , async() =>{
        btn.disabled = true;
        const listingId = btn.dataset.listingId;
        const productId = btn.dataset.productId;
        const card = btn.closest('.product-card'); // these two lines are there to fetch the name of the product 
        const productName = card ? card.querySelector('h3').textContent.trim() : 'Item';
        const isActive = btn.classList.contains('active');
        const url = isActive ? '/user/wishlist/remove' : '/user/wishlist/add';

        try{
            const res = await fetch(url , {
                method : 'PATCH', 
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({listingId})
            });

            if(res.status === 401){
                setTimeout(() => {
                    window.location.href = '/amazon-clone/login';
                }, 1500);
                return;
            }

            const data = await res.json();
            if(!res.ok){
                showToast(data.error || 'Could not add to wishlist' , 'error', 2000);
                return;
            }
            document.querySelectorAll(`.wishlist-btn[data-product-id="${productId}"]`)
            .forEach(b => b.classList.toggle('active', data.wishlisted));
            btn.classList.remove('bump');
            void btn.offsetWidth;
            btn.classList.add('bump');
            showToast(productName + (data.wishlisted ? ' added to wishlist' : ' removed from wishlist'));
        }catch(err){
            console.log(err);
            showToast('Something went wrong', 'error', 2000);
        }finally{
            btn.disabled = false;
        }
    })
})