import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getOpenCasesCount } from '../api/public-stats.api';

interface OpenCasesBadgeProps {
  // 'inline' - sits in the header's normal flex flow, right after the logo.
  // 'fixed' - header-less pages (e.g. login): pinned so it lands in roughly
  // the same on-screen spot the inline badge occupies inside the header.
  variant: 'inline' | 'fixed';
}

// Always-visible, unauthenticated indicator of open-case volume.
export function OpenCasesBadge({ variant }: OpenCasesBadgeProps) {
  const { data } = useQuery({
    queryKey: ['public-open-cases-count'],
    queryFn: getOpenCasesCount,
    refetchInterval: 30_000,
  });

  if (data === undefined) {
    return null;
  }

  return (
    <Box
      aria-label={`${data}`}
      sx={{
        ...(variant === 'fixed'
          ? { position: 'fixed', top: 20, left: 88, zIndex: (theme) => theme.zIndex.tooltip + 1 }
          : {}),
        color: 'error.main',
        fontWeight: 800,
        fontSize: { xs: '1.5rem', sm: '2rem' },
        lineHeight: 1,
        pointerEvents: 'none',
      }}
    >
      {data}
    </Box>
  );
}
