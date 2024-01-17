// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Chip as MuiChip, FormHelperText, Grid } from '@mui/material';
import { styled } from '@mui/styles';
import { AddIcon } from '@opentalk/common';
import { FieldArray, Field, FieldProps, useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '../../../commonComponents/TextField';

interface IAnswersFormElementProps {
  name: string;
}

const Chip = styled(MuiChip)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  height: 'unset',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  '& .MuiChip-label': {
    textOverflow: 'unset',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
  },
}));

const Add = styled(AddIcon)({
  width: '0.6em',
  height: '0.6em',
});

const AnswersFormElement = ({ name }: IAnswersFormElementProps) => {
  const [editMode, setEditMode] = useState<number>();
  const inputRef = useRef<HTMLInputElement>(null);
  const { values, errors } = useFormikContext();
  const { t } = useTranslation();
  const error = get(errors, name, undefined);
  const hasError = Boolean(error);

  const choices = get(values, name, []);

  useEffect(() => {
    choices.forEach((item: string, index: number) => {
      if (isEmpty(item)) {
        setEditMode(index);
      }
    });
  }, [name, choices]);

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <Grid container spacing={1}>
          {choices.map((answer: string, index: number) => (
            <Grid item xs={12} key={index}>
              {editMode === index ? (
                <Field
                  name={`${name}.${index}`}
                  component={({ field: { value, onBlur, onChange, name } }: FieldProps) => (
                    <TextField
                      inputRef={inputRef}
                      name={name}
                      size={'small'}
                      fullWidth
                      defaultValue={value}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setEditMode(undefined);
                          onBlur && onBlur(e);
                          onChange && onChange(e);
                          if (isEmpty(inputRef.current?.value)) {
                            arrayHelpers.remove(index);
                          }
                        }
                      }}
                      onBlur={(e) => {
                        setEditMode(undefined);
                        onBlur && onBlur(e);
                        onChange && onChange(e);
                        if (isEmpty(e.target.value)) {
                          arrayHelpers.remove(index);
                        }
                      }}
                    />
                  )}
                />
              ) : (
                <Chip
                  label={choices[index]}
                  onClick={() => setEditMode(index)}
                  onDelete={() => arrayHelpers.remove(index)}
                />
              )}
            </Grid>
          ))}
          {editMode === undefined && (
            <Grid item>
              <Button
                size={'small'}
                type="button"
                variant={'text'}
                onClick={() => arrayHelpers.push('')}
                startIcon={<Add />}
              >
                {t('poll-input-choices')}
              </Button>
            </Grid>
          )}
          {hasError && (
            <Grid item xs={12}>
              <FormHelperText error={hasError}>{error}</FormHelperText>
            </Grid>
          )}
        </Grid>
      )}
    />
  );
};

export default AnswersFormElement;
