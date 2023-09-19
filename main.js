let apiUrl = '';
const apiKey = 'c5a9b2bd';
const movieResults = document.getElementById('movie-results');
const paginationElement = document.getElementById('pagination');
const movieDetailsModal = document.getElementById('movie-details');
const movieDetailsContent = document.getElementById('movie-details-content');


window.addEventListener('DOMContentLoaded', function () {
   const form = document.getElementById('movie-search-form');
   const movieTitleIn = document.getElementById('movie-title');
   const movieTypeIn = document.getElementById('movie-type');

   form.addEventListener('submit', function (e) {
      e.preventDefault();
      const title = movieTitleIn.value;
      const type = movieTypeIn.value;

      apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${title}&type=${type}`;

      fetch(apiUrl)
         .then(response => response.json())
         .then(data => {
            if (data.Search) {
               renderMovies(data.Search);
               renderPagination(1, Math.ceil(data.totalResults / 10));
            } else {
               movieResults.innerHTML = '<p>No results found.</p>';
               paginationElement.innerHTML = '';
            }
         })
         .catch(error => {
            console.error('Error:', error);
            movieResults.innerHTML = '<p>An error occurred.</p>';
            paginationElement.innerHTML = '';
         });
   });
});

function renderMovies(movies) {
   movieResults.innerHTML = '';
   movies.forEach(movie => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('col-md-2', 'mb-3');
      movieElement.innerHTML = `
         <div class="card">
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title} Poster">
            <div class="card-body">
               <h5 class="card-title">${movie.Title}</h5>
               <p class="card-text">Type: ${movie.Type}</p>
               <button class="btn btn-primary btn-details" data-imdbid="${movie.imdbID}">Details</button>
            </div>
         </div>
      `;
      movieResults.appendChild(movieElement);
   });

   const detailsButtons = document.querySelectorAll('.btn-details');
   detailsButtons.forEach(button => {
      button.addEventListener('click', () => {
         const imdbID = button.getAttribute('data-imdbid');
         fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`)
            .then(response => response.json())
            .then(data => {
               renderMovieDetails(data);
               $('#movie-details').modal('show');
            })
            .catch(error => {
               console.error('Error:', error);
               movieDetailsContent.innerHTML = '<p>An error occurred while fetching movie details.</p>';
            });
      });
   });

}

function renderMovieDetails(movie) {
   movieDetailsContent.innerHTML = `
      <h2>${movie.Title}</h2>
      <p>Year: ${movie.Year}</p>
      <p>Genre: ${movie.Genre}</p>
      <p>Plot: ${movie.Plot}</p>
      <!-- Додайте інші деталі про фільм, які вас цікавлять -->
   `;
}


function renderPagination(currentPage, totalPages) {
   paginationElement.innerHTML = '';

   const maxButtonsToShow = 3;
   const ellipsisText = '...';

   for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= maxButtonsToShow) {
         const pageButton = document.createElement('button');
         pageButton.textContent = i;
         pageButton.addEventListener('click', () => {
            goToPage(i);
         });

         paginationElement.appendChild(pageButton);
      } else if (paginationElement.lastChild.textContent !== ellipsisText) {
         const ellipsis = document.createElement('span');
         ellipsis.textContent = ellipsisText;
         paginationElement.appendChild(ellipsis);
      }
   }
}

function goToPage(page) {
   const urlWithParams = `${apiUrl}&page=${page}`;

   fetch(urlWithParams)
      .then(response => response.json())
      .then(data => {
         if (data.Search) {
            renderMovies(data.Search);
         } else {
            movieResults.innerHTML = '<p>No results found.</p>';
         }
      })
      .catch(error => {
         console.error('Error:', error);
         movieResults.innerHTML = '<p>An error occurred.</p>';
      });
}