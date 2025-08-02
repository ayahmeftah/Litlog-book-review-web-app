function init() {
    console.log('reached')
    var titleInput = document.querySelector("#titleInput")
    var authorInput = document.querySelector("#authorInput")
    var genreSelect = document.querySelector("#genreSelect")
    var booksContainer = document.querySelector(".books-container")
    var bookCards = booksContainer.querySelectorAll(".book-card")


    function filterBooks() {
        
        var title = titleInput.value.trim().toLowerCase()
        var author = authorInput.value.trim().toLowerCase()
        var genre = genreSelect.value.trim().toLowerCase()

        for (var i = 0; i < bookCards.length; i++) {
            var card = bookCards[i]
            var matchTitle = card.dataset.title.includes(title)
            var matchAuthor = card.dataset.author.includes(author)
            var matchGenre = genre === "" || card.dataset.genre === genre

            if (matchTitle && matchAuthor && matchGenre) {
                card.style.display = "block"
            } else {
                card.style.display = "none"
            }
        }
    }

    titleInput.addEventListener("input", filterBooks)
    authorInput.addEventListener("input", filterBooks)
    genreSelect.addEventListener("change", filterBooks)

}

document.addEventListener('DOMContentLoaded', init)
