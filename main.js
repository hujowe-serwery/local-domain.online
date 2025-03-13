async function fetchDomains() {
    try {
        const response = await fetch('domains.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayDomains(data);
    } catch (error) {
        console.error('Error fetching domains:', error);
        document.getElementById('result').innerHTML = `
            <div class="error">Error loading domains. Please try again later.</div>
        `;
    }
}

function createDomainList(items, listClass) {
    if (!items || items.length === 0) {
        if (listClass === 'verified-list') {
            return `<div class="template-message">No verified sites yet. Verified sites will appear here.</div>`;
        } else if (listClass === 'sites-list') {
            return `<div class="template-message">No public sites yet. Sites using our domain will appear here.</div>`;
        }
        return '';
    }
    
    let html = `<ul class="domain-list ${listClass}">`;
    
    items.forEach(item => {
        const icon = listClass === 'official-list' ? 
            `<span class="verified-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M12,11.99h7c-0.53,4.12-3.28,7.79-7,8.94V12H5V6.3l7-3.11V11.99z"/>
                </svg>
            </span>` :
            (listClass === 'verified-list' ? 
            `<span class="verified-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
            </span>` : '');

        html += `
            <li>
                <div class="domain-info">
                    <div class="domain-left">
                        ${icon}
                        <span class="domain-name">${item.domain}</span>
                    </div>
                    <a href="https://github.com/${item.repo}" target="_blank" class="repo-link">repo</a>
                </div>
                ${item.description ? `<div class="domain-description">${item.description}</div>` : ''}
                ${item.url ? `<div class="site-info">
                    <a href="${item.url}" target="_blank" class="site-link">Visit Site</a>
                </div>` : ''}
            </li>
        `;
    });
    
    html += `</ul>`;
    return html;
}

function displayDomains(data) {
    const resultElement = document.getElementById('result');
    
    let html = '';
    
    // Official Section
    if (data.official && data.official.length > 0) {
        html += `
            <div class="domain-section">
                <h2>Official</h2>
                ${createDomainList(data.official, 'official-list')}
            </div>
        `;
    }
    
    // Verified Section
    html += `
        <div class="domain-section">
            <h2>Verified Sites</h2>
            ${createDomainList(data.verified, 'verified-list')}
        </div>
    `;
    
    // Public Sites Section
    html += `
        <div class="domain-section">
            <h2>Public Sites</h2>
            ${createDomainList(data.sites, 'sites-list')}
        </div>
    `;
    
    resultElement.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', fetchDomains);