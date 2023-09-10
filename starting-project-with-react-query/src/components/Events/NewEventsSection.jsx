import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from '../utils/http.js';

export default function NewEventsSection() {

  // todo: read on staleTime and gcTime
  const {data, isError, error, isPending} = useQuery({
    queryKey: ['events'], // could contain multiple values, can also have object and arrays
    queryFn: fetchEvents,
    staleTime: 5000, // this controls after which time react query will send a behind the scene request to get updated data if it found a data
                    // in your cache and the default is 0, if you set it to 5000, it will wait for 5000ms seconds before sending another request
    //gcTime: 30000   // garbage collection time, this controls how long the data in the cache will be kept around and the default here is 5 mins => 50 000 ms
                      // but you can also update it to 3 min, 30000 ms
  });

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock title="An error occurred" message={error.info?.message || "Failed to fetch events"} />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
