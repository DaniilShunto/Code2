// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CreateEventPayload } from '@opentalk/rest-api-rtk-query';
import React from 'react';
import { useState } from 'react';

import { useCreateEventMutation } from '../endpoints/events';

/**
 * Renders a component that can create new events
 */
const AddMeeting = () => {
  const initialState: CreateEventPayload = {
    title: '',
    description: '',
    isTimeIndependent: true,
    recurrencePattern: [],
  };
  const [meeting, setMeeting] = useState<CreateEventPayload>(initialState);
  const [addMeeting, { isLoading }] = useCreateEventMutation();

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setMeeting((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };
  const handleToggle = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setMeeting((prev) => ({
      ...prev,
      [target.name]: target.checked,
    }));
  };
  const handleTimeChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    let date: Date;
    const inputDate = target.value;
    if (typeof inputDate === 'string') {
      date = new Date(inputDate);
    } else if (inputDate === null) {
      date = new Date();
    } else {
      date = inputDate;
    }
    const datetime =
      'isAllDay' in meeting && meeting.isAllDay ? date.toISOString().split('T')[0] + 'T00:00:00Z' : date.toISOString();

    setMeeting((prev) => ({
      ...prev,
      [target.name]: { datetime, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    }));
  };

  const handleAddPost = async () => {
    await addMeeting(meeting).unwrap();
    setMeeting(initialState);
  };
  return (
    <div>
      <div>
        <label>
          title
          <input
            id="title"
            name="title"
            placeholder="Enter meeting title"
            value={meeting.title}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          description
          <input
            id="description"
            name="description"
            placeholder="Enter meeting description"
            value={meeting.description}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          isTimeIndependent
          <input
            type="checkbox"
            checked={meeting.isTimeIndependent}
            readOnly={true}
            id="isTimeIndependent"
            name="isTimeIndependent"
            // onChange={handleToggle}
          />
        </label>
      </div>
      {meeting.isTimeIndependent === false && (
        <>
          <div>
            <label>
              isAllDay
              <input
                type="checkbox"
                checked={meeting.isAllDay ?? false}
                id="isAllDay"
                name="isAllDay"
                onChange={handleToggle}
              />
            </label>
          </div>
          {meeting.isAllDay ? (
            <>
              <div>
                <label>
                  startsAt
                  <input
                    type="date"
                    name="startsAt"
                    value={meeting.startsAt?.datetime || ''}
                    onChange={handleTimeChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  endsAt
                  <input type="date" name="endsAt" value={meeting.endsAt?.datetime || ''} onChange={handleTimeChange} />
                </label>
              </div>
            </>
          ) : (
            <>
              <div>
                <label>
                  startsAt
                  <input
                    type="datetime-local"
                    name="startsAt"
                    value={meeting.startsAt?.datetime || ''}
                    onChange={handleTimeChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  endsAt
                  <input
                    type="datetime-local"
                    name="endsAt"
                    value={meeting.endsAt?.datetime || ''}
                    onChange={handleTimeChange}
                  />
                </label>
              </div>
            </>
          )}
        </>
      )}
      <div>
        <button disabled={isLoading} onClick={handleAddPost}>
          Add Meeting
        </button>
      </div>
    </div>
  );
};

export default AddMeeting;
