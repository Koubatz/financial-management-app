import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { theme } from '@/config/theme';
import { cn } from '@/lib/utils';

export function ThemeShowcase() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: theme.colors.text.primary }}
        >
          Design System
        </h1>
        <p className="text-muted-foreground" style={{ color: theme.colors.text.secondary }}>
          Guia de estilos, cores e tipografia da aplicação.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Paleta de Cores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Cores da Marca */}
          <Card>
            <CardHeader className="font-semibold">Cores da Marca</CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-md shadow-sm"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div>
                  <p className="font-medium">Primary</p>
                  <p className="text-xs text-muted-foreground uppercase">{theme.colors.primary}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-md shadow-sm"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <div>
                  <p className="font-medium">Secondary</p>
                  <p className="text-xs text-muted-foreground uppercase">
                    {theme.colors.secondary}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn('w-12 h-12 rounded-md shadow-sm')}
                  style={{
                    border: `2px solid ${theme.colors.accent}`,
                    backgroundColor: theme.colors.accent,
                  }}
                />
                <div>
                  <p className="font-medium">Accent</p>
                  <p className="text-xs text-muted-foreground uppercase">{theme.colors.accent}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cores de Gráficos */}
          <Card>
            <CardHeader className="font-semibold">Gráficos & Dados</CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-md shadow-sm"
                  style={{ backgroundColor: theme.colors.chart.revenue }}
                />
                <div>
                  <p className="font-medium">Receita</p>
                  <p className="text-xs text-muted-foreground uppercase">
                    {theme.colors.chart.revenue}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-md shadow-sm"
                  style={{ backgroundColor: theme.colors.chart.expenses }}
                />
                <div>
                  <p className="font-medium">Despesas</p>
                  <p className="text-xs text-muted-foreground uppercase">
                    {theme.colors.chart.expenses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cores de Status */}
          <Card>
            <CardHeader className="font-semibold">Status do Sistema</CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(theme.colors.status).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-md shadow-sm"
                    style={{ backgroundColor: value }}
                  />
                  <div>
                    <p className="font-medium capitalize">{key}</p>
                    <p className="text-xs text-muted-foreground uppercase">{value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tipografia</h2>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Heading / Sans Serif</p>
              <div style={{ fontFamily: theme.fonts.heading }} className="space-y-2">
                <p className="text-4xl font-bold">The quick brown fox</p>
                <p className="text-2xl font-semibold">Jumps over the lazy dog</p>
              </div>
            </div>
            <hr />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Body Text (Sans)</p>
              <div style={{ fontFamily: theme.fonts.sans }} className="space-y-2">
                <p className="leading-7">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-sm text-muted-foreground">
                  Texto pequeno (text-sm) para legendas ou detalhes secundários.
                </p>
              </div>
            </div>
            <hr />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Pesos da Fonte</p>
              <div
                style={{ fontFamily: theme.fonts.sans }}
                className="grid grid-cols-2 gap-4 md:grid-cols-3"
              >
                <p className="font-light">Light (300)</p>
                <p className="font-normal">Normal (400)</p>
                <p className="font-medium">Medium (500)</p>
                <p className="font-semibold">Semibold (600)</p>
                <p className="font-bold">Bold (700)</p>
                <p className="font-black">Black (900)</p>
              </div>
            </div>
            <hr />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Monospace (Código)</p>
              <p
                style={{ fontFamily: theme.fonts.mono }}
                className="text-sm bg-slate-100 p-3 rounded-md"
              >
                import &#123; theme &#125; from '@/config/theme';
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
