let favorites = [];

const form = document.getElementById('add-favorite-form');
const favoritesList = document.getElementById('favorites-list');
const searchInput = document.getElementById('search-input');          
const categoryFilter = document.getElementById('category-filter');    
const nameError = document.getElementById('name-error');
const categoryError = document.getElementById('category-error');
const ratingError = document.getElementById('rating-error');
const ratingFilter = document.getElementById('rating-filter');
const favoritesCount = document.getElementById('favorites-count');
const clearAllButton = document.getElementById('clear-all');

function addFavorite(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const category = document.getElementById('category').value;
    const rating = document.getElementById('rating').value;

    nameError.textContent = '';
    categoryError.textContent = '';
    ratingError.textContent = '';

    let isValid = true;
    if (!name) { nameError.textContent = 'Please enter a name.'; isValid = false; }
    if (!category) { categoryError.textContent = 'Please choose a category.'; isValid = false; }
    if (!rating) { ratingError.textContent = 'Please choose a rating.'; isValid = false; }
    if (!isValid) return;

    const newFavorite = {
        name: name,
        category: category,
        rating: parseInt(rating),
        notes: document.getElementById('notes').value.trim(),
        dateAdded: new Date().toLocaleDateString()
    };

    favorites.push(newFavorite);
    saveFavorites();
    form.reset();
    displayFavorites();
}

form.addEventListener('submit', addFavorite);

function displayFavorites() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    ratingFilter.value = 'all';   
    searchFavorites();
}


function searchFavorites() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedRating = ratingFilter.value;

    const filtered = favorites.filter(function(favorite) {
        const matchesSearch = searchText === '' ||
            favorite.name.toLowerCase().includes(searchText) ||
            favorite.notes.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === 'all' ||
            favorite.category === selectedCategory;
        const matchesRating = selectedRating === 'all' ||
            favorite.rating === Number(selectedRating);      
        return matchesSearch && matchesCategory && matchesRating;

    });
    if (filtered.length === favorites.length) {
        favoritesCount.textContent = `You have ${favorites.length} favorite${favorites.length === 1 ? '' : 's'}`;
    } else {
        favoritesCount.textContent = `Showing ${filtered.length} of ${favorites.length} favorites`;
    }

    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="empty-message">No favorites yet. Add your first favorite place above!</p>';
        return;
    }

    if (filtered.length === 0) {
        favoritesList.innerHTML = '<p class="empty-message">No favorites match your search.</p>';
        return;
    }

    filtered.forEach(function(favorite) {
        const index = favorites.indexOf(favorite);
        const stars = '⭐'.repeat(favorite.rating);
        favoritesList.innerHTML += `
            <div class="favorite-card">
                <h3>${favorite.name}</h3>
                <span class="favorite-category category-${favorite.category.toLowerCase()}">${favorite.category}</span> 
                <div class="favorite-rating">${stars} (${favorite.rating}/5)</div>
                <p class="favorite-notes">${favorite.notes}</p>
                <p class="favorite-date">Added: ${favorite.dateAdded}</p>
                <button class="btn-danger" onclick="deleteFavorite(${index})">Delete</button>
            </div>`;
    });
}


function deleteFavorite(index) {
    const favorite = favorites[index];
    if (confirm(`Delete "${favorite.name}"?`)) {
        favorites.splice(index, 1); saveFavorites();
        searchFavorites();   // keeps the current search/filter
    }
}
function clearAll() {
    if (favorites.length === 0) return;
    if (confirm('Delete ALL favorites? This cannot be undone.')) {
        favorites = [];
        saveFavorites();
        displayFavorites();
    }
}
clearAllButton.addEventListener('click', clearAll);

searchInput.addEventListener('input', searchFavorites);
categoryFilter.addEventListener('change', searchFavorites);
ratingFilter.addEventListener('change', searchFavorites);   

function saveFavorites() {
    try {
        localStorage.setItem('localFavorites', JSON.stringify(favorites));
    } catch (error) {
        alert('Unable to save favorites. Storage may be disabled.');
    }
}
function loadFavorites() {
    try {
        const saved = localStorage.getItem('localFavorites');
        if (saved) {
            favorites = JSON.parse(saved);
        } else {
            favorites = [];
        }
    } catch (error) {
        favorites = [];
    }
}

loadFavorites();
displayFavorites();
