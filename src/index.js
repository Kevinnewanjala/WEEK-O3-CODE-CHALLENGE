document.addEventListener("DOMContentLoaded", function () {
    // URL of the JSON data
    const url = "http://localhost:3000/films";

    // Fetching data from the server (GET request)
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Extracting the films array from the data
        const films = data;
        // Displaying the details of the first film
        displayFilmDetails(films[0]);
        // Displaying the film menu on the left side of the page
        displayFilmMenu(films);
      })
      .catch((error) => console.error("Error fetching data:", error));

    // Function to display details of a film
    function displayFilmDetails(film) {
        // Getting references to DOM elements
        const title = document.getElementById("title");
        const runtime = document.getElementById("runtime");
        const filmInfo = document.getElementById("film-info");
        const showtime = document.getElementById("showtime");
        const ticketNumber = document.getElementById("ticket-num");
        const poster = document.getElementById("poster");
        const buyButton = document.getElementById("buy-ticket");

        // Updating DOM elements with film details
        title.textContent = film.title;
        runtime.textContent = film.runtime + " minutes";
        filmInfo.textContent = film.description;
        showtime.textContent = film.showtime;
        const remainingTickets = film.capacity - film.tickets_sold;
        ticketNumber.textContent = remainingTickets + " remaining tickets";
        poster.src = film.poster;

        // Checking if the movie is sold out
        if (remainingTickets === 0) {
            buyButton.textContent = "Sold Out";
            buyButton.disabled = true;
        } else {
            buyButton.textContent = "Buy Ticket";
            buyButton.disabled = false;
        }

        // Adding event listener to the "Buy Ticket" button
        buyButton.addEventListener("click", function () {
            // Checking if there are remaining tickets
            if (remainingTickets > 0) {
                // Incrementing tickets_sold and updating display
                film.tickets_sold++;
                displayFilmDetails(film);
                updateTicketSoldOnServer(film.id, film.tickets_sold);
                purchaseTicket(film.id);
            }
        });
    }

    // Function to display film menu on the left side of the page
    function displayFilmMenu(films) {
        // Getting reference to film list element
        const filmList = document.getElementById("films");

        // Looping through each film and creating a list item for it
        films.forEach(film => {
            const li = document.createElement("li");
            // Adding classes and text content to list item
            li.classList.add("film", "item");
            li.textContent = film.title;
            li.addEventListener("click", function () {
                displayFilmDetails(film);
            });

            // Adding delete button to delete a film
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", function(event) {
                event.stopPropagation();
                filmList.removeChild(li);
                deleteFilm(film.id);
            });
            li.appendChild(deleteButton);

            // Appending list item to film list
            filmList.appendChild(li);
        });
    }

    // Function to update tickets_sold on the server (PATCH Request)
    function updateTicketSoldOnServer(filmId, ticketsSold) {
        // Sending PATCH request to update tickets_sold
        fetch(`${url}/${filmId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tickets_sold: ticketsSold
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update tickets_sold on the server');
            }
            console.log(`Successfully updated tickets_sold for film ID: ${filmId} to ${ticketsSold}`);
        })
        .catch(error => console.error('Error updating tickets_sold on the server:', error));
    }

    // Function to simulate purchasing a ticket (POST request)
    function purchaseTicket(filmId) {
        // Sending POST request to simulate ticket purchase
        fetch(`${url}/${filmId}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to purchase ticket');
            }
            console.log('Ticket purchased successfully');
        })
        .catch(error => console.error('Error purchasing ticket:', error));
    }

    // Function to delete a film from the server (DELETE request)
    function deleteFilm(filmId) {
        // Sending DELETE request to delete the film
        fetch(`${url}/${filmId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete film');
            }
            console.log(`Film with ID ${filmId} deleted successfully`);
        })
        .catch(error => console.error('Error deleting film:', error));
    }

});
