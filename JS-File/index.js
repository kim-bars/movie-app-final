

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// GLOBAL VARIABLES ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

const moviesURL = "https://giddy-chalk-horse.glitch.me/movies";


////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// DOCUMENT READY ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
    renderMovies();
});


async function getMovies() {
    let url = moviesURL;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderMovies() {
    let movies = await getMovies();
    let html = '';
    movies.forEach((movie, index) => {

        let htmlSegment = `
            <div class="col-4">
                <div class="card">
                <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" class="card-img-top" alt="movie Poster">
                    <div class="card-body">
                        <h3 class="card-title test-center">${movie.name ? movie.name : ''}</h3>
                        <p class="middle card-text pb-0 lead">Movie rating: ${movie.ratings ?? movie.ratings}</p>
                        <p class="middle card-text pt-0">${movie.overview ? movie.overview: ''}</p>
                        <a href="#" data-id="${movie.id ?? movie.id}" class="delete-button btn x-grey white">Delete</a>
                        <a href="#" data-id="${movie.id ?? movie.id}" class="edit-button btn x-grey white">Edit</a>
                    </div>
                </div>
                <div class="edit-form" style="visibility: hidden">
                   <input class="editTitle" value="${movie.name ?? movie.name}" placeholder="title">
                   <input class="editRating" value ="${movie.ratings ?? movie.ratings}" placeholder="rating">
                   <input class="editOverview" value ="${movie.overview ?? movie.overview}" placeholder="EditOverview">
                   <button data-id="${movie.id ?? movie.id}" class="edit-submit-button sub-1">Submit</button>
                </div>
          </div>
          `
        

        html += htmlSegment;
    });
    $('.middle').html(html)
}



////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// DOCUMENT READY ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

//delete user
$(document).on('click', ".delete-button", function(e){
    e.preventDefault();
    let cardID = $(this).attr('data-id')
    console.log(cardID);

//Post to movies array

    const deleteOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'}
    }


    fetch(`${moviesURL}/${cardID}`, deleteOptions)
        .then(renderMovies);/* review was created successfully */

// fix how to fully delete without refreshing
})


////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Edit Feature on card  ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


$(document).on('click', ".edit-button", function (e){
    e.preventDefault();
    $('.edit-form').css("visibility", 'visible');
})

$(document).on('click', ".edit-button", function (e){
    e.preventDefault();
    $('.edit-form').css("visibility", 'visible');
})



$(document).on('click', ".edit-submit-button", function(e) {
    e.preventDefault();
    let $cardParent = $(this).parent();
    let editTitle = $cardParent.find('.editTitle').val();
    let editRating = $cardParent.find('.editRating').val();
    let editOverview = $cardParent.find('.editOverview').val();
    let editID = $(this).attr('data-id');
    console.log(editID);

    const moviesToEdit = {
        name: `${editTitle}`,
        ratings: `${editRating}`,
        overview:  `${editOverview}`,
    };
    console.log('The edited movie data follows:');
    console.log(moviesToEdit);



    const editOptions = {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json'},
        body: JSON.stringify(moviesToEdit)
    }

    fetch(`${moviesURL}/${editID}`, editOptions)
        .then(renderMovies);/* review was created successfully */
})





////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// API CALL ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// search-movies
$("#search-movies").keyup(function (e){
    e.preventDefault();
    if(e.key ==' ' || e.key == "enter") {
        // $(this).val()
        console.log($("#search-movies").val());
        let usersMovieSearch = $("#search-movies").val().toLowerCase();
        // usersMovieSearch = $('#search-movies').val();
        moviesInput(usersMovieSearch);
    }
})



//getting the information from the user
 function moviesInput(userInput) {
 console.log(userInput)
     let movies;
    // try {
    //  await
     fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TBMI_API}&language=en-US&query=${userInput}&page=1&include_adult=false`).then(res => res.json()).then(data => {
         let x = gettingIds(data);
         let movies = displayonmodule(x);
     })
        // return await res.json();
    console.log(movies);
     // }
    // catch (error) {
    //     console.log(error);
    // }


}

//putting the data into an array
function gettingIds(movieData) {
    let movieResults = movieData;

        console.log(movieResults)
        let y = [];
        let z ='';
        for (let i = 0; i < 5; i++) {
           y.push(movieResults.results[i]);
        }
        console.log(y)
        return y;

}

//formation of image in Modal
function displayonmodule(arrayMovies){
    let moviesToPick = arrayMovies;
    console.log(moviesToPick)
    let html = '';
    moviesToPick.forEach((movie, index) => {

        let htmlSegment = `<div class="card mb-3 w-70">
            <img class="click-btn" data-bs-dismiss="modal" src="https://image.tmdb.org/t/p/original${movie.poster_path}" data-movie-id="${movie.id}">
        </div>
        

`

        html += htmlSegment;
    });
    $('.modal-body').append(html)
}

;

//get and post request from API to server:
async function getMoviefromAPIWithClickID(iDFromUser) {
    try {
        let res = await fetch(`https://api.themoviedb.org/3/movie/${iDFromUser}?api_key=${TBMI_API}`)
        // .then(response => response.json())
        // .then(response => console.log(response))
        // .catch(err => console.error(err));
        let movieInfo =  await res.json();

        //=====================================================
        console.log(movieInfo)
        const movieInput = movieInfo;
        const movieObject = {
            name: `${movieInput.title}`,
            poster_path: `${movieInput.poster_path}`,
            overview: `${movieInput.overview}`,
            ratings: `${movieInput.vote_average}`
        }
        const postIntoArray = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movieObject)
        }
        // console.log(postIntoArray)
        function getMovies2() {
            fetch(moviesURL, postIntoArray)
                .then(renderMovies()) /* review was created successfully */
                .catch(error => console.error(error)); /* handle errors */

        }
        await getMovies2();
        await renderMovies();

    } catch (error) {
        console.log(error);
    }

}

//Event Listener of From the picture
let movieId= '';
$(document).on('click', ".click-btn", function(e) {
    e.preventDefault();
    const valu = $(this).attr('data-movie-id');
    console.log(valu)
    getMoviefromAPIWithClickID(valu*1);



})






