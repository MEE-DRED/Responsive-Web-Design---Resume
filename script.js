// Toggle navigation for main-toggle to allow navigation when mediaQuery is applied
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Form validation for name, email and a message to me
const form = document.getElementById('contactForm');
form.addEventListener('submit', function (e) {
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();
    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!name || !email || !message) {
        alert('All fields are required.');
        e.preventDefault();
    } else if (!emailPattern.test(email)) {
        alert('Please enter a valid email.');
        e.preventDefault();

        // For validation, all fields are required and form would not submit without all necessary details 
        if (!name.value.trim()) {
            alert('Please enter your name.');
            name.focus();
            e.preventDefault();
            return;
        }

        if (!email.value.includes('@')) {
            alert('Please enter a valid email address.');
            email.focus();
            e.preventDefault();
            return;
        }

        if (!message.value.trim()) {
            alert('Please enter your message.');
            message.focus();
            e.preventDefault();
            return;
        }

        alert('Form submitted successfully!');

    }

});
