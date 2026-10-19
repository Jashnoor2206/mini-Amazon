(function () {
    let container = null;

    const ICONS = {
        success: '<svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>',
        error: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
    };

    function getContainer() {
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }
        return container;
    }

    window.showToast = function (message, type = 'success', duration = 1800) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.setAttribute('role', 'status');

        const icon = document.createElement('span');
        icon.className = 'toast-icon';
        icon.innerHTML = ICONS[type] || ICONS.success;

        const text = document.createElement('span');
        text.className = 'toast-text';
        text.textContent = message; // textContent so product names can't inject HTML

        toast.append(icon, text);
        getContainer().appendChild(toast);

        // next frame so the transition actually plays
        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 350);
        }, duration);
    };
})();

// brief working of the toast.js 
// toast is the small message box that you create with javaScript , put on page and remove after some time , This whole file is the recipie for that only : 
// Make a box , Put text and icon inside it , Put it on page , Wait about 2 seconds , Remove it 
// now we wrap whole file in the function that calls itself immediately when browser loads the homepage , why did we put it inside the function is because of the privacy , variables you declare inside it only exist inside that wrapper and cant be called in home.js or any other file . Now as soon as the browser loads and function is run setup is started like container set to null , icons are declared . Note that all the setup is done no showToast is appeared on the screen as soon as the homepage is loaded because window is attached to showToast and it prevents it from running automatically . Hence all the code that has window attached to it wont run automatically like the other code 

// now explaining the code from here :
// container is the storage slot for the toast container , div that holds all the toasts , it starts as empty because div doesn't exist yet we only create when we need it for the first toast 
// now the function getContainer() answers one question , give me the container div , creating it if it doesn't exist yet 

// now window.showToast() is the main function , it is divided into 3 parts . Anything attached with the window can be called from any other file  , like home.js calls showToast() from itself normally . Now the three parts are message , success of error (if you dont pass this it is a success) and duration . Now without going into full detailed explanation of the code , here we build toast box , then build icon , then build message , then assemble everything and put on the page . Then we make it appear . After that we add a timeout fuction that makes it disappear . 