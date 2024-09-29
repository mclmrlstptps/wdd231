document.addEventListener('DOMContentLoaded', async () => {
    try {
        const members = await getMembers();
        displayMembers(members, 'grid'); // Set default view (grid)
    } catch (error) {
        console.error('Error:', error);
    }
});

async function getMembers() {
    const response = await fetch('data/members.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.members;
}

function displayMembers(members, view = 'grid') {
    const container = document.getElementById('members-container');
    if (!container) {
        throw new Error('Members container not found');
    }
    container.innerHTML = '';
    container.className = view + '-view'; // Set view (grid or list)

    members.forEach(member => {
        const card = document.createElement('div');
        if (view === 'grid') {
            card.className = 'member-card';
            card.innerHTML = `
                ${member.image ? `<img src="images/${member.image}" alt="${member.name} logo">` : ''}
                <h2>${member.name}</h2>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <p><a href="${member.website}" target="_blank">Website</a></p>
                <p>Membership Level: ${getMembershipLevel(member.membershipLevel)}</p>
                <p>Email: ${member.email ? member.email : 'N/A'}</p>
            `;
        } else if (view === 'list') {
            card.className = 'list-item'; // List view structure
            card.innerHTML = `
                <div>${member.name}</div>
                <div>${member.address}</div>
                <div>${member.phone}</div>
                <div><a href="${member.website}" target="_blank">Website</a></div>
            `;
        }
        container.appendChild(card);
    });
}

function getMembershipLevel(level) {
    switch (parseInt(level)) {
        case 1: return 'Member';
        case 2: return 'Silver';
        case 3: return 'Gold';
        default: return 'Unknown';
    }
}

function setFooterDates() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;
}

document.addEventListener('DOMContentLoaded', async () => {
    const members = await getMembers();
    displayMembers(members, 'grid'); // Default to grid view

    document.getElementById('grid-view').addEventListener('click', () => displayMembers(members, 'grid'));
    document.getElementById('list-view').addEventListener('click', () => displayMembers(members, 'list'));

    setFooterDates();
});
