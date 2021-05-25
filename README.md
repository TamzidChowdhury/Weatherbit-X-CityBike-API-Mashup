# Weatherbit-X-CityBike-API-Mashup

This project uses two seperate APIS two create a mashup between them.

## Requirements: 

1) When a end user visits the home page, your server send them a form to fill out.

2) When a end user submits the form, use the captured data to send the first API request.

3) Upon receiving the response from the first API request, your server will  parse the response and generate a request to the second API.

**You have to be careful here: the user cannot be the driver of this secondary request, if they have to interact with the page at all, (for example clicking a button) this is considered two separate requests and not two synchronous requests.  In the GitHub Jobs x Todoist mashup upon receiving a response from GitHub our application immediate contacts Todoist for the next phase.**

4) Upon receiving the response from the second API request, your server will parse the response and finally send results back to the end user.
