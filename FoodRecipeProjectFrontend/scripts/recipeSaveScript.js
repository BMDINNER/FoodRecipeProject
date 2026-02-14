/**
 * @file Handles recipe management functionality including adding and saving new recipes.
 * @module recipeManager
 */

// Apply guest mode styling if enabled
if (sessionStorage.getItem('guestMode') === 'true') {
  document.body.classList.add('guest-mode');
}

document.addEventListener('DOMContentLoaded', function() {
  /** @type {HTMLTextAreaElement} The textarea element for recipe input/viewing */
  const recipeView = document.getElementById('recipe-view');
  
  /** @type {HTMLButtonElement} The button element for adding/saving recipes */
  const addRecipeButton = document.querySelector('.add-recipe-button');
  
  /** @type {boolean} Flag indicating whether the UI is in recipe addition mode */
  let isInAddMode = false;

  /**
   * Event listener for the add/save recipe button.
   * Toggles between add mode and save functionality based on current state.
   */
  addRecipeButton.addEventListener('click', function() {
    if (!isInAddMode) {
      enterAddMode();
    } else {
      saveNewRecipe();
    }
  });

  /**
   * Enters recipe addition mode by preparing the textarea for new recipe input.
   * @function enterAddMode
   */
  function enterAddMode() {
    recipeView.readOnly = false;
    recipeView.value = 'Recipe Name: \n\nIngredients:\n- \n\nInstructions:\n1. ';
    recipeView.focus();
    addRecipeButton.textContent = 'Save Recipe';
    addRecipeButton.classList.remove('saved', 'error');
    isInAddMode = true;
  }

  /**
   * Exits recipe addition mode and resets the UI to default state.
   * @function exitAddMode
   */
  function exitAddMode() {
    recipeView.readOnly = true;
    addRecipeButton.textContent = 'Add Recipe';
    addRecipeButton.classList.remove('saved', 'error');
    isInAddMode = false;
  }

  /**
   * Saves a new recipe to the server after validating and parsing the input.
   * @async
   * @function saveNewRecipe
   * @throws {Error} When recipe validation fails or server request fails
   * @returns {Promise<void>}
   */
  async function saveNewRecipe() {
    const recipeText = recipeView.value;
    const lines = recipeText.split('\n').filter(line => line.trim() !== '');

    // Parsing recipe name
    const nameLine = lines.find(line => line.toLowerCase().includes('recipe name:'));
    if (!nameLine) {
      showError('Include "Recipe Name:" in your recipe');
      return;
    }
    
    const name = nameLine.split(':').slice(1).join(':').trim();
    if (!name) {
      showError('Enter a recipe name after "Recipe Name:"');
      return;
    }

    // Parse ingredients and instructions
    const ingredientsIndex = lines.findIndex(line => line.toLowerCase().includes('ingredients:'));
    const instructionsIndex = lines.findIndex(line => line.toLowerCase().includes('instructions:'));

    if (ingredientsIndex === -1 || instructionsIndex === -1 || ingredientsIndex >= instructionsIndex) {
      showError('Include both Ingredients and Instructions sections in order');
      return;
    }

    const ingredients = lines.slice(ingredientsIndex + 1, instructionsIndex).join('\n');
    const instructions = lines.slice(instructionsIndex + 1).join('\n');

    try {
      addRecipeButton.textContent = 'Saving...';
      
      const response = await fetch('http://localhost:3500/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          ingredients,
          instructions
        })
      });

      let result = {};
      const contentType = response.headers.get('content-type');
      if(contentType && contentType.includes('application/json')){
        result = await response.json();
        currentRecipeId = result.data._id; 
        sessionStorage.setItem('currentRecipeId', currentRecipeId);
      } else {
        result = {message: await response.text()};
      }
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save recipe');
      }

      // Shows success feedback
      addRecipeButton.textContent = 'Recipe Saved!';
      addRecipeButton.classList.add('saved');
      setTimeout(exitAddMode, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      showError(error.message);
    }
  }

  /**
   * Displays an error message on the save button temporarily.
   * @function showError
   * @param {string} message - The error message to display
   */
  function showError(message) {
    addRecipeButton.textContent = `Error: ${message}`;
    addRecipeButton.classList.add('error');
    setTimeout(() => {
      addRecipeButton.textContent = 'Save Recipe';
      addRecipeButton.classList.remove('error');
    }, 2000);
  }
});