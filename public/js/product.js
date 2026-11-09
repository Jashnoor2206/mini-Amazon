const wishlistBtn = document.querySelector('.wishlist-btn');
const addTocart = document.querySelectorAll('.add-to-cart');
const cartCount = document.querySelector('.cart-count');

wishlistBtn.addEventListener('click', async() => {
    wishlistBtn.disabled = true;
    const listingId = wishlistBtn.dataset.listingId;
    const productName = wishlistBtn.dataset.productName;
    const isActive = wishlistBtn.classList.contains('active');
    const url = isActive ? '/user/wishlist/remove' : '/user/wishlist/add';

    try{
        const res = await fetch(url , {
            method : 'PATCH', 
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({listingId})
        })

        if(res.status === 401){
            showToast('Please log in to use your wishlist', 'error', 1500);
            setTimeout(() => {
                window.location.href = '/amazon-clone/login'; // not logged in, send to login page
            }, 1500);
            return;
        }

        const data = await res.json();
        if(!res.ok){
            showToast(data.error || 'Could not add to wishlist' , 'error', 2000);
            return;
        }
        // flip the look of the button to match what the server says
        wishlistBtn.classList.toggle('active', data.wishlisted); // it follows the template btn.classList.toggle('active', true/false) when it is true we add 'active' class to classList and when it is false we remove the class . So this is the flow , first if the product is already in the wishlist classList.contains('active') is true , the url is changed to /remove then in the controller {wishlist : false} is returned with the data and so the data.wishlisted is false and hence remove 'active' from the classList in ejs file
        wishlistBtn.setAttribute('aria-pressed', data.wishlisted); // ask claude , it is just for blind readers
        wishlistBtn.querySelector('.wishlist-text').textContent = data.wishlisted ? 'In your wishlist' : 'Add to wishlist';

        // replay the heart "pop" animation: remove the class, force the browser to notice (offsetWidth), add it back
        wishlistBtn.classList.remove('bump');
        void wishlistBtn.offsetWidth;
        wishlistBtn.classList.add('bump');
        showToast(productName + (data.wishlisted ? ' added to wishlist' : ' removed from wishlist'));
    }catch(err){
        console.log(err);
        showToast('Something went wrong', 'error', 2000);
    }finally{
        wishlistBtn.disabled = false; // turn the button back on after the request finishes
    }
});

addTocart.forEach(btn =>{
    btn.addEventListener('click', async () => {
        const listingID = btn.dataset.listingId;
        const productName = btn.dataset.productName;
        btn.disabled = true; // disable the clicked button (addTocart is a list, not a button)
        try{
            const res = await fetch('/user/cart/add', {
                method : 'PATCH',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({listingID})
            });
    
            if(res.status === 401){
                showToast('Please log in to add to cart', 'error', 1500);
                setTimeout(() => {
                    window.location.href = '/amazon-clone/login';
                }, 1500);
                return; // return here, outside setTimeout, so the code below doesn't run
            }
            const data = await res.json();
            if(!res.ok){
                showToast(data.error || 'Could not add to cart', 'error', 2200);
                return;
            }
            // data.quantity now comes from the controller: 1 = first time, more than 1 = added again
            if(data.quantity > 1){
                showToast(productName + ' added to cart again (' + data.quantity + ' in cart)');
            }else{
                showToast(productName + ' added to cart');
            }

            // update the badge in the header without reloading the page
            cartCount.textContent = data.cartCount;
            cartCount.classList.remove('bump');
            void cartCount.offsetWidth;
            cartCount.classList.add('bump');
        }catch(err){
            console.log(err);
            showToast('Something went wrong', 'error', 2200);
        }finally{
            btn.disabled = false;
        }
    })
});

window.addEventListener('pageshow', (e) => {
    const nav = performance.getEntriesByType('navigation')[0];
    if (e.persisted || (nav && nav.type === 'back_forward')) location.reload();
});