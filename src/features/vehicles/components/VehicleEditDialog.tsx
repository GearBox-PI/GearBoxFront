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

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Car } from "@/types/api";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const vehicleSchema = z.object({
  placa: z
    .string()
    .min(7, "Placa inválida")
    .max(8, "Placa inválida")
    .regex(/^[A-Za-z0-9-]+$/, "Placa inválida"),
  marca: z.string().min(2, "Marca obrigatória"),
  modelo: z.string().min(1, "Modelo obrigatório"),
  ano: z.coerce
    .number({
      invalid_type_error: "Ano inválido",
    })
    .min(1900, "Ano inválido")
    .max(new Date().getFullYear() + 1, "Ano inválido"),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface VehicleEditDialogProps {
  vehicle: Car;
  renderTrigger?: (props: { open: () => void; disabled: boolean }) => ReactNode;
  onSubmit?: (values: VehicleFormValues) => Promise<void>;
}

export function VehicleEditDialog({
  vehicle,
  renderTrigger,
  onSubmit,
}: VehicleEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const defaultValues = useMemo<VehicleFormValues>(
    () => ({
      placa: vehicle.placa ?? "",
      marca: vehicle.marca ?? "",
      modelo: vehicle.modelo ?? "",
      ano: vehicle.ano ?? new Date().getFullYear(),
    }),
    [vehicle],
  );

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form, open]);

  const handleSubmit = async (values: VehicleFormValues) => {
    if (!onSubmit) {
      setOpen(false);
      return;
    }
    setSubmitting(true);
    try {
      const sanitizedPlate = values.placa
        .replace(/[^A-Za-z0-9]/g, "")
        .toUpperCase();
      await onSubmit({ ...values, placa: sanitizedPlate });
      setOpen(false);
    } catch (error) {
      toast({
        title: t("vehicles.toasts.updateError"),
        description:
          error instanceof Error
            ? error.message
            : t("vehicles.toasts.defaultError"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const trigger = renderTrigger ? (
    renderTrigger({ open: () => setOpen(true), disabled: submitting })
  ) : (
    <DialogTrigger asChild>
      <Button variant="outline" size="sm" disabled={submitting}>
        {t("vehicles.actions.openEdit")}
      </Button>
    </DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("vehicles.actions.openEdit")}</DialogTitle>
          <DialogDescription>{t("vehicles.subtitle")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => handleSubmit(values))}
          >
            <FormField
              control={form.control}
              name="placa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("vehicles.table.plate")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={8}
                      autoCapitalize="characters"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("vehicles.table.brand")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("vehicles.table.model")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="ano"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("vehicles.table.year")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                {t("common.actions.cancel")}
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? t("vehicles.actions.updating")
                  : t("common.actions.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
