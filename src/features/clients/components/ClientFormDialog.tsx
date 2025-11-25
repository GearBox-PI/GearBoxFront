/*
 * Gear Box – Sistema de Gestão para Oficinas Mecânicas
 * Copyright (C) 2025 Gear Box
 *
 * Este arquivo é parte do Gear Box.
 * O Gear Box é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da GNU Affero General Public License, versão 3,
 * conforme publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil,
 * mas SEM QUALQUER GARANTIA; sem mesmo a garantia implícita de
 * COMERCIABILIDADE ou ADEQUAÇÃO A UM DETERMINADO FIM.
 * Consulte a GNU AGPLv3 para mais detalhes.
 *
 * Você deve ter recebido uma cópia da GNU AGPLv3 junto com este programa.
 * Caso contrário, veja <https://www.gnu.org/licenses/>.
 */

import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

type ClientFormValues = {
  nome: string;
  telefone: string;
  email: string;
};

type ClientFormDialogProps = {
  mode?: 'create' | 'edit';
  initialValues?: Partial<ClientFormValues>;
  triggerLabel?: string;
  renderTrigger?: (props: { open: () => void; disabled: boolean }) => ReactNode;
  onSubmit?: (values: { nome: string; telefone: string; email?: string }) => Promise<void>;
};

const DEFAULT_VALUES: ClientFormValues = {
  nome: '',
  telefone: '',
  email: '',
};

export function ClientFormDialog({
  mode = 'create',
  initialValues,
  triggerLabel = 'Registrar cliente',
  renderTrigger,
  onSubmit,
}: ClientFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<ClientFormValues>(() => normalizeInitialValues(initialValues));
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    setForm(normalizeInitialValues(initialValues));
  }, [initialValues]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onSubmit) return;
    setIsSaving(true);
    try {
      await onSubmit({
        nome: form.nome.trim(),
        telefone: form.telefone.trim(),
        email: form.email.trim() ? form.email.trim() : undefined,
      });
      toast({
        title: mode === 'edit' ? t('common.actions.edit') : t('clients.title'),
        description: t('clients.subtitle'),
      });
      setOpen(false);
    } catch (error: unknown) {
      toast({
        title: t('orders.toasts.updateError'),
        description: error instanceof Error ? error.message : t('budgets.toasts.defaultError'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const dialogTrigger = renderTrigger ? (
    renderTrigger({ open: () => setOpen(true), disabled: isSaving })
  ) : (
    <DialogTrigger asChild>
      <Button className="bg-gradient-accent hover:opacity-90" disabled={isSaving}>
        {t('common.actions.save')}
      </Button>
    </DialogTrigger>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setForm(normalizeInitialValues(initialValues));
        }
      }}
    >
      {dialogTrigger}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? t('common.actions.edit') : t('clients.title')}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="client-name">{t('clients.table.name')}</Label>
            <Input
              id="client-name"
              value={form.nome}
              onChange={(event) => setForm((state) => ({ ...state, nome: event.target.value }))}
              placeholder={t('clients.table.name')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-phone">{t('clients.table.phone')}</Label>
            <Input
              id="client-phone"
              value={form.telefone}
              onChange={(event) => setForm((state) => ({ ...state, telefone: event.target.value }))}
              placeholder="(00) 00000-0000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-email">{t('clients.table.email')}</Label>
            <Input
              id="client-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))}
              placeholder="email@cliente.com"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSaving || !form.nome.trim() || !form.telefone.trim()}>
              {isSaving ? t('charts.placeholder.loading') : mode === 'edit' ? t('common.actions.save') : t('common.actions.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function normalizeInitialValues(values?: Partial<ClientFormValues>): ClientFormValues {
  return {
    nome: values?.nome ?? DEFAULT_VALUES.nome,
    telefone: values?.telefone ?? DEFAULT_VALUES.telefone,
    email: values?.email ?? DEFAULT_VALUES.email,
  };
}
