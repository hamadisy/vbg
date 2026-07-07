import { Controller, useFormContext } from 'react-hook-form';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  ageRangeOptions,
  relationshipOptions,
  safetyRiskOptions,
  sexOptions,
  vulnerabilityFactorOptions,
} from '../schema';
import type { NewCaseFormValues } from '../schema';

export function VictimSituationStep() {
  const { t } = useTranslation();
  const { control, register } = useFormContext<NewCaseFormValues>();

  return (
    <Box className="flex flex-col gap-4">
      <TextField
        {...register('victim.alias')}
        label={t('newCase.fields.alias')}
        helperText={t('newCase.fields.aliasHelp')}
        fullWidth
      />

      <Controller
        name="victim.ageRange"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel>{t('newCase.fields.ageRange')}</InputLabel>
            <Select {...field} label={t('newCase.fields.ageRange')}>
              {ageRangeOptions.map((value) => (
                <MenuItem key={value} value={value}>
                  {t(`newCase.ageRange.${value}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="victim.sex"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel>{t('newCase.fields.sex')}</InputLabel>
            <Select {...field} label={t('newCase.fields.sex')}>
              {sexOptions.map((value) => (
                <MenuItem key={value} value={value}>
                  {t(`newCase.sex.${value}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <TextField
        {...register('victim.contactPhone')}
        label={t('newCase.fields.contactPhone')}
        helperText={t('newCase.fields.contactPhoneHelp')}
        fullWidth
      />

      <Controller
        name="victim.relationshipToPerpetrator"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel>{t('newCase.fields.relationshipToPerpetrator')}</InputLabel>
            <Select {...field} label={t('newCase.fields.relationshipToPerpetrator')}>
              {relationshipOptions.map((value) => (
                <MenuItem key={value} value={value}>
                  {t(`newCase.relationship.${value}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="victim.perpetratorKnown"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
              />
            }
            label={t('newCase.fields.perpetratorKnown')}
          />
        )}
      />

      <Controller
        name="victim.cohabitingWithPerpetrator"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
              />
            }
            label={t('newCase.fields.cohabitingWithPerpetrator')}
          />
        )}
      />

      <Controller
        name="victim.vulnerabilityFactors"
        control={control}
        render={({ field }) => (
          <FormControl component="fieldset">
            <FormLabel component="legend">{t('newCase.fields.vulnerabilityFactors')}</FormLabel>
            <FormGroup row>
              {vulnerabilityFactorOptions.map((value) => (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      checked={field.value?.includes(value) ?? false}
                      onChange={(event) => {
                        const current = field.value ?? [];
                        field.onChange(
                          event.target.checked
                            ? [...current, value]
                            : current.filter((v) => v !== value),
                        );
                      }}
                    />
                  }
                  label={t(`newCase.vulnerabilityFactor.${value}`)}
                />
              ))}
            </FormGroup>
          </FormControl>
        )}
      />

      <Controller
        name="victim.safetyRisk"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <FormLabel className="mb-1">{t('newCase.fields.safetyRisk')}</FormLabel>
            <ToggleButtonGroup
              value={field.value}
              exclusive
              onChange={(_event, value: string | null) => {
                if (value) field.onChange(value);
              }}
            >
              {safetyRiskOptions.map((value) => (
                <ToggleButton key={value} value={value}>
                  {t(`newCase.safetyRisk.${value}`)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </FormControl>
        )}
      />
    </Box>
  );
}
