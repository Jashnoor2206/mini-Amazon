const wishlistBtns = document.querySelectorAll('.add-to-cart');
const cartCount = document.querySelector('.cart-count');
const removeBtns = document.querySelectorAll('.remove-wishlist');


wishlistBtns.forEach(btn =>{
    btn.addEventListener('click' , async() =>{
        const listingID = btn.dataset.listingId;
        const productName = btn.dataset.productName;

        btn.disabled = true;
        try{
            const res = await fetch('/user/cart/add' , {
                method : 'PATCH',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({listingID})
            })
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
})

removeBtns.forEach(btn =>{
    btn.addEventListener('click', async() =>{
        const listingId = btn.dataset.listingId;
        btn.disabled = true;

        try{
            const res = await fetch('/user/wishlist/remove', {
                method : 'PATCH',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({listingId})
            })
            if(!res.ok){
                showToast('Something went wrong' , 'error ', 2000);
            }
            location.reload();
        }catch(err){
            console.log(err);
        }
    })
})