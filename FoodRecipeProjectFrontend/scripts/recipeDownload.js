document.addEventListener('DOMContentLoaded', function () {
    const downloadBtn = document.querySelector('.download-recipe-button');

    downloadBtn.addEventListener('click', function () {
        const currentRecipeId = sessionStorage.getItem('currentRecipeId');
        if (!currentRecipeId) {
            alert('Please save or open a recipe before downloading.');
            return;
        }

        // Trigger download
        window.location.href = `http://localhost:3500/recipes/${currentRecipeId}/download`;
    });
});