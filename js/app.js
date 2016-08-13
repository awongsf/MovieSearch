$('form').submit(function (evt) {
	
	evt.preventDefault();

	var omdbAPI = "http://www.omdbapi.com/?";
	var searchValue = $("#search").val();
	var year = $("#year").val();
	var omdbOptions = {
		s: searchValue,
		y: year
	};

	function displayMovies(data) {

		console.log(data);

		var moviesHTML = '';

		if (data.Response === "True") {

			$.each(data.Search, function (i, movie) {

				moviesHTML += '<li><div class="poster-wrap"><a href="http://www.imdb.com/title/' + movie.imdbID + '">';

				if (movie.Poster === "N/A") {

					moviesHTML += '<i class="material-icons poster-placeholder">crop_original</i></a></div>';

				} else {

					moviesHTML += '<img class="movie-poster" src="' + movie.Poster + '"></a></div>';	

				}

				moviesHTML += '<span class="movie-title">' + movie.Title + '</span>';
				moviesHTML += '<span class="movie-year">' + movie.Year + '</span></li>';
			});

		} else if (data.Response === "False") {

			moviesHTML += '<li class="no-movies">';
			moviesHTML += '<i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchValue + '.';
			moviesHTML += '</li>';
		}

		$("#movies").html(moviesHTML);
	}

	$.getJSON(omdbAPI, omdbOptions, displayMovies);
});