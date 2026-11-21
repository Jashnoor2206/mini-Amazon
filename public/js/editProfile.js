const profileForm = document.getElementById('profile-form');
const emailRow = document.getElementById('email-row');
const emailCurrent = document.getElementById('email-current');
const emailChangeBtn = document.getElementById('email-change-btn');
const emailStartForm = document.getElementById('email-start-form');
const emailVerifyForm = document.getElementById('email-verify-form');
const emailVerifyHint = document.getElementById('email-verify-hint');

profileForm.addEventListener('submit' , async(e) =>{
    e.preventDefault(); // stops the normal post request
    const btn = profileForm.querySelector('button[type="submit"]'); // selects button in profileForm whose type is submit
    btn.disabled = true;
    try{
        const formData = new FormData(profileForm); // picks up name, email , contact , profile photo directly from the form
        const res = await fetch('/user/profile', {
            method : 'PATCH',
            body : formData
        });
        if(res.status === 401){
            window.location.href = '/amazon-clone/login';
            return;
        }

        const data = await res.json();
        if(!res.ok){
            showToast(data.error || 'Could not save', 'error', 2000);
            return;
        }
        showToast('Profile updated');
        document.querySelector('.photo-name').textContent = data.name;
        if(data.profilePhoto){
            const img = document.getElementById('photo-img');
            const initial = document.getElementById('photo-initial');
            img.src = data.profilePhoto;
            img.hidden = false;
            if(initial) initial.hidden = true;
        }
        document.getElementById('profilePhoto').value = ''; // so the same photo isn't re-uploaded next save

    }catch(err){
        console.log(err);
        showToast('Something went wrong', 'error', 2000);
    }finally{
        btn.disabled = false;
    }
})


// the card has 3 states: 'view', 'start', 'verify'. Show exactly one.
function showEmailState(state){
    emailRow.hidden        = state !== 'view';
    emailStartForm.hidden  = state !== 'start';
    emailVerifyForm.hidden = state !== 'verify';
}

// sends JSON and reads JSON back; returns null if the user got logged out
async function sendJson(url, method, body){
    const res = await fetch(url, {
        method,
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(body)
    });
    if(res.status === 401){
        window.location.href = '/amazon-clone/login';
        return null;
    }
    const data = await res.json();
    return { res, data };
}

// 1. "Change" -> show the new-email form
emailChangeBtn.addEventListener('click', () => {
    showEmailState('start');
    document.getElementById('newEmail').focus();
});

// 2. both Cancel buttons -> back to the plain view
document.querySelectorAll('.email-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
        emailStartForm.reset();
        emailVerifyForm.reset();
        showEmailState('view');
    });
});

// 3. "Send code" -> server sends code #1 to the CURRENT email
emailStartForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = emailStartForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    try{
        const result = await sendJson('/user/profile/email/start', 'POST', {
            newEmail : document.getElementById('newEmail').value
        });
        if(!result) return;
        const { res, data } = result;
        if(!res.ok){
            showToast(data.error || 'Could not send the code', 'error', 2200);
            return;
        }
        emailVerifyHint.textContent = `Step 1 of 2: enter the code we sent to ${data.sentTo}`;
        showEmailState('verify');
        document.getElementById('emailOtp').focus();
        showToast('Code sent');
    }catch(err){
        console.log(err);
        showToast('Something went wrong', 'error', 2200);
    }finally{
        btn.disabled = false;
    }
});

// 4. "Verify" -> used for BOTH codes; the server says what comes next via data.stage
emailVerifyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = emailVerifyForm.querySelector('button[type="submit"]');
    const otpInput = document.getElementById('emailOtp');
    btn.disabled = true;
    try{
        const result = await sendJson('/user/profile/email/verify', 'PATCH', { otp : otpInput.value });
        if(!result) return;
        const { res, data } = result;

        if(!res.ok){
            const left = data.attemptsLeft !== undefined ? ` (${data.attemptsLeft} tries left)` : '';
            showToast((data.error || 'Could not verify') + left, 'error', 2500);
            otpInput.value = '';
            return;
        }

        if(data.stage === 'new'){
            // first code was right, second one is on its way to the new email
            otpInput.value = '';
            emailVerifyHint.textContent = `Step 2 of 2: enter the code we sent to ${data.sentTo}`;
            showToast('Now check your new email');
            return;
        }

        // stage 'done': update every place on the page that shows the email
        emailCurrent.textContent = data.email;
        document.querySelector('.photo-email').textContent = data.email;
        document.querySelector('.password-link-form input[name="email"]').value = data.email;
        document.querySelector('.password-link-form .link-sub').textContent = `We'll email a code to ${data.email}`;
        emailStartForm.reset();
        emailVerifyForm.reset();
        showEmailState('view');
        showToast('Email updated');
    }catch(err){
        console.log(err);
        showToast('Something went wrong', 'error', 2200);
    }finally{
        btn.disabled = false;
    }
});