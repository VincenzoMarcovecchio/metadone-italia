import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createLogEntry } from './Api';

const LogEntryForm = ({ location, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      await createLogEntry(data);
      onClose();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit(onSubmit)}
      className="entry__form"
    >
      {error ? <h3 className="error">{error}</h3> : null}
      <label htmlFor="titolo">Titolo:</label>
      <input required name="title" type="text" ref={register} />
      <label htmlFor="descrizione">Descrizione:</label>
      <textarea rows={3} name="description" ref={register} />
      <label htmlFor="visitDate">Segnalato il:</label>
      <input name="visitDate" type="date" required ref={register} />
      <button disabled={loading} type="submit">
        {loading ? 'Inviando segnalazione...' : 'Inviaci la tua segnalazione'}
      </button>
    </form>
  );
};

export default LogEntryForm;
