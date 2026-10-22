const wishlistBtns = document.querySelectorAll('.add-to-cart');

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

            if(!res.ok){
                const data = await res.json();
                showToast(data.error || 'Could not add to cart', 'error', 2200);
                return;
            }
            showToast(productName + ' added to cart');

        }catch(err){
            console.log(err);
            showToast('Something went wrong', 'error', 2200);
        }finally{
            btn.disabled = false;
        }
    })
})