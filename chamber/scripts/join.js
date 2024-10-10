const timestamp = document.getElementById('timestamp');
timestamp.value = new Date().toLocaleString();


window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.membership-card');
    cards.forEach(card => card.classList.add('animate'));
});

const modals = document.querySelectorAll('.modal');
const links = document.querySelectorAll('#more-info-link');
const closeButtons = document.querySelectorAll('.close-btn');

links.forEach((link, index) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        modals[index].style.display = 'block';
    });
});

closeButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        modals[index].style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Animate membership cards
window.addEventListener('load', () => {
    document.querySelectorAll('.membership-card').forEach(card => {
        card.style.transition = 'opacity 1s ease-in-out, transform 1s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
});

