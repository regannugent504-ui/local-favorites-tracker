let myFavorite = {
    name: 'Ampersand on University Drive',
    category: 'coffee',
    rating: 5,
    notes: 'Great study spot with fast wifi',
    dateAdded: 'May 2026'
};

console.log(myFavorite.name);

let displayText = myFavorite.name + ' - Rating: ' + myFavorite.rating + '/5';
console.log(displayText);

let today = new Date().toLocaleDateString();
console.log(today);

console.log(myFavorite);
console.log(typeof myFavorite.name);
console.log(typeof myFavorite.rating);
