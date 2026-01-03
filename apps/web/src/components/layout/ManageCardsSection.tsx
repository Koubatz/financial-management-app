import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CardActionList } from '@/components/ui/card-action-list';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { CreditScore } from '@/components/ui/credit-score';
import { PaymentCard } from '@/components/ui/payment-card';
import { theme } from '@/config/theme';
import { CreditCard, Plus, Shield, Snowflake } from 'lucide-react';

export function ManageCardsSection() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const actions = [
    {
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
      label: 'Preparar cartão',
    },
    {
      icon: <Snowflake className="h-4 w-4 text-muted-foreground" />,
      label: 'Congelar cartão',
    },
    {
      icon: <Shield className="h-4 w-4 text-muted-foreground" />,
      label: 'Proteger cartão',
    },
  ];

  return (
    <Card className="md:col-span-3" accentColor={theme.colors.surface}>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg">Gerencie seus cartões</CardTitle>
          <CardDescription>Organize e proteja seus cartões em um só lugar.</CardDescription>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          Ver novo cartão
        </button>
      </CardHeader>
      <CardContent className="mt-2">
        <div className="grid gap-4 md:grid-cols-[1.25fr_1fr]">
          <div className="space-y-3">
            <PaymentCard
              bankName="MoneyT Bank"
              cardNumber="1224 5678 9012 3456"
              holderName="ETHAN COLE"
            />
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground transition hover:border-muted-foreground hover:text-foreground"
              onClick={() => setIsConfirmOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Adicionar novo cartão
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <CardActionList title="Seu novo cartão" ctaLabel="Ver detalhes" actions={actions} />
            <CreditScore
              score={780}
              rating="Bom"
              description="Histórico financeiro"
              initials="CS"
            />
          </div>
        </div>
      </CardContent>
      <ConfirmModal
        open={isConfirmOpen}
        title="Adicionar novo cartão"
        description="Deseja confirmar a criação de um novo cartão?"
        onConfirm={() => setIsConfirmOpen(false)}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </Card>
  );
}
