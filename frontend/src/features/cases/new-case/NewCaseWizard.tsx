import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { newCaseDefaultValues, newCaseSchema } from './schema';
import type { NewCaseFormValues } from './schema';
import { createCase } from '../../../api/cases.api';
import { listRegions } from '../../../api/regions.api';
import { listViolenceCategories } from '../../../api/violence-categories.api';
import { listReferralStructures } from '../../../api/referral-structures.api';
import { ViolenceTypeStep } from './steps/ViolenceTypeStep';
import { LocationStep } from './steps/LocationStep';
import { DateTimeStep } from './steps/DateTimeStep';
import { VictimSituationStep } from './steps/VictimSituationStep';
import { DetailsStep } from './steps/DetailsStep';
import { ReferralStructureStep } from './steps/ReferralStructureStep';
import { ReviewStep } from './steps/ReviewStep';

const STEP_FIELDS: Path<NewCaseFormValues>[][] = [
  ['violenceCategoryId'],
  ['regionId', 'incidentAt'],
  [
    'victim.ageRange',
    'victim.sex',
    'victim.relationshipToPerpetrator',
    'victim.perpetratorKnown',
    'victim.cohabitingWithPerpetrator',
    'victim.safetyRisk',
  ],
  ['description'],
  ['referralStructureId'],
  [],
];

export function NewCaseWizard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const methods = useForm<NewCaseFormValues>({
    resolver: zodResolver(newCaseSchema),
    defaultValues: newCaseDefaultValues,
    mode: 'onBlur',
  });

  const regionsQuery = useQuery({ queryKey: ['regions'], queryFn: () => listRegions() });
  const categoriesQuery = useQuery({
    queryKey: ['violence-categories'],
    queryFn: () => listViolenceCategories(),
  });
  const selectedRegionId = methods.watch('regionId');
  const referralStructuresQuery = useQuery({
    queryKey: ['referral-structures', selectedRegionId],
    queryFn: () => listReferralStructures(selectedRegionId),
    enabled: !!selectedRegionId,
  });

  const createCaseMutation = useMutation({ mutationFn: createCase });

  const steps = useMemo(
    () => [
      {
        label: t('newCase.steps.violenceType'),
        content: <ViolenceTypeStep categories={categoriesQuery.data ?? []} />,
      },
      {
        label: t('newCase.steps.locationAndDate'),
        content: (
          <Box className="flex flex-col gap-4">
            <LocationStep regions={regionsQuery.data ?? []} />
            <DateTimeStep />
          </Box>
        ),
      },
      { label: t('newCase.steps.victimSituation'), content: <VictimSituationStep /> },
      { label: t('newCase.steps.details'), content: <DetailsStep /> },
      {
        label: t('newCase.steps.referralStructure'),
        content: <ReferralStructureStep referralStructures={referralStructuresQuery.data ?? []} />,
      },
      {
        label: t('newCase.steps.review'),
        content: (
          <ReviewStep
            categories={categoriesQuery.data ?? []}
            regions={regionsQuery.data ?? []}
            referralStructures={referralStructuresQuery.data ?? []}
          />
        ),
      },
    ],
    [t, categoriesQuery.data, regionsQuery.data, referralStructuresQuery.data],
  );

  const isLastStep = activeStep === steps.length - 1;

  const handleNext = async () => {
    const fields = STEP_FIELDS[activeStep];
    const valid = fields.length === 0 || (await methods.trigger(fields));
    if (valid) {
      setActiveStep((step) => step + 1);
    }
  };

  const handleBack = () => setActiveStep((step) => Math.max(0, step - 1));

  const onSubmit = async (values: NewCaseFormValues) => {
    setSubmitError(null);
    try {
      const created = await createCaseMutation.mutateAsync({
        ...values,
        incidentAt: dayjs(values.incidentAt).toISOString(),
      });
      void navigate('/', { state: { newCaseId: created.id } });
    } catch {
      setSubmitError(t('newCase.submitError'));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormProvider {...methods}>
        <Paper className="mx-auto max-w-2xl p-4 sm:p-6">
          <Typography variant="h5" className="mb-4">
            {t('newCase.title')}
          </Typography>
          {isMobile ? (
            <Box className="mb-6">
              <Stepper activeStep={activeStep} className="mb-2">
                {steps.map((step) => (
                  <Step key={step.label}>
                    <StepLabel slotProps={{ stepIcon: { sx: { fontSize: '1.5rem' } } }} />
                  </Step>
                ))}
              </Stepper>
              <Typography variant="subtitle2" color="text.secondary">
                {t('newCase.stepProgress', {
                  current: activeStep + 1,
                  total: steps.length,
                })}{' '}
                &middot; {steps[activeStep].label}
              </Typography>
            </Box>
          ) : (
            <Stepper activeStep={activeStep} alternativeLabel className="mb-6">
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          <Box className="min-h-60">{steps[activeStep].content}</Box>

          {submitError && (
            <Alert severity="error" className="mt-4">
              {submitError}
            </Alert>
          )}

          <Box className="mt-6 flex justify-between">
            <Button disabled={activeStep === 0} onClick={handleBack}>
              {t('newCase.back')}
            </Button>
            {isLastStep ? (
              <Button
                variant="contained"
                onClick={(event) => void methods.handleSubmit(onSubmit)(event)}
                disabled={createCaseMutation.isPending}
              >
                {t('newCase.submit')}
              </Button>
            ) : (
              <Button variant="contained" onClick={() => void handleNext()}>
                {t('newCase.next')}
              </Button>
            )}
          </Box>
        </Paper>
      </FormProvider>
    </LocalizationProvider>
  );
}
