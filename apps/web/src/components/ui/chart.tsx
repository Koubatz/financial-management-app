import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

type TooltipItem = {
  dataKey?: string;
  name?: string | number;
  value?: number | string;
  payload?: Record<string, unknown> | undefined;
  color?: string | undefined;
  type?: string | undefined;
};

// Helper to extract color safely from tooltip/legend items
function extractColorFromItem(
  item?: TooltipItem | { color?: string; payload?: unknown },
): string | undefined {
  if (!item) return undefined;

  // If item has a direct `color` field
  const maybeColor = (item as TooltipItem).color;
  if (typeof maybeColor === 'string') return maybeColor;

  // Otherwise check payload.color if it exists
  const maybePayload = (item as { payload?: unknown }).payload;
  if (maybePayload && typeof maybePayload === 'object' && 'color' in maybePayload) {
    const payloadColor = (maybePayload as Record<string, unknown>)['color'];
    if (typeof payloadColor === 'string') return payloadColor;
  }

  return undefined;
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<'div'> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
  }) {
  const { config } = useChart();
  const typedPayload = payload as unknown as TooltipItem[] | undefined;

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !typedPayload?.length) {
      return null;
    }

    const [item] = typedPayload ?? [];
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === 'string' ? config[label]?.label || label : itemConfig?.label;

    if (labelFormatter && typeof labelFormatter === 'function') {
      // Guard and cast to known function signature to avoid unsafe call linting
      const lf = labelFormatter as (label: unknown, payload?: unknown) => React.ReactNode;
      return <div className={cn('font-medium', labelClassName)}>{lf(value, typedPayload)}</div>;
    }

    if (!value) {
      return null;
    }

    return <div className={cn('font-medium', labelClassName)}>{value}</div>;
  }, [label, labelFormatter, typedPayload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !typedPayload?.length) {
    return null;
  }

  const nestLabel = (typedPayload?.length ?? 0) === 1 && indicator !== 'dot';

  return (
    <div
      className={cn(
        'border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {typedPayload
          ?.filter((item) => item.type !== 'none')
          .map((item: TooltipItem, index: number) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color ?? extractColorFromItem(item) ?? undefined;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  '[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5',
                  indicator === 'dot' && 'items-center',
                )}
              >
                {typeof formatter === 'function' && item?.value !== undefined && item.name ? (
                  // Cast formatter to known signature to avoid unsafe call linting
                  (
                    formatter as (
                      value: number | string,
                      name: string | number,
                      item: TooltipItem,
                      index: number,
                      payload?: TooltipItem[],
                    ) => React.ReactNode
                  )(item.value, item.name, item, index, typedPayload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
                            {
                              'h-2.5 w-2.5': indicator === 'dot',
                              'w-1': indicator === 'line',
                              'w-0 border-[1.5px] border-dashed bg-transparent':
                                indicator === 'dashed',
                              'my-0.5': nestLabel && indicator === 'dashed',
                            },
                          )}
                          style={
                            {
                              '--color-bg': indicatorColor,
                              '--color-border': indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'flex flex-1 justify-between leading-none',
                        nestLabel ? 'items-end' : 'items-center',
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="text-foreground font-mono font-medium tabular-nums">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: React.ComponentProps<'div'> &
  Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
    hideIcon?: boolean;
    nameKey?: string;
  }) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className,
      )}
    >
      {(
        payload as unknown as
          | Array<{
              value?: string | number;
              color?: string;
              payload?: unknown;
              name?: string;
              type?: string;
            }>
          | undefined
      )
        ?.filter((item) => item.type !== 'none')
        .map(
          (item: {
            value?: string | number;
            color?: string;
            payload?: unknown;
            name?: string;
            type?: string;
          }) => {
            const key = `${nameKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);

            return (
              <div
                key={item.value}
                className={cn(
                  '[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3',
                )}
              >
                {itemConfig?.icon && !hideIcon ? (
                  <itemConfig.icon />
                ) : (
                  <div
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    // Safe: extracting color from third-party payloads; guarded in `extractColorFromItem`
                    style={{
                      backgroundColor: extractColorFromItem(item),
                    }}
                  />
                )}
                {itemConfig?.label}
              </div>
            );
          },
        )}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
): { label?: React.ReactNode; icon?: React.ComponentType | undefined } | undefined {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  // Treat payload as record to safely access its properties without propagating `any`
  const p = payload as Record<string, unknown>;

  const payloadPayload =
    'payload' in p && typeof p.payload === 'object' && p.payload !== null
      ? (p.payload as Record<string, unknown>)
      : undefined;

  let configLabelKey: string = key;

  if (key in p && typeof p[key] === 'string') {
    configLabelKey = String(p[key]);
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === 'string') {
    configLabelKey = String(payloadPayload[key]);
  }

  // Return either a config matching the resolved key, or fallback to config keyed by the original key
  return (configLabelKey in config ? config[configLabelKey] : config[key]) as
    | {
        label?: React.ReactNode;
        icon?: React.ComponentType | undefined;
      }
    | undefined;
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
