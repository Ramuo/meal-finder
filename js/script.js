const searchInput = document.getElementById('search');
const submit = document.getElementById('submit');
const randomBtn = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal');


// FUNCTIONS:
// Search meal and fetch from API

function searchMeal(e){
    e.preventDefault();

    //  clear single meal
    single_mealEl.innerHTML = '';

    // Get search term
    const term = search.value;

    // check for empty
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            resultHeading.innerHTML = `<h2>Résultat pour cette recherche '${term}':</h2>`;
            // if the searched meal === to null
            if(data.meals === null){
                resultHeading.innerHTML = `<p>Il n'y a pas de résultats pour cette recherche. Essayer à nouveau!</p> `;
            }else{
                meals.innerHTML = data.meals.map(meal => 
                    `<div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                `)
                .join('')
            }
    });
    //  clear search text
    search.value = '';
    }else{
        alert('Veuillez entrer une recette');
    }
}

// function fetch meal by ID

function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}
// function fetch meal randomly from API
function getRandomMeal(){
    // Clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}


//  Function Add meal to DOM
function addMealToDOM(meal){
    const ingredients = [];

    for(let i = 1; i <= 20; i++){
       if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
       } else{
            break
       }
    }
    single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Event Listerners

submit.addEventListener('submit', searchMeal, false);

// To the info when we click on a meal
mealsEl.addEventListener('click', e => {
    const path = e.path || (e.composedPath && e.composedPath());
    const mealInfo = path.find(item => {
      if (item.classList) {
        return item.classList.contains('meal-info');
      } else {
        return false;
      }
    });
    if(mealInfo){
        const mealID = e.target.closest('[data-mealid]').getAttribute('data-mealid');
        // const mealID = e.target.closest('.meal-info').dataset.mealid;
        // const mealID = e.target.closest('[data-mealid]').dataset.mealid;
        // const mealID = e.target.closest('div').dataset.mealid;

        getMealById(mealID);
    }
  });

// set up random meal fetch
randomBtn.addEventListener('click', getRandomMeal, false);
