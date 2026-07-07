import { Controller, useFormContext } from 'react-hook-form';
import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ViolenceCategory } from '../../../../api/violence-categories.api';
import { translateCategory } from '../../../../api/violence-categories.api';
import { getViolenceCategoryIcon } from '../violenceCategoryIcons';
import type { NewCaseFormValues } from '../schema';

interface ViolenceTypeStepProps {
  categories: ViolenceCategory[];
}

export function ViolenceTypeStep({ categories }: ViolenceTypeStepProps) {
  const { i18n } = useTranslation();
  const { control } = useFormContext<NewCaseFormValues>();

  return (
    <Controller
      name="violenceCategoryId"
      control={control}
      render={({ field }) => (
        <Box className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((category) => {
            const Icon = getViolenceCategoryIcon(category.code);
            const selected = field.value === category.id;
            return (
              <Card
                key={category.id}
                variant="outlined"
                sx={selected ? { borderColor: 'primary.main', borderWidth: 2 } : undefined}
              >
                <CardActionArea
                  onClick={() => field.onChange(category.id)}
                  className="flex flex-col items-center gap-2 p-4"
                >
                  <Icon sx={{ fontSize: 48 }} color={selected ? 'primary' : 'action'} />
                  <Typography variant="body2" align="center">
                    {translateCategory(category, i18n.language)}
                  </Typography>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      )}
    />
  );
}
