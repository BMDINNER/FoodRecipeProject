/**
 * @file Recipe Controller for handling all recipe-related operations
 * @module controllers/recipeController
 * @requires ../model/Recipes
 * @requires fs
 * @requires path
 * @requires jspdf
 */


/**
 * Represents a Recipe document from MongoDB
 * @typedef {Object} Recipe
 * @property {string} _id - Recipe ID
 * @property {string} name - Recipe name
 * @property {string} ingredients - List of ingredients
 * @property {string} instructions - Cooking instructions
 * @property {string|null} [createdBy] - ID of user who created the recipe
 */

const Recipe = require('../model/Recipes');
const fs = require('fs');
const path = require('path');

/**
 * Deletes a recipe by ID
 * @async
 * @function deleteRecipe
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Recipe ID to delete
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns confirmation or error message
 * @throws {404} - If recipe is not found
 * @throws {500} - On server error
 */
const deleteRecipe = async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
        
        if (!deletedRecipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Recipe deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server error'
        });
    }
};

/**
 * Updates an existing recipe
 * @async
 * @function updateRecipe
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Recipe ID to update
 * @param {Object} req.body - Updated recipe data
 * @param {string} req.body.name - Updated recipe name
 * @param {string} req.body.ingredients - Updated ingredients
 * @param {string} req.body.instructions - Updated instructions
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns updated recipe or error
 * @throws {400} - If required fields are missing or duplicate name
 * @throws {404} - If recipe is not found
 * @throws {500} - On server error
 */
const updateRecipe = async (req, res) => {
    try {
        const { name, ingredients, instructions } = req.body;
        
        if (!name || !ingredients || !instructions) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { name, ingredients, instructions },
            { new: true, runValidators: true }
        );

        if (!updatedRecipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedRecipe,
            message: 'Recipe updated successfully'
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Recipe name already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: err.message || 'Server error'
        });
    }
};

/**
 * Gets a single recipe by ID
 * @async
 * @function getRecipe
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Recipe ID to retrieve
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns recipe data or error
 * @throws {404} - If recipe is not found
 * @throws {500} - On server error
 */
const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found!'
            });
        }
        res.status(200).json({
            success: true,
            data: recipe,
            message: 'Recipe retrieved successfully!'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server error occurred!'
        });
    }
};

/**
 * Gets all recipe names and IDs 
 * @async
 * @function getRecipeNames
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns array of recipe names/IDs
 * @throws {500} - On server error
 */
const getRecipeNames = async (req, res) => {
    try {
        const recipes = await Recipe.find({}, 'name _id');
        res.status(200).json({
            success: true,
            data: recipes,
            message: 'Recipe names retrieved successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server error occurred'
        });
    }
};

/**
 * Searches recipes by name using regex
 * @async
 * @function searchRecipeByName
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.name - Search term for recipe names
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns matching recipes or error
 * @throws {400} - If search term is missing
 * @throws {404} - If no recipes found
 * @throws {500} - On server error
 */
const searchRecipeByName = async (req, res) => {
    try {
        const searchTerm = req.query.name;
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term is required'
            });
        }

        const recipes = await Recipe.find({
            name: { $regex: searchTerm, $options: 'i' }
        });

        if (recipes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No recipes found matching your search'
            });
        }

        res.status(200).json({
            success: true,
            data: recipes,
            message: 'Recipes found'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Server error occurred'
        });
    }
};
/**
 * Generates and downloads a recipe as a PDF document
 * @async
 * @function downloadRecipe
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - MongoDB ID of the recipe to download
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Sends PDF file as attachment or JSON error response
 * @throws {400} - If recipe is not found
 * @throws {500} - If PDF generation fails
 * @example
 * // Client request example:
 * // GET /api/recipes/507f1f77bcf86cd799439011/download
 * 
 * // Successful response:
 * // Status: 200 OK
 * // Content-Type: application/pdf
 * // Content-Disposition: attachment; filename="Spaghetti Carbonara.pdf"
 * 
 * // Error response:
 * // Status: 400/500
 * // Content-Type: application/json
 * // { "success": false, "message": "Error message" }
 */
const downloadRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(400).json({ success: false, message: 'Recipe not found!' });
        }
        const { jsPDF } = require('jspdf');
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(recipe.name, 10, 10);
        doc.setFontSize(12);
        doc.text('Ingredients:', 10, 20);
        doc.text(recipe.ingredients, 10, 30);
        doc.text('Instructions:', 10, 50);
        doc.text(recipe.instructions, 10, 60);

        const pdfData = doc.output('arraybuffer');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${recipe.name}.pdf"`);
        res.send(Buffer.from(pdfData));
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Server error!' });
    }
}

/**
 * Creates a new recipe
 * @async
 * @function createRecipe
 * @param {Object} req - Express request object
 * @param {Object} req.body - New recipe data
 * @param {string} req.body.name - Recipe name
 * @param {string} req.body.ingredients - List of ingredients
 * @param {string} req.body.instructions - Cooking instructions
 * @param {string} [req.body.createdBy] - ID of user creating the recipe
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns created recipe or error
 * @throws {400} - If required fields are missing or duplicate name
 * @throws {500} - On server error
 */
const createRecipe = async (req, res) => {
    const { name, ingredients, instructions, createdBy } = req.body;

    if (!name || !ingredients || !instructions) {
        return res.status(400).json({ 
            success: false,
            message: 'Please provide name, ingredients, and instructions' 
        });
    }

    try {
        const newRecipe = new Recipe({
            name,
            ingredients,
            instructions,
            createdBy: createdBy || null
        });

        const savedRecipe = await newRecipe.save();
        
        res.status(201).json({
            success: true,
            data: savedRecipe,
            message: 'Recipe created successfully'
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Recipe name already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: err.message || 'Server error occurred'
        });
    }
};

module.exports = {
    getRecipe,
    getRecipeNames,
    searchRecipeByName,
    downloadRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe
};