import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './loading-spinner';

// Lazy load Recharts to reduce initial bundle
const ChartComponent = lazy(() =>
  import('./chart').then((m) => ({
    default: m.ChartContainer,
  })),
);

const ChartTooltipComponent = lazy(() =>
  import('./chart').then((m) => ({
    default: m.ChartTooltip,
  })),
);

const ChartTooltipContentComponent = lazy(() =>
  import('./chart').then((m) => ({
    default: m.ChartTooltipContent,
  })),
);

const ChartLegendComponent = lazy(() =>
  import('./chart').then((m) => ({
    default: m.ChartLegend,
  })),
);

const ChartLegendContentComponent = lazy(() =>
  import('./chart').then((m) => ({
    default: m.ChartLegendContent,
  })),
);

const ChartFallback = () => (
  <div className="flex items-center justify-center h-64 border rounded-md">
    <LoadingSpinner />
  </div>
);

// Export wrapped components with Suspense
export function ChartContainer(props: React.ComponentProps<typeof ChartComponent>) {
  return (
    <Suspense fallback={<ChartFallback />}>
      <ChartComponent {...props} />
    </Suspense>
  );
}

export function ChartTooltip(props: React.ComponentProps<typeof ChartTooltipComponent>) {
  return (
    <Suspense fallback={null}>
      <ChartTooltipComponent {...props} />
    </Suspense>
  );
}

export function ChartTooltipContent(
  props: React.ComponentProps<typeof ChartTooltipContentComponent>,
) {
  return (
    <Suspense fallback={null}>
      <ChartTooltipContentComponent {...props} />
    </Suspense>
  );
}

export function ChartLegend(props: React.ComponentProps<typeof ChartLegendComponent>) {
  return (
    <Suspense fallback={null}>
      <ChartLegendComponent {...props} />
    </Suspense>
  );
}

export function ChartLegendContent(
  props: React.ComponentProps<typeof ChartLegendContentComponent>,
) {
  return (
    <Suspense fallback={null}>
      <ChartLegendContentComponent {...props} />
    </Suspense>
  );
}
