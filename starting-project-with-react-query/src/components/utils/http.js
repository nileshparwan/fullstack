/**
 * ReactQuery by default passes an object to your @fetchEvents function, 
 * and the data is an object that gives us the information of the queryKey
 * that was used for that query and a @signal and that signal is required 
 * for aborting that request if for example you navigate away from this page
 * before the request was finished
 */


export async function fetchEvents({signal, searchTerm}) {
  let url = "http://localhost:3000/events"; 

  if (searchTerm) {
    url += "?search=" + searchTerm; 
  }

  const response = await fetch(url, {signal});

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}