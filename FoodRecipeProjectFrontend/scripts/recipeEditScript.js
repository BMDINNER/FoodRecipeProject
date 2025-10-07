if (sessionStorage.getItem('guestMode') === 'true') {
    document.body.classList.add('guest-mode');
}

document.addEventListener('DOMContentLoaded', () => {
    const recipeView = document.getElementById('recipe-view');
    const editButton = document.querySelector('.edit-recipe-button');
    let isEditing = false;

    if(document.body.classList.contains('guest-mode')){
    editButton.style.display = 'none';
    return;
    }

    editButton.addEventListener('click', async () => {
        const recipeId = sessionStorage.getItem('currentRecipeId');
        
        if (!isEditing) {
            // Enters edit mode
            if (!recipeId) {
                alert('Please search for a recipe first');
                return;
            }
            recipeView.readOnly = false;
            editButton.textContent = 'Save Changes';
            isEditing = true;
        } else {
            // Saves changes
            try {
                const recipeText = recipeView.value;
                const { name, ingredients, instructions } = parseRecipe(recipeText);
                
                const response = await fetch(`http://localhost:3500/recipes/${recipeId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, ingredients, instructions })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Update failed');
                }
                
                editButton.textContent = 'Changes saved!';
                recipeView.readOnly = true;
                isEditing = false;
                
                // Reverts back to "Edit Recipe" after 2 seconds
                setTimeout(() => {
                    editButton.textContent = 'Edit Recipe';
                }, 2000);
                
            } catch (error) {
                console.error('Edit error:', error);
                editButton.textContent = 'Error! Try Again';
                setTimeout(() => {
                    editButton.textContent = 'Save Changes';
                }, 2000);
            }
        }
    });

    function parseRecipe(text) {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        // Extracts recipe name from the text area
        const nameLine = lines.find(line => line.toLowerCase().includes('recipe name:'));
        if (!nameLine) throw new Error('Missing "Recipe Name:" in recipe');
        const name = nameLine.split(':')[1].trim();
        
        // Extracts ingredients from the text area
        const ingredientsIndex = lines.findIndex(line => line.toLowerCase().includes('ingredients:'));
        const instructionsIndex = lines.findIndex(line => line.toLowerCase().includes('instructions:'));
        
        if (ingredientsIndex === -1 || instructionsIndex === -1) {
            throw new Error('Recipe must include both Ingredients and Instructions sections');
        }
        
        const ingredients = lines
            .slice(ingredientsIndex + 1, instructionsIndex)
            .join('\n')
            .replace(/^-\s*/gm, ''); 
            
        const instructions = lines
            .slice(instructionsIndex + 1)
            .join('\n')
            .replace(/^\d+\.\s*/gm, ''); 
            
        return { name, ingredients, instructions };
    }
});