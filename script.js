const movieTriviaApp = {};
movieTriviaApp.htmlElements = {};
movieTriviaApp.functions = {};
movieTriviaApp.cssStyling = {};
movieTriviaApp.genreSelectedId = 12;
movieTriviaApp.genreSelectedText = "";

//get genre
//api.themoviedb.org/3/genre/movie/list?api_key=<<api_key>>&language=en-US
movieTriviaApp.apiKey = "3c9a01ae287e63be5b9af537e6b1b3e3";
movieTriviaApp.getGenres = () => {
  $.ajax({
    url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${movieTriviaApp.apiKey}&language=en-US`,
    methond: "GET",
    dataType: "json",
  })
    .then(function (results) {
      movieTriviaApp.displayGenres(results.genres);
    })
    .catch(function () {
      alert("broke");
    });
};

//Api call for the selected genre
movieTriviaApp.getMoviesSelectedGenre = () => {
  $.ajax({
    url: `https://api.themoviedb.org/3/discover/movie?api_key=${movieTriviaApp.apiKey}&with_genres=${movieTriviaApp.genreSelectedId}`,
    methond: "GET",
    dataType: "json",
  })
    .then(function (results) {
      movieTriviaApp.displayMovies(results.results);
    })
    .catch(function () {
      alert("broke");
    });
};

//https://developers.themoviedb.org/3/discover/movie-discover
// https://www.themoviedb.org/talk/5bf18ceec3a36818bb06991d
//display genre buttons
movieTriviaApp.displayGenres = (genres) => {
  genres.forEach((genre) => {
    let htmlButton = `
       <button id="${genre.id}" class="${genre.name} genre-button" type="button" >${genre.name}</button>
    `;

    movieTriviaApp.htmlElements.genreBtnsContainer.append(htmlButton);
  });

  movieTriviaApp.functions.loopBtns();
};

//when user selects genre, call api choose 10 movies
//add event listener to all the buttons and on click grab the save the value of the selected button
movieTriviaApp.functions.loopBtns = () => {
  // console.log(genreBtns);
  $(".genre-button").on("click", function () {
    movieTriviaApp.genreSelectedId = $(this)[0].id;
    movieTriviaApp.genreSelectedText = $(this)[0].innerText;
    console.log(
      movieTriviaApp.genreSelectedId,
      movieTriviaApp.genreSelectedText,
      "loopbtns"
    );
    movieTriviaApp.getMoviesSelectedGenre();
  });
};

//display selected movies

movieTriviaApp.displayMovies = (movieList) => {
  movieList.forEach((movie) => {
    console.log(movie);

    moviePoster = `
          <div>
            <h3>${movie.original_title}</h3>
             <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="">
            </div>
    `;

    movieTriviaApp.htmlElements.movieListContainer.append(moviePoster);
  });
};

// display the 10 movies

//user selects a movie, trivia begins

//

movieTriviaApp.init = () => {
  movieTriviaApp.getGenres();

  //grab genre btns container

  movieTriviaApp.htmlElements.genreBtnsContainer = $(".genre-btns-container");
  movieTriviaApp.htmlElements.movieListContainer = $(".movie-list-container");
};
$(function () {
  movieTriviaApp.init();
});
