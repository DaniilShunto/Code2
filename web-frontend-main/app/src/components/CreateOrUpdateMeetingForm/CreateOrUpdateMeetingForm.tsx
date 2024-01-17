// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Collapse, Grid, MenuItem, Stack, styled } from '@mui/material';
import {
  formikProps,
  formikDateTimePickerProps,
  FormWrapper,
  ForwardIcon,
  notificationAction,
  notifications,
  StreamingPlatform,
  formikMinimalProps,
} from '@opentalk/common';
import {
  CreateEventPayload,
  DateTime,
  Event,
  isTimelessEvent,
  SingleEvent,
  UpdateEventPayload,
} from '@opentalk/rest-api-rtk-query';
import { addMinutes, areIntervalsOverlapping, formatRFC3339, Interval } from 'date-fns';
import { useFormik } from 'formik';
import { FormikValues } from 'formik/dist/types';
import { isEmpty } from 'lodash';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import {
  useCreateEventMutation,
  useLazyGetEventsQuery,
  useUpdateEventMutation,
  useCreateEventSharedFolderMutation,
  useDeleteEventSharedFolderMutation,
  useAddStreamingTargetsMutation,
} from '../../api/rest';
import { LimitedTextField, Select } from '../../commonComponents';
import { useAppSelector } from '../../hooks';
import { selectFeatures } from '../../store/slices/configSlice';
import getReferrerRouterState from '../../utils/getReferrerRouterState';
import roundToUpper30 from '../../utils/roundToUpper30';
import { FrequencySelect, mapFrequencySelectToRRuleFrequency, mapRRuleToFrequencySelect } from '../../utils/rruleUtils';
import { isInvalidDate } from '../../utils/typeGuardUtils';
import yup from '../../utils/yupUtils';
import DateTimePicker from '../DateTimePicker';
import EventConflictDialog from './fragments/EventConflictDialog';
import LabeledSwitch from './fragments/LabeledSwitch';
import StreamingOptions from './fragments/StreamingOptions';

interface CreateOrUpdateMeetingFormProps {
  existingEvent?: Event;
  onForwardButtonClick?: () => void;
}

const Form = styled('form')({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const DEFAULT_MINUTES_DIFFERENCE = 30;
const MAX_CHARACTERS_TITLE = 255;
const MAX_CHARACTERS_PASSWORD = 255;
const MAX_CHARACTERS_DESCRIPTION = 4096;

interface Streaming {
  enabled: boolean;
  streamingTarget?: StreamingPlatform;
}
export interface CreateOrUpdateMeetingFormikValues {
  title?: string;
  description?: string;
  waitingRoom: boolean;
  password?: string;
  isTimeDependent: boolean;
  startDate: string;
  endDate: string;
  recurrencePattern: FrequencySelect;
  isAdhoc?: boolean;
  sharedFolder: boolean;
  streaming: Streaming;
}

const CreateOrUpdateMeetingForm = ({ existingEvent, onForwardButtonClick }: CreateOrUpdateMeetingFormProps) => {
  const { t } = useTranslation();
  const [createEvent, { isLoading: createEventIsLoading }] = useCreateEventMutation();
  const [updateEvent, { isLoading: updateEventIsLoading }] = useUpdateEventMutation();
  const [checkForEvents] = useLazyGetEventsQuery();
  const [createSharedFolder] = useCreateEventSharedFolderMutation();
  const [deleteSharedFolder] = useDeleteEventSharedFolderMutation();
  const [addStreamingTargets] = useAddStreamingTargetsMutation();

  const navigate = useNavigate();

  const [overlappingEvent, setOverlappingEvent] = useState<SingleEvent>();

  const defaultStartDate = roundToUpper30();
  const defaultEndDate = addMinutes(defaultStartDate, DEFAULT_MINUTES_DIFFERENCE);
  const features = useAppSelector(selectFeatures);
  const [isFirstTryToCreateSharedFolder, setIsFirstTryToCreateSharedFolder] = useState(true);
  const [isFirstTryToDeleteSharedFolder, setIsFirstTryToDeleteSharedFolder] = useState(true);
  const event = useRef<Event | undefined>(undefined);

  const validationSchema = yup.object({
    title: yup
      .string()
      .trim()
      .max(MAX_CHARACTERS_TITLE, t('form-validation-max-characters', { maxCharacters: MAX_CHARACTERS_TITLE }))
      .required(t('field-error-required', { fieldName: t('dashboard-meeting-textfield-title') })),
    password: yup
      .string()
      .trim()
      .max(MAX_CHARACTERS_PASSWORD, t('form-validation-max-characters', { maxCharacters: MAX_CHARACTERS_PASSWORD })),
    description: yup
      .string()
      .trim()
      .max(
        MAX_CHARACTERS_DESCRIPTION,
        t('form-validation-max-characters', { maxCharacters: MAX_CHARACTERS_DESCRIPTION })
      ),
    startDate: yup
      .string()
      .test('is required', t('meeting-required-start-date'), function (startDate) {
        if (!startDate || startDate.trim() === '') {
          return false;
        }
        return true;
      })
      .test('is valid', t('meeting-invalid-start-date'), function (startDate) {
        return !isInvalidDate(new Date(startDate as string));
      })
      .test('is in the future', t('dashboard-meeting-date-field-error-future'), function (startDate) {
        if (this.parent.isTimeDependent && startDate && new Date(startDate) < new Date()) {
          return false;
        }
        return true;
      })
      .test('is before end date', t('dashboard-meeting-date-field-error-duration'), function (startDate) {
        if (this.parent.isTimeDependent && startDate) {
          return startDate < this.parent.endDate;
        }
        return true;
      }),
    endDate: yup
      .string()
      .required(t('dashboard-meeting-date-field-error-invalid-value'))
      .test('is required', t('meeting-required-end-date'), function (endDate) {
        if (!endDate || endDate.trim() === '') {
          return false;
        }
        return true;
      })
      .test('is valid', t('meeting-invalid-end-date'), function (endDate) {
        return !isInvalidDate(new Date(endDate as string));
      })
      .test('if after start date', t('dashboard-meeting-date-field-error-duration'), function (endDate) {
        if (this.parent.isTimeDependent && endDate) {
          return endDate > this.parent.startDate;
        }
        return true;
      }),
    isAdhoc: yup.boolean().optional(),
    sharedFolder: yup.boolean().optional(),
    streaming: yup.object().shape({
      enabled: yup.boolean().required(),
      platform: yup.object().when('enabled', (value: boolean) => {
        if (!value) {
          return yup.object().optional();
        }
        //Initial implementation supports only 'custom' platform model
        return yup.object().shape({
          kind: yup.string().required(),
          name: yup.string().required(t('dashboard-meeting-livestream-platform-name-required')),
          streamingEndpoint: yup
            .string()
            .validateURL(t('dashboard-meeting-livestream-streaming-endpoint-invalid-url'))
            .required(t('dashboard-meeting-livestream-streaming-endpoint-required')),
          streamingKey: yup.string().required(t('dashboard-meeting-livestream-streaming-key-required')),
          publicURL: yup
            .string()
            .validateURL(t('dashboard-meeting-livestream-streaming-endpoint-invalid-url'))
            .required(t('dashboard-meeting-livestream-public-url-required')),
        });
      }),
    }),
  });

  const intervals = [
    {
      label: t('dashboard-meeting-recurrence-none'),
      value: FrequencySelect.NONE,
    },
    { label: t('dashboard-meeting-recurrence-daily'), value: FrequencySelect.DAILY },
    { label: t('dashboard-meeting-recurrence-weekly'), value: FrequencySelect.WEEKLY },
    { label: t('dashboard-meeting-recurrence-bi-weekly'), value: FrequencySelect.BIWEEKLY },
    { label: t('dashboard-meeting-recurrence-monthly'), value: FrequencySelect.MONTHLY },
  ];

  const formik = useFormik<CreateOrUpdateMeetingFormikValues>({
    initialValues: {
      title: existingEvent?.title,
      description: existingEvent?.description || '',
      waitingRoom: existingEvent?.room.waitingRoom || false,
      password: existingEvent?.room.password?.trim() || undefined,
      isTimeDependent: !existingEvent?.isTimeIndependent,
      startDate:
        (existingEvent && !isTimelessEvent(existingEvent) && existingEvent.startsAt?.datetime) ||
        formatRFC3339(defaultStartDate),
      endDate:
        (existingEvent && !isTimelessEvent(existingEvent) && existingEvent.endsAt?.datetime) ||
        formatRFC3339(defaultEndDate),
      recurrencePattern:
        (existingEvent &&
          !isEmpty(existingEvent.recurrencePattern) &&
          mapRRuleToFrequencySelect(existingEvent.recurrencePattern[0])) ||
        FrequencySelect.NONE,
      isAdhoc: existingEvent && Boolean(existingEvent.isAdhoc),
      sharedFolder: (existingEvent?.sharedFolder && Boolean(existingEvent.sharedFolder)) || false,
      streaming: {
        enabled: false,
      },
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (existingEvent) {
        await handleUpdateEvent(values);
      } else {
        await handleCreateEvent(values);
      }
    },
  });

  const onChangeStartDate = async (date: Date | null) => {
    if (!date) {
      await formik.setFieldValue('startDate', '');
      await formik.validateField('startDate');
      return;
    }

    if (isInvalidDate(date)) {
      await formik.setFieldValue('startDate', String(date));
      await formik.validateField('startDate');
      return;
    }

    await formik.setValues((values) => ({
      ...values,
      startDate: date.toISOString(),
      endDate: roundToUpper30(date).toISOString(),
    }));
    await formik.validateField('startDate');
    await formik.validateField('endDate');
  };

  const onChangeEndDate = async (endDate: Date | null) => {
    if (!endDate) {
      await formik.setFieldValue('endDate', '');
      await formik.validateField('endDate');
      return;
    }

    if (isInvalidDate(endDate)) {
      await formik.setFieldValue('endDate', String(endDate));
      await formik.validateField('endDate');
      return;
    }

    await formik.setFieldValue('endDate', endDate.toISOString());
    await formik.validateField('endDate');
  };

  const createPayload = (values: FormikValues): CreateEventPayload | UpdateEventPayload => {
    let payload: CreateEventPayload | UpdateEventPayload = {
      title: values.title.trim() || '',
      description: values.description.trim() || '',
      waitingRoom: values.waitingRoom,
      password: values.password?.trim() !== '' ? values.password?.trim() : null,
      isTimeIndependent: !values.isTimeDependent,
      recurrencePattern: [],
      isAdhoc: values.isAdhoc || false,
    };

    if (values.recurrencePattern && values.recurrencePattern !== FrequencySelect.NONE) {
      const pattern = `RRULE:${mapFrequencySelectToRRuleFrequency(values.recurrencePattern)}`;

      payload = {
        ...payload,
        recurrencePattern: pattern ? [pattern] : [],
      };
    }

    if (values.isTimeDependent) {
      payload = {
        ...payload,
        startsAt: {
          datetime: formatRFC3339(new Date(values.startDate)),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        endsAt: {
          datetime: formatRFC3339(new Date(values.endDate)),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        isAllDay: false,
      };
    }

    return payload;
  };

  const handleCreateEvent = async (values: FormikValues) => {
    const payload = createPayload(values) as CreateEventPayload;
    try {
      // prevents new events to be saved as a second event
      if (event.current === undefined) {
        event.current = await createEvent(payload).unwrap();
      }
      if (values.streaming.enabled) {
        await addStreamingTargets({ roomId: event.current.room.id, target: values.streaming.platform })
          .unwrap()
          .catch(() => notifications.error(t('streaming-targets-request-error')));
      }

      const goToNextStep = await handleCreateDeleteSharedFolder(event.current, values);
      if (goToNextStep === false) {
        return;
      }

      notifications.success(t('dashboard-meeting-notification-success-create', { event: event.current.title }));
      navigate(`/dashboard/meetings/update/${event.current.id}/1`, {
        state: { ...getReferrerRouterState(window.location) },
      });
    } catch (err) {
      notifications.error(t('dashboard-meeting-notification-error'));
    }
  };

  const handleUpdateEvent = async (values: FormikValues) => {
    const payload = createPayload(values) as UpdateEventPayload;
    try {
      if (existingEvent) {
        const goToNextStep = await handleCreateDeleteSharedFolder(existingEvent, values);
        if (goToNextStep === false) {
          return;
        }
        const event = await updateEvent({
          eventId: existingEvent.id,
          ...payload,
        }).unwrap();

        notifications.success(t('dashboard-meeting-notification-success-edit', { event: event.title }));
      }
    } catch (err) {
      notifications.error(t('dashboard-meeting-notification-error'));
    }
  };

  const handleCreateDeleteSharedFolder = async (event: Event, values: FormikValues) => {
    if (!event.sharedFolder && values.sharedFolder) {
      return handleCreateSharedFolder(event, values);
    }
    if (event.sharedFolder && !values.sharedFolder) {
      return handleDeleteSharedFolder(event, values);
    }
    return true;
  };

  const handleCreateSharedFolder = async (event: Event, values: FormikValues) => {
    if (isFirstTryToCreateSharedFolder) {
      try {
        setIsFirstTryToCreateSharedFolder(false);
        await createSharedFolder({ eventId: event.id }).unwrap();
      } catch (error) {
        notificationAction({
          msg: t('dashboard-meeting-shared-folder-create-error-message'),
          variant: 'error',
          actionBtnText: t('dashboard-meeting-shared-folder-error-retry-button'),
          cancelBtnText: t('dashboard-meeting-shared-folder-error-cancel-button'),
          persist: true,
          onAction: () => {
            formik.handleSubmit();
          },
          onCancel: () => {
            values.sharedFolder = false;
            setIsFirstTryToCreateSharedFolder(true);
          },
        });
        return false;
      }
    } else {
      try {
        await createSharedFolder({ eventId: event.id }).unwrap();
      } catch (error) {
        values.sharedFolder = false;
        notifications.error(t('dashboard-meeting-shared-folder-create-retry-error-message'));
        setIsFirstTryToCreateSharedFolder(true);
        return true;
      }
    }
    return true;
  };

  const handleDeleteSharedFolder = async (event: Event, values: FormikValues) => {
    if (isFirstTryToDeleteSharedFolder) {
      try {
        setIsFirstTryToDeleteSharedFolder(false);
        await deleteSharedFolder({ eventId: event.id, forceDeletion: false }).unwrap();
      } catch (error) {
        notificationAction({
          msg: t('dashboard-meeting-shared-folder-delete-error-message'),
          variant: 'error',
          actionBtnText: t('dashboard-meeting-shared-folder-error-retry-button'),
          cancelBtnText: t('dashboard-meeting-shared-folder-error-cancel-button'),
          persist: true,
          onAction: () => {
            formik.handleSubmit();
          },
          onCancel: () => {
            values.sharedFolder = true;
            setIsFirstTryToDeleteSharedFolder(true);
          },
        });
        return false;
      }
    } else {
      try {
        await deleteSharedFolder({ eventId: event.id, forceDeletion: false }).unwrap();
      } catch (error) {
        values.sharedFolder = true;
        notifications.error(t('dashboard-meeting-shared-folder-delete-retry-error-message'));
        setIsFirstTryToDeleteSharedFolder(true);
        return true;
      }
    }
    return true;
  };

  const handleConfirmSameTimeEvents = () => {
    setOverlappingEvent(undefined);
    formik.handleSubmit();
  };

  const handleSubmit = async () => {
    if (!formik.values.isTimeDependent) {
      formik.handleSubmit();
      return;
    }

    const overlappingEvent = await checkForOverlappingEvents();
    if (overlappingEvent) {
      setOverlappingEvent(overlappingEvent);
    } else {
      formik.handleSubmit();
    }
  };

  const checkForOverlappingEvents = async (): Promise<SingleEvent | undefined> => {
    const foundEvents = await checkForEvents({
      perPage: 2,
      timeMin: formik.values.startDate as DateTime,
      timeMax: formik.values.endDate as DateTime,
    });

    if (foundEvents && foundEvents.data && !isEmpty(foundEvents.data.data)) {
      const potentialOverlappingEvents = foundEvents.data.data as Array<SingleEvent>;

      const currentEventInterval: Interval = {
        start: new Date(formik.values.startDate),
        end: new Date(formik.values.endDate),
      };

      const validOverlappingEventFound = potentialOverlappingEvents.find((event) => {
        const overlappingEventInterval: Interval = {
          start: new Date(event.startsAt.datetime),
          end: new Date(event.endsAt.datetime),
        };

        return (
          areIntervalsOverlapping(currentEventInterval, overlappingEventInterval) &&
          (existingEvent ? event.id !== existingEvent.id : true)
        );
      });

      if (validOverlappingEventFound) {
        return validOverlappingEventFound;
      }
    }

    return undefined;
  };

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <LimitedTextField
            {...formikProps('title', formik)}
            label={t('dashboard-meeting-textfield-title')}
            placeholder={t('dashboard-meeting-textfield-title-placeholder')}
            fullWidth
            maxCharacters={MAX_CHARACTERS_TITLE}
          />

          <LimitedTextField
            {...formikProps('description', formik)}
            label={t('dashboard-meeting-textfield-details')}
            fullWidth
            variant="standard"
            multiline
            maxRows={5}
            placeholder={t('dashboard-meeting-textfield-details-placeholder')}
            maxCharacters={MAX_CHARACTERS_DESCRIPTION}
          />

          <LimitedTextField
            {...formikProps('password', formik)}
            label={t('dashboard-direct-meeting-password-label')}
            fullWidth
            placeholder={t('dashboard-direct-meeting-password-placeholder')}
            maxCharacters={MAX_CHARACTERS_PASSWORD}
          />

          <LabeledSwitch
            titleLabel={t('dashboard-meeting-date-and-time')}
            checked={formik.values.isTimeDependent}
            switchProps={formikMinimalProps('isTimeDependent', formik)}
            switchValueLabel={t(`dashboard-meeting-time-independent-${formik.values.isTimeDependent ? 'no' : 'yes'}`)}
          />

          <Collapse orientation="vertical" in={formik.values.isTimeDependent} unmountOnExit mountOnEnter>
            <Grid container columnSpacing={{ xs: 2, sm: 5 }}>
              <Grid item xs={12} sm={6}>
                <FormWrapper label={t('dashboard-meeting-date-from')} fullWidth>
                  <Stack spacing={2}>
                    <DateTimePicker
                      {...formikDateTimePickerProps('startDate', {
                        ...formik,
                        handleChange: onChangeStartDate as never,
                      })}
                    />
                  </Stack>
                </FormWrapper>
              </Grid>
              <Grid item xs={12} sm={6} mt={{ xs: 2, sm: 0 }}>
                <FormWrapper label={t('dashboard-meeting-date-to')} fullWidth>
                  <Stack spacing={2}>
                    <DateTimePicker
                      {...formikDateTimePickerProps('endDate', { ...formik, handleChange: onChangeEndDate as never })}
                    />
                  </Stack>
                </FormWrapper>
              </Grid>

              <Grid item xs={12} sm={12} mt={2}>
                <Select {...formikProps('recurrencePattern', formik)}>
                  {intervals.map((entry) => (
                    <MenuItem key={entry.label} value={entry.value}>
                      {entry.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Collapse>

          <LabeledSwitch
            titleLabel={t('waiting-room-participant-label')}
            checked={formik.values.waitingRoom}
            switchProps={formikMinimalProps('waitingRoom', formik)}
            switchValueLabel={t(`dashboard-meeting-switch-${formik.values.waitingRoom ? 'enabled' : 'disabled'}`)}
          />
          {features.sharedFolder && (
            <LabeledSwitch
              titleLabel={t('dashboard-meeting-shared-folder-label')}
              checked={formik.values.sharedFolder}
              switchProps={formikMinimalProps('sharedFolder', formik)}
              switchValueLabel={t(`dashboard-meeting-switch-${formik.values.sharedFolder ? 'enabled' : 'disabled'}`)}
            />
          )}

          {!existingEvent && <StreamingOptions formik={formik} />}
        </Stack>
        <Grid container item justifyContent={'space-between'} spacing={2}>
          <Grid item xs={12} sm={'auto'}>
            {existingEvent && (
              <Button variant={'text'} color={'secondary'} endIcon={<ForwardIcon />} onClick={onForwardButtonClick}>
                {t('dashboard-meeting-to-step', { step: 2 })}
              </Button>
            )}
          </Grid>
          <Grid container item xs={12} sm={'auto'} spacing={3} flexDirection={{ xs: 'column-reverse', sm: 'row' }}>
            {!existingEvent && (
              <Grid item>
                <Button component={Link} to={'/dashboard/'} variant={'outlined'} color={'secondary'} fullWidth>
                  {t('dashboard-direct-meeting-button-cancel')}
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button
                onClick={handleSubmit}
                fullWidth
                disabled={formik.isSubmitting || createEventIsLoading || updateEventIsLoading}
              >
                {t(`global-save${existingEvent ? '-changes' : ''}`)}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Form>
      {overlappingEvent && (
        <EventConflictDialog
          onConfirm={handleConfirmSameTimeEvents}
          onCancel={() => setOverlappingEvent(undefined)}
          event={overlappingEvent}
          isUpdate={Boolean(existingEvent)}
        />
      )}
    </>
  );
};

export default CreateOrUpdateMeetingForm;
