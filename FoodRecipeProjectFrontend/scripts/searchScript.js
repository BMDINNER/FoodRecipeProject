/**
 * @file A module for searching and displaying recipes from a mongoDB database.
 * @module recipeSearch
 */

document.addEventListener('DOMContentLoaded', function() {
  /** @type {HTMLInputElement} The input element for recipe search */
  const searchInput = document.getElementById('input-box');
  
  /** @type {HTMLButtonElement} The button element to trigger recipe search */
  const searchButton = document.querySelector('.search-button');
  
  /** @type {HTMLTextAreaElement} The textarea element to display recipe details */
  const recipeView = document.getElementById('recipe-view');
  
  /** @type {Array<Object>} Array to store all recipe names loaded from server */
  let allRecipes = [];

  /**
   * Loads recipe names from the server and stores them in allRecipes array.
   * @async
   * @function loadRecipeNames
   * @throws {Error} When the server response is not OK or loading fails
   * @returns {Promise<void>}
   */
  async function loadRecipeNames() {
    try {
      const response = await fetch('http://localhost:3500/recipes/names');
      const result = await response.json();
      
      if (response.ok && result.success) {
        allRecipes = result.data;
        console.log('Recipes loaded:', allRecipes);
      } else {
        throw new Error(result.message || 'Failed to load recipes');
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
      allRecipes = [];
      alert('Error loading recipes. Please refresh the page.');
    }
  }

  /**
   * Searches for a recipe by name and displays the first matching result.
   * @async
   * @function searchAndDisplayRecipe
   * @throws {Error} When the search fails or no recipes are found
   * @returns {Promise<void>}
   */
  async function searchAndDisplayRecipe() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
      alert('Please enter a search term');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3500/recipes/search?name=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success || !result.data || result.data.length === 0) {
        alert('No recipes found matching your search');
        return;
      }

      // Display first matching recipe
      const recipe = result.data[0];
      displayRecipe(recipe);
      sessionStorage.setItem('currentRecipeId', recipe._id);
      
    } catch (error) {
      console.error('Search error:', error);
      alert(`Search failed: ${error.message}`);
    }
  }

  /**
   * Displays a recipe in the recipe view area.
   * @function displayRecipe
   * @param {Object} recipe - The recipe object to display
   * @param {string} recipe.name - The name of the recipe
   * @param {string} recipe.ingredients - The ingredients of the recipe
   * @param {string} recipe.instructions - The instructions for the recipe
   * @param {string} recipe._id - The unique identifier of the recipe
   * @returns {void}
   */
  function displayRecipe(recipe) {
    if (!recipe) return;
    
    recipeView.readOnly = true;
    recipeView.value = `Recipe Name: ${recipe.name}\n\nIngredients:\n${recipe.ingredients}\n\nInstructions:\n${recipe.instructions}`;
  }

  // Event listeners
  searchButton.addEventListener('click', searchAndDisplayRecipe);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchAndDisplayRecipe();
  });

  // Initialize
  loadRecipeNames();
});