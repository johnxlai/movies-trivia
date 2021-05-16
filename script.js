const movieTriviaApp = {};
//keys
movieTriviaApp.htmlElements = {};
movieTriviaApp.functions = {};
movieTriviaApp.cssStyling = {};

//for the api
movieTriviaApp.genreSelectedId = 12;
movieTriviaApp.genreSelectedText = "";
movieTriviaApp.selectedMovieTitle = "";
movieTriviaApp.selectedMovieId = "";

//counter
movieTriviaApp.pointsCounter = 0;

//list of questions
movieTriviaApp.listOfQuestions = [
  "year",
  "runtime",
  "vote avger",
  "cast",
  "reverue",
];
movieTriviaApp.arrayOfAnswer = [];

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
    url: `https://api.themoviedb.org/3/discover/movie?api_key=${movieTriviaApp.apiKey}&with_genres=${movieTriviaApp.genreSelectedId}&language=en-US`,
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

//api call to get movie info from the selected movie
movieTriviaApp.getMovieInfo = () => {
  $.ajax({
    url: `https://api.themoviedb.org/3/movie/${movieTriviaApp.selectedMovieId}?api_key=${movieTriviaApp.apiKey}&append_to_response=credits`,
    methond: "GET",
    dataType: "json",
  })
    .then(function (results) {
      movieTriviaApp.functions.displayFinalMovie(results);
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
  $(".genre-button").on("click", function (e) {
    e.preventDefault();
    movieTriviaApp.genreSelectedId = $(this)[0].id;
    movieTriviaApp.genreSelectedText = $(this)[0].innerText;
    // console.log(
    //   movieTriviaApp.genreSelectedId,
    //   movieTriviaApp.genreSelectedText,
    //   "loopbtns"
    // );

    //call api to get movies on the selected genre
    movieTriviaApp.getMoviesSelectedGenre();
  });
};

//display selected movies
movieTriviaApp.displayMovies = (movieList) => {
  movieTriviaApp.htmlElements.movieListContainer.empty();
  movieList.forEach((movie) => {
    // console.log(movie);

    moviePoster = `
          <div class="movie-container">
            <a href="#" id="${movie.id}" class=" movie-title">
              <h3>${movie.original_title}</h3>
              <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="">
             </a>
          </div>
    `;

    movieTriviaApp.htmlElements.movieListContainer.append(moviePoster);
  });
  movieTriviaApp.functions.loopMoviesLink();
};

// add event listenr to all movies on display, grab the title and id that is selected by the user;
movieTriviaApp.functions.loopMoviesLink = () => {
  $(".movie-title").on("click", function (e) {
    e.preventDefault();

    movieTriviaApp.selectedMovieTitle = $(this)[0].firstElementChild.innerText;
    movieTriviaApp.selectedMovieId = $(this)[0].id;

    console.log(
      movieTriviaApp.selectedMovieTitle,
      movieTriviaApp.selectedMovieId
    );
    //use api to get movie info with cast for the trivia
    movieTriviaApp.getMovieInfo();
  });
};

//show selected movies with year, cast , popularity, release date, vote_average, does it belong to a collection
movieTriviaApp.functions.displayFinalMovie = (finalMovieDetails) => {
  movieTriviaApp.htmlElements.movieListContainer.empty();

  console.log(finalMovieDetails);

  // loop thru array for production companies
  const productionCompaniesArray = [];
  //should create if statement to check if exist
  finalMovieDetails.production_companies.forEach((productionCompany) => {
    productionCompaniesArray.push(productionCompany.name);
  });

  //loop thru array for cast members
  //should create if statement to check if exist
  const movieCastsArray = [];
  finalMovieDetails.credits.cast.forEach((cast) => {
    movieCastsArray.push(cast.name);
  });

  //if tehty didn't make money do say ddint' make any
  const movieRevenue = finalMovieDetails.revenue
    ? finalMovieDetails.revenue
    : "didnt make money";

  const finalMovie = `
    <div class="d-flex flex-column justify-content-center align-items-center">
      <img src="https://image.tmdb.org/t/p/w300/${
        finalMovieDetails.backdrop_path
      }" alt="">
        <h4>${finalMovieDetails.original_title}</h4>
       <p>${finalMovieDetails.runtime} runtime,</p>
       <p>Company - ${productionCompaniesArray.join(", ")}</p>
       <p>Cast - ${movieCastsArray.join(", ")}</p>

       <p> Movie Release date -  ${finalMovieDetails.release_date} </p>
       <p>${finalMovieDetails.vote_average}</p>
       <p>Revenue ${movieRevenue}</p>
    </div>
  `;
  movieTriviaApp.htmlElements.movieListContainer.append(finalMovie);
  movieTriviaApp.functions.startTrivia();
};

//user selects a movie, trivia begins
movieTriviaApp.functions.startTrivia = () => {
  movieTriviaApp.htmlElements.questionLabel.text(
    movieTriviaApp.listOfQuestions[0]
  );

  movieTriviaApp.functions.formSubmit();
};

//added event lister to form
movieTriviaApp.functions.formSubmit = () => {
  movieTriviaApp.htmlElements.userInputForm.on("submit", function (e) {
    e.preventDefault();

    movieTriviaApp.arrayOfAnswer = movieTriviaApp.htmlElements.userInput.val();

    if (!movieTriviaApp.arrayOfAnswer) {
      alert("input something fam");
    } else {
      console.log(movieTriviaApp.arrayOfAnswer);
      movieTriviaApp.functions.checkAnswer();
    }
  });
};
//check if user input is correct
movieTriviaApp.functions.checkAnswer = (finalMovieDetails) => {
  if (finalMovieDetails.runtime === movieTriviaApp.arrayOfAnswer) {
    console.log("yes ur correct");

    movieTriviaApp.pointsCounter++;
  } else {
    console.log("nah fam");
  }

  const result = `
  ${movieTriviaApp.pointsCounter} points so far
  );
  `;
  movieTriviaApp.htmlElements.pointsCounterDisplay.append(result);
  //show points
};

movieTriviaApp.init = () => {
  movieTriviaApp.getGenres();

  //grab genre btns container

  movieTriviaApp.htmlElements.genreBtnsContainer = $(".genre-btns-container");
  movieTriviaApp.htmlElements.movieListContainer = $(".movie-list-container");
  movieTriviaApp.htmlElements.questionLabel = $("#question");
  movieTriviaApp.htmlElements.userInput = $("#userInput");
  movieTriviaApp.htmlElements.userInputForm = $("#userInputForm");
  movieTriviaApp.htmlElements.pointsCounterDisplay = $(".pointsCounter");
};
$(function () {
  movieTriviaApp.init();
});
