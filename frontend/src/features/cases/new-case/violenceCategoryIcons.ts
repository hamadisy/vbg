import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HealingIcon from '@mui/icons-material/Healing';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LandscapeIcon from '@mui/icons-material/Landscape';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import HelpIcon from '@mui/icons-material/Help';

type IconComponent = ComponentType<SvgIconProps>;

// Fallback icon set, used for categories with no pictogram artwork yet.
const ICONS_BY_CODE: Record<string, IconComponent> = {
  PHYSICAL: HealingIcon,
  SEXUAL: ReportProblemIcon,
  PSYCHOLOGICAL_VERBAL: PsychologyIcon,
  DENIAL_LAND_ACCESS: LandscapeIcon,
  DENIAL_EDUCATION_ACCESS: SchoolIcon,
  CIVIL_DOCUMENT_CONFISCATION: DescriptionIcon,
  CHILD_ABANDONMENT: FamilyRestroomIcon,
  DIVORCE_REFUSAL: GavelIcon,
  FGM: PersonOffIcon,
  RAPE: ReportProblemIcon,
  OTHER: HelpIcon,
};

// Pictogram artwork provided by the customer, under public/img/violence-types.
// Categories without an entry here fall back to the MUI icon above.
const IMAGES_BY_CODE: Record<string, string> = {
  PHYSICAL: '/img/violence-types/physical-agression.png',
  SEXUAL: '/img/violence-types/sexual-agression.png',
  PSYCHOLOGICAL_VERBAL: '/img/violence-types/psycho-agression.png',
  DENIAL_LAND_ACCESS: '/img/violence-types/deny-of-resources.png',
  DIVORCE_REFUSAL: '/img/violence-types/enforced-mariage.png',
  RAPE: '/img/violence-types/rape.png',
  OTHER: '/img/violence-types/other-types-of-violence.png',
};

export function getViolenceCategoryIcon(code: string): IconComponent {
  return ICONS_BY_CODE[code] ?? HelpIcon;
}

export function getViolenceCategoryImage(code: string): string | undefined {
  return IMAGES_BY_CODE[code];
}
