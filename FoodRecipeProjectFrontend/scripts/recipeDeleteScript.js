if (sessionStorage.getItem('guestMode') === 'true') {
    document.body.classList.add('guest-mode');
}
document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.querySelector('.delete-recipe-button');
    const recipeView = document.getElementById('recipe-view');

    deleteButton.addEventListener('click', async () => {
        const recipeId = sessionStorage.getItem('currentRecipeId');
        if (!recipeId) {
            alert('No recipe selected');
            return;
        }

        if (!confirm('Permanently delete this recipe?')) return;

        try {
            const response = await fetch(`http://localhost:3500/recipes/${recipeId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Delete failed');
            
            recipeView.value = '';
            sessionStorage.removeItem('currentRecipeId');
            alert('Recipe deleted');
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete recipe');
        }
    });
});