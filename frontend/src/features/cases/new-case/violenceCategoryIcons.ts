import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HealingIcon from '@mui/icons-material/Healing';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LandscapeIcon from '@mui/icons-material/Landscape';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import HelpIcon from '@mui/icons-material/Help';

type IconComponent = ComponentType<SvgIconProps>;

// Placeholder icon set - no per-category pictogram artwork exists yet, only a
// combined reference sheet at img/violence-types.png. Swap for real custom
// pictograms once design provides individual assets per category (per spec,
// large pictograms are a key usability feature for low-literacy users).
const ICONS_BY_CODE: Record<string, IconComponent> = {
  PHYSICAL: HealingIcon,
  SEXUAL: ReportProblemIcon,
  PSYCHOLOGICAL_VERBAL: PsychologyIcon,
  ECONOMIC: AttachMoneyIcon,
  DENIAL_LAND_ACCESS: LandscapeIcon,
  DENIAL_EDUCATION_ACCESS: SchoolIcon,
  CIVIL_DOCUMENT_CONFISCATION: DescriptionIcon,
  CHILD_ABANDONMENT: FamilyRestroomIcon,
  DIVORCE_REFUSAL: GavelIcon,
  FGM: PersonOffIcon,
  SEXUAL_HARASSMENT: WorkOffIcon,
  OTHER: HelpIcon,
};

export function getViolenceCategoryIcon(code: string): IconComponent {
  return ICONS_BY_CODE[code] ?? HelpIcon;
}
