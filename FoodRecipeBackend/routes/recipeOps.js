const express = require('express');
const router = express.Router();
const {
    getRecipe,
    getRecipeNames,
    searchRecipeByName,
    downloadRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe
} = require('../controllers/recipeController');

// Get all recipe names
router.get('/names', getRecipeNames);

// Search recipes by name
router.get('/search', searchRecipeByName);

// Get single recipe by ID
router.get('/:id', getRecipe);

// Download recipe as PDF
router.get('/:id/download', downloadRecipe);

// Create new recipe
router.post('/', createRecipe);

// Update recipe
router.put('/:id', updateRecipe);

// Delete recipe
router.delete('/:id', deleteRecipe);

module.exports = router;