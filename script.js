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
movieTriviaApp.userAnswer = "";

///////// ALL THE API CALLS ////////////
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
      // movieTriviaApp.functions.displayFinalMovie(results);
      movieTriviaApp.functions.startTrivia(results);
    })
    .catch(function () {
      alert("broke");
    });
};

//https://developers.themoviedb.org/3/discover/movie-discover
// https://www.themoviedb.org/talk/5bf18ceec3a36818bb06991d

//////////////// END OF API CALLS ///////////

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
  movieTriviaApp.htmlElements.genreBtnsContainer.hide();

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

    //use api to get movie info with cast for the trivia
    movieTriviaApp.getMovieInfo();
  });
};
//////////////////////////////////////////////////////////////////////
//focus input for ux, instead of mouse click
movieTriviaApp.functions.setFocusToInput = () => {
  movieTriviaApp.htmlElements.userInput.focus();
};

//list of questions
movieTriviaApp.listOfQuestions = [
  "Which year was the movie released?",
  "How long was the movie in minutes?",
  "What was the vote average by user? - Enter Number out of 10",
  "Does this movie belong in a movie series? - Enter Yes or No",
  "Name one cast member?",
  "Name one production company",
];

movieTriviaApp.questionInArray = 0;

//display question on page and show next question
movieTriviaApp.functions.showNextQuestion = () => {
  //set focus to input
  movieTriviaApp.functions.setFocusToInput();

  //if it is the last quesition in the array
  if (movieTriviaApp.questionInArray.length - 1) {
    console.log("last item");
  }
  //show next question
  movieTriviaApp.htmlElements.questionLabel.text(
    movieTriviaApp.listOfQuestions[movieTriviaApp.questionInArray]
  );
};

//user selects a movie, trivia begins
movieTriviaApp.functions.startTrivia = (finalMovieDetails) => {
  console.log(finalMovieDetails);

  //remove all the movies in the container
  movieTriviaApp.htmlElements.movieListContainer.empty();

  //display some movie details
  const finalMovie = `
    <div class="d-flex flex-column justify-content-center align-items-center mt-5 w-100">
      <img src="https://image.tmdb.org/t/p/w300/${finalMovieDetails.backdrop_path}" alt="" class="mb-2">
      <h6 class="mb-4">${finalMovieDetails.original_title}</h6>
    </div>
  `;
  movieTriviaApp.htmlElements.movieListContainer.append(finalMovie);

  //show trivia
  movieTriviaApp.htmlElements.triviaSection.show();

  //show first question
  movieTriviaApp.functions.showNextQuestion();

  //init form submit listner
  movieTriviaApp.functions.formSubmit(finalMovieDetails);
};

//added event lister to form
movieTriviaApp.functions.formSubmit = (finalMovieDetails) => {
  movieTriviaApp.htmlElements.userInputForm.on("submit", function (e) {
    e.preventDefault();

    //show Next Question
    movieTriviaApp.functions.showNextQuestion();

    movieTriviaApp.userAnswer = movieTriviaApp.htmlElements.userInput.val();

    if (!movieTriviaApp.userAnswer) {
      alert("input something fam");
    } else {
      console.log(movieTriviaApp.userAnswer);
      movieTriviaApp.functions.checkAnswer(finalMovieDetails);
    }
  });
};

//Game over show results
//show selected movies with year, cast , popularity, release date, vote_average, does it belong to a collection
movieTriviaApp.functions.gameOver = (showMoviesDetail) => {
  movieTriviaApp.htmlElements.userInputForm.hide();
  console.log(showMoviesDetail);

  const gameOverMovieDetails = `
    <div class="d-flex flex-column justify-content-center align-items-center mt-5 w-100">
       <p>${showMoviesDetail.finalMovieDetails.runtime} runtime,</p>
       <p>Company - ${showMoviesDetail.productionCompaniesArray}</p>
       <p>Cast - ${showMoviesDetail.movieCastsArray}</p>

       <p> Movie Release date -  ${showMoviesDetail.finalMovieDetails.release_date} </p>
       <p>${showMoviesDetail.finalMovieDetails.vote_average}</p>
    </div>
  `;
  movieTriviaApp.htmlElements.movieListContainer.append(gameOverMovieDetails);
};

/////////////////

//check if user input is correct
movieTriviaApp.functions.checkAnswer = (finalMovieDetails) => {
  // clear user input
  movieTriviaApp.htmlElements.userInput.val("");
  //change to game over on last question
  let gameOver = false;

  //vars so it could be passed to gameover function
  const movieCastsArray = [];

  finalMovieDetails.credits.cast.forEach((cast) => {
    movieCastsArray.push(cast.name.toLowerCase());
  });

  //join all the casts into an array
  movieCastsArray.join(", ");

  /// Production company
  const productionCompaniesArray = [];
  finalMovieDetails.production_companies.forEach((productionCompany) => {
    productionCompaniesArray.push(productionCompany.name.toLowerCase());
  });
  //join all the companies into an array
  productionCompaniesArray.join(", ");
  //////////////////////

  console.log(movieTriviaApp.userAnswer);

  // const questionIndexNumber = 0;
  switch (movieTriviaApp.questionInArray) {
    //Which Year was the movie released?
    case 0:
      // parseInt convert final movie release date just the year
      //finalMovie Grab Year and switch it to switch so it would match user input
      const movieReleaseYear = parseInt(
        finalMovieDetails.release_date
      ).toString();

      // Check QUESTION VS ANSWER
      if (movieReleaseYear === movieTriviaApp.userAnswer) {
        console.log("yes ur correct");
        movieTriviaApp.pointsCounter++;
      } else {
        console.log("nah fam");
      }

      break;

    //How long was the movie?
    case 1:
      //Check QUESTION VS ANSWER
      // console.log(finalMovieDetails.runtime, movieTriviaApp.userAnswer);
      if (finalMovieDetails.runtime.toString() === movieTriviaApp.userAnswer) {
        console.log("yes ur correct");
        movieTriviaApp.pointsCounter++;
      } else {
        console.log("nah fam");
      }
      break;

    // What was the vote average by user? - out of 10
    case 2:
      //Round Up or Down on vote and covert number to string to match user
      finalMovieDetails.vote_average = Math.round(
        finalMovieDetails.vote_average
      ).toString();

      //Check QUESTION VS ANSWER
      if (finalMovieDetails.vote_average === movieTriviaApp.userAnswer) {
        console.log("yes ur correct");
        movieTriviaApp.pointsCounter++;
      } else {
        console.log("nah fam");
      }

      break;

    // Belongs to a collection
    case 3:
      //check if the movie belongs to a collection, if so set as var as true;
      let movieSeriesTrueOrFalse = false;

      if (finalMovieDetails.belongs_to_collection) {
        movieSeriesTrueOrFalse = true;
      }
      //check user input,covert user input to boolean, yes or no
      let userAnswerYesOrNo = "";

      if (movieTriviaApp.userAnswer.toLowerCase() === "yes")
        userAnswerYesOrNo = true;

      if (movieTriviaApp.userAnswer.toLowerCase() === "no")
        userAnswerYesOrNo = false;

      //Check QUESTION VS ANSWER
      if (movieSeriesTrueOrFalse === userAnswerYesOrNo) {
        console.log(movieSeriesTrueOrFalse, userAnswerYesOrNo);
        movieTriviaApp.pointsCounter++;
      } else {
        console.log("nah fam");
      }

      break;
    // Name one cast member
    case 4:
      //check if user input is inside the array

      if (movieCastsArray.includes(movieTriviaApp.userAnswer.toLowerCase())) {
        console.log("yes ur correct");
        movieTriviaApp.pointsCounter++;
      } else {
        console.log("nah fam");
      }

      break;

    // Name production company
    case 5:
      console.log("production company 6");

      //check if user input is in the array
      if (
        productionCompaniesArray.includes(
          movieTriviaApp.userAnswer.toLowerCase()
        )
      ) {
        console.log("yes ur correct");
        movieTriviaApp.pointsCounter++;
      } else {
        console.log("nah fam");
      }

      //// SET GAME OVER
      console.log("game over");
      gameOver = true;
      movieTriviaApp.htmlElements.pointsCounterDisplay.html(`
         <h3>Thank you for playing, your final score is ${movieTriviaApp.pointsCounter} out of ${movieTriviaApp.listOfQuestions.length}</h3>
      `);

      //show final movie details
      movieTriviaApp.functions.gameOver({
        finalMovieDetails,
        movieCastsArray,
        productionCompaniesArray,
      });

      break;

    default:
      //when game is over show this.
      console.log("something is not right in the switch statement");
      break;
  }

  //show points if game is not over yet.
  if (!gameOver) {
    movieTriviaApp.htmlElements.pointsCounterDisplay.html(
      `${movieTriviaApp.pointsCounter} points so far`
    );
  }

  //Add one to array to move to the next question
  movieTriviaApp.questionInArray++;
  movieTriviaApp.functions.showNextQuestion();
};

movieTriviaApp.init = () => {
  movieTriviaApp.htmlElements.genreBtnsContainer = $(".genre-btns-container");
  movieTriviaApp.htmlElements.movieListContainer = $(".movie-list-container");
  movieTriviaApp.htmlElements.questionLabel = $("#question");
  movieTriviaApp.htmlElements.userInput = $("#userInput");
  movieTriviaApp.htmlElements.userInputForm = $("#userInputForm");
  movieTriviaApp.htmlElements.pointsCounterDisplay = $(".pointsCounter");
  movieTriviaApp.htmlElements.triviaSection = $(".trivia");

  //grab genre btns container
  movieTriviaApp.getGenres();
  //hide trivia section
  movieTriviaApp.htmlElements.triviaSection.hide();
};
$(function () {
  movieTriviaApp.init();
});
