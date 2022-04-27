// DOM Objects
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

// CONST values
const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
]
let nextUrl = null;
let previousUrl = null;

//FUNCTIONS
const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

const resetScreen = () => {    
    mainScreen.classList.remove('hide');
    for(const type of TYPES) {
        mainScreen.classList.remove(type);
    }
}

// get data to load on the right screen
const fetchPokeList = url => {    
    fetch(url)
    .then(res => res.json())
    .then(data => {
        const { results, next, previous } = data;
        nextUrl = next;
        previousUrl = previous;
        pokeListItems.forEach((pokeListItem, index) => {
            const resultData = results[index];            
            if(resultData) {
                const { name, url } = resultData;
                const urlArr = url.split('/');
                const id = urlArr[urlArr.length-2];
                pokeListItem.textContent = id + '. ' + capitalize(name);
            } else {
                pokeListItem.textContent = '';
            }
        })
    })
}

// get data to load the left screen
const fetchPokeData = (id) => {    
    fetch('https://pokeapi.co/api/v2/pokemon/' + id)
    .then(res => res.json())
    .then(data => {
        resetScreen();

        const pokeTypes = data['types'];
        const pokeFirstType = pokeTypes[0];        
        pokeTypeOne.textContent = capitalize(pokeFirstType['type']['name']);

        const pokeSecondType = pokeTypes[1];
        if(pokeSecondType) {
            pokeTypeTwo.classList.remove('hide');
            pokeTypeTwo.textContent = capitalize(pokeSecondType['type']['name']);
        } else {
            pokeTypeTwo.classList.add('hide');
            pokeTypeTwo.textContent = '';
        }
        mainScreen.classList.add(pokeFirstType['type']['name']);
        pokeName.textContent = capitalize(data['name']);
        pokeId.textContent = `#${data['id'].toString().padStart(3, '0')}`;
        pokeWeight.textContent = data['weight'];
        pokeHeight.textContent = data['height'];
        
        pokeFrontImage.src = data.sprites['front_default'] || '';
        pokeBackImage.src = data.sprites['back_default'] || '';
    })
}

const handleRightButtonClick = () => {
    if(nextUrl) {
        fetchPokeList(nextUrl);
    }
}
const handleLeftButtonClick = () => {
    if(previousUrl) {
        fetchPokeList(previousUrl);
    }
}

const handleListItemClick = (e) => {
    if(!e.target) return;    
    const listItem = e.target;
    if(!listItem.textContent) return;
    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
}

// EVENT LISTENERS
leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);
pokeListItems.forEach((pokeListItem) => {
    pokeListItem.addEventListener('click', handleListItemClick)
})

// Window load
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');