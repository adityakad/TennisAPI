// API Configuration
const API_BASE_URL = window.location.origin;
const API_ENDPOINTS = {
    players: `${API_BASE_URL}/api/tennis/players`,
    matches: `${API_BASE_URL}/api/tennis/matches`
};

// State Management
let playersData = [];
let matchesData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadAllData();
    setupScrollEffects();
});

// Navigation Setup
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;
            switchSection(targetSection);
            
            // Update active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

// Switch between sections
function switchSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Load all data
async function loadAllData() {
    await Promise.all([
        loadPlayers(),
        loadMatches()
    ]);
}

// Fetch and display players
async function loadPlayers() {
    const loadingSpinner = document.getElementById('rankings-loading');
    const container = document.getElementById('rankings-container');
    const playerCount = document.getElementById('player-count');
    
    try {
        const response = await fetch(API_ENDPOINTS.players);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        playersData = await response.json();
        
        // Hide loading spinner
        loadingSpinner.classList.add('hidden');
        
        // Update player count
        animateCounter(playerCount, playersData.length);
        
        // Render players
        renderPlayers(playersData);
        
    } catch (error) {
        console.error('Error loading players:', error);
        loadingSpinner.innerHTML = `
            <div style="text-align: center; color: white;">
                <p style="font-size: 2rem; margin-bottom: 1rem;">⚠️</p>
                <p>Unable to load player rankings</p>
                <p style="font-size: 0.9rem; opacity: 0.7; margin-top: 0.5rem;">Please make sure the API is running</p>
            </div>
        `;
    }
}

// Render players in the UI
function renderPlayers(players) {
    const container = document.getElementById('rankings-container');
    container.innerHTML = '';
    
    // Sort players by rank
    const sortedPlayers = [...players].sort((a, b) => a.rank - b.rank);
    
    sortedPlayers.forEach((player, index) => {
        const card = createPlayerCard(player, index);
        container.appendChild(card);
    });
}

// Create a player card element
function createPlayerCard(player, index) {
    const card = document.createElement('div');
    card.className = 'player-card';
    
    // Determine medal class for top 3
    let medalClass = '';
    if (player.rank === 1) medalClass = 'gold';
    else if (player.rank === 2) medalClass = 'silver';
    else if (player.rank === 3) medalClass = 'bronze';
    
    card.innerHTML = `
        <div class="player-rank ${medalClass}">#${player.rank}</div>
        <div class="player-info">
            <h3 class="player-name">${player.name}</h3>
            <div class="player-details">
                <div class="detail-row">
                    <span class="detail-label">Rank</span>
                    <span class="detail-value">#${player.rank}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Points</span>
                    <span class="detail-value">${player.points.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Fetch and display matches
async function loadMatches() {
    const loadingSpinner = document.getElementById('matches-loading');
    const container = document.getElementById('matches-container');
    const matchCount = document.getElementById('match-count');
    
    try {
        const response = await fetch(API_ENDPOINTS.matches);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        matchesData = await response.json();
        
        // Hide loading spinner
        loadingSpinner.classList.add('hidden');
        
        // Update match count
        animateCounter(matchCount, matchesData.length);
        
        // Render matches
        renderMatches(matchesData);
        
    } catch (error) {
        console.error('Error loading matches:', error);
        loadingSpinner.innerHTML = `
            <div style="text-align: center; color: white;">
                <p style="font-size: 2rem; margin-bottom: 1rem;">⚠️</p>
                <p>Unable to load match results</p>
                <p style="font-size: 0.9rem; opacity: 0.7; margin-top: 0.5rem;">Please make sure the API is running</p>
            </div>
        `;
    }
}

// Render matches in the UI
function renderMatches(matches) {
    const container = document.getElementById('matches-container');
    container.innerHTML = '';
    
    if (matches.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: white; padding: 3rem;">
                <p style="font-size: 2rem; margin-bottom: 1rem;">🎾</p>
                <p style="font-size: 1.2rem;">No matches available</p>
            </div>
        `;
        return;
    }
    
    matches.forEach((match, index) => {
        const card = createMatchCard(match, index);
        container.appendChild(card);
    });
}

// Create a match card element
function createMatchCard(match, index) {
    const card = document.createElement('div');
    card.className = 'match-card';
    
    const player1IsWinner = match.winner.toLowerCase() === match.player1.toLowerCase();
    
    card.innerHTML = `
        <div class="match-header">
            <div class="match-date">Recent Match</div>
            <div class="match-status">Completed</div>
        </div>
        <div class="match-content">
            <div class="player ${player1IsWinner ? 'winner' : ''}">
                <div class="player-name-match">${match.player1}</div>
            </div>
            <div class="vs-divider">VS</div>
            <div class="player ${!player1IsWinner ? 'winner' : ''}">
                <div class="player-name-match">${match.player2}</div>
            </div>
        </div>
        <div class="match-score">
            <div class="score-label">Final Score</div>
            <div class="score-value">${match.score}</div>
        </div>
    `;
    
    return card;
}

// Animate counter from 0 to target value
function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16); // ~60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Scroll effects
function setupScrollEffects() {
    // Smooth scroll for footer links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Parallax effect on hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Refresh data periodically (every 30 seconds)
setInterval(() => {
    loadAllData();
}, 30000);

// Add error handling for network issues
window.addEventListener('online', () => {
    console.log('Connection restored, reloading data...');
    loadAllData();
});

window.addEventListener('offline', () => {
    console.warn('Connection lost. Please check your internet connection.');
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadPlayers,
        loadMatches,
        renderPlayers,
        renderMatches
    };
}
