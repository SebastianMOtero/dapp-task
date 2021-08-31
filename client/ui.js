const taskForm = document.querySelector("#taskForm");

document.addEventListener("DOMContentLoaded", () => {
    App.init();
})
taskForm.addEventListener("submit", e => {
    // Disable refresh when click button from the form
    e.preventDefault();

    App.createTask(
        taskForm["title"].value, 
        taskForm["description"].value
    )
})