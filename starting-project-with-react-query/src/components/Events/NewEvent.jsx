import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation } from '@tanstack/react-query';
import { createNewEvent, queryClient } from '../utils/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ['create_new_event'],
    mutationFn: createNewEvent,
    onSuccess: () => {
      // to ensure that the data that is fetch is marked as stale and a refetch is triggered, 
      // we must @invalidate the data, that tell reactQuery that the data is outdated and must 
      // be refetched
      queryClient.invalidateQueries({queryKey:["events"]}) // exact:true 
      navigate("/events");
    }
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
    
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending ? (
          'Submitting...'
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            'Failed to create event. Please check your inputs and try again later.'
          }
        />
      )}
    </Modal>
  );
}
