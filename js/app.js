$('form').submit(function (evt) {
	
	evt.preventDefault();

	var omdbAPI = "http://www.omdbapi.com/?";
	var searchValue = $("#search").val();
	var year = $("#year").val();
	var omdbOptions = {
		s: searchValue,
		y: year
	};
	var imdbIDList = [];

	function displayMovies(data) {
		// DELETE WHEN COMPLETE
		console.log(data);

		var moviesHTML = '';

		if (data.Response === "True") {

			$.each(data.Search, function (i, movie) {

				moviesHTML += '<li><div class="poster-wrap">';

				if (movie.Poster === "N/A") {

					moviesHTML += '<a href="#"><i class="material-icons poster-placeholder">crop_original</i></a></div>';

				} else {

					moviesHTML += '<a href="#"><img class="movie-poster" src="' + movie.Poster + '"></a></div>';	

				}

				moviesHTML += '<span class="movie-title">' + movie.Title + '</span>';
				moviesHTML += '<span class="movie-year">' + movie.Year + '</span></li>';
				imdbIDList.push(movie.imdbID);
			});

		} else if (data.Response === "False") {

			moviesHTML += '<li class="no-movies">';
			moviesHTML += '<i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchValue + '.';
			moviesHTML += '</li>';
		}

		$("#movies").html(moviesHTML);
	}

	$.getJSON(omdbAPI, omdbOptions, displayMovies);

	$(document).on("click", ".poster-wrap", function() {

		var thisMovie = $(this).parent();
		var index = $("li").index(thisMovie);
		var imdbID = imdbIDList[index];

		$(".main-content").load('description-page.html');
		$("body > div:nth-child(2)").removeClass("main-content");

		var omdbMovieOptions = {
			i: imdbID
		};

		function displayMovieInfo(data) {
			// DELETE WHEN COMPLETE
			console.log(data);
			var descriptionMovieTitle = data.Title + " " + "(" + data.Year + ")";
			var imdbRating = "IMDB Rating: " + data.imdbRating;
			var imdbMoviePage = "http://www.imdb.com/title/" + data.imdbID;

			$(".movie-poster").attr("src", data.Poster);
			$(".description-movie-title").text(descriptionMovieTitle);
			$(".imdb-rating").text(imdbRating);
			$(".plot-description").text(data.Plot);
			$(".imdb-link > a").attr("href", imdbMoviePage);
		}

		$.getJSON(omdbAPI, omdbMovieOptions, displayMovieInfo)
	});

	$(document).on("click", ".search-results", function() {
		$("body > div:nth-child(2)").addClass("main-content");
		$(".description-page").remove();
		var movieListHTML = '<ul id="movies" class="movie-list"></ul>';
		$(".main-content").html(movieListHTML);
		$.getJSON(omdbAPI, omdbOptions, displayMovies);
	});

});