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

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/shared/hooks/use-mobile";

const OWNER_CONFIRMATION_PHRASE = "excluir minha conta";
const MECHANIC_DEACTIVATION_PHRASE = "desativar";

export function UsersTable({
  users = [],
  search,
  onSearchChange,
  renderEdit,
  onDelete,
  deletingId,
  onDeactivateMechanic,
  onActivateMechanic,
}) {
  const isMobile = useIsMobile();
  const activeMechanics = useMemo(
    () =>
      users.filter((user) => user.tipo === "mecanico" && user.ativo !== false),
    [users],
  );

  return (
    <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-lg">Usuários do sistema</CardTitle>
        <SearchInput
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={(event) => onSearchChange?.(event.target.value)}
          wrapperClassName="w-full md:w-72"
        />
      </CardHeader>
      <CardContent>
        {isMobile ? (
          <div className="flex flex-col gap-4">
            {users.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">
                Nenhum usuário encontrado.
              </div>
            ) : (
              users.map((user) => (
                <Card key={user.id} className="p-4 border border-border/50">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{user.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                      <Badge
                        variant={user.ativo !== false ? "secondary" : "outline"}
                      >
                        {user.ativo !== false ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm capitalize text-muted-foreground">
                        {user.tipo}
                      </div>
                      <div className="flex gap-2">
                        {renderEdit?.(user)}
                        {user.tipo === "mecanico" ? (
                          <MechanicStatusButton
                            user={user}
                            deletingId={deletingId}
                            mechanics={activeMechanics}
                            onDeactivate={onDeactivateMechanic}
                            onActivate={onActivateMechanic}
                          />
                        ) : (
                          <DeleteUserButton
                            user={user}
                            deletingId={deletingId}
                            onConfirm={onDelete}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[880px] text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-muted-foreground"
                    >
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="align-middle">
                      <TableCell className="align-middle font-medium">
                        {user.nome}
                      </TableCell>
                      <TableCell className="align-middle">
                        {user.email}
                      </TableCell>
                      <TableCell className="align-middle capitalize">
                        {user.tipo}
                      </TableCell>
                      <TableCell className="align-middle">
                        <Badge
                          variant={
                            user.ativo !== false ? "secondary" : "outline"
                          }
                        >
                          {user.ativo !== false ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-middle text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {renderEdit?.(user)}
                          {user.tipo === "mecanico" ? (
                            <MechanicStatusButton
                              user={user}
                              deletingId={deletingId}
                              mechanics={activeMechanics}
                              onDeactivate={onDeactivateMechanic}
                              onActivate={onActivateMechanic}
                            />
                          ) : (
                            <DeleteUserButton
                              user={user}
                              deletingId={deletingId}
                              onConfirm={onDelete}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DeleteUserButton({ user, onConfirm, deletingId }) {
  const [open, setOpen] = useState(false);
  const [ownerConfirmation, setOwnerConfirmation] = useState("");
  const isOwner = user.tipo === "dono";
  const isDeleting = deletingId === user.id;
  const confirmationMatches =
    ownerConfirmation.trim().toLowerCase() ===
    OWNER_CONFIRMATION_PHRASE.toLowerCase();
  const canConfirm = !isOwner || confirmationMatches;

  const resetState = () => {
    setOwnerConfirmation("");
  };

  const handleOpenChange = (value) => {
    setOpen(value);
    if (!value) resetState();
  };

  const handleConfirm = () => {
    if (!canConfirm || isDeleting) return;
    onConfirm?.(user);
    setOpen(false);
    resetState();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isDeleting}>
          {isDeleting ? "Processando..." : "Excluir"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover {user.nome}? Essa ação não poderá ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        {isOwner && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Para remover sua própria conta de administrador digite
              <span className="font-semibold">
                {" "}
                {OWNER_CONFIRMATION_PHRASE}{" "}
              </span>
              abaixo.
            </p>
            <Input
              value={ownerConfirmation}
              onChange={(event) => setOwnerConfirmation(event.target.value)}
              placeholder={OWNER_CONFIRMATION_PHRASE}
              autoFocus
            />
          </div>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!canConfirm || isDeleting}
            onClick={handleConfirm}
          >
            {isDeleting ? "Processando..." : "Confirmar exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MechanicStatusButton({
  user,
  deletingId,
  mechanics,
  onDeactivate,
  onActivate,
}) {
  const [open, setOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const isActive = user.ativo !== false;
  const isPending = deletingId === user.id;
  const transferOptions = mechanics.filter(
    (mechanic) => mechanic.id !== user.id,
  );
  const confirmationMatches =
    confirmation.trim().toLowerCase() ===
    MECHANIC_DEACTIVATION_PHRASE.toLowerCase();

  const resetState = () => {
    setConfirmation("");
    setTransferTo("");
  };

  const handleOpenChange = (value) => {
    setOpen(value);
    if (!value) resetState();
  };

  const handleDeactivate = () => {
    if (!confirmationMatches || isPending) return;
    onDeactivate?.(user, { transferToUserId: transferTo || undefined });
    setOpen(false);
    resetState();
  };

  const handleActivateOpenChange = (value) => {
    setActivateDialogOpen(value);
  };

  const handleActivate = () => {
    if (isPending) return;
    onActivate?.(user);
    handleActivateOpenChange(false);
  };

  if (!isActive) {
    return (
      <Dialog open={activateDialogOpen} onOpenChange={handleActivateOpenChange}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm" disabled={isPending}>
            {isPending ? "Processando..." : "Ativar"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reativar mecânico</DialogTitle>
            <DialogDescription>
              Confirme a reativação de {user.nome}. O mecânico voltará a ter
              acesso ao sistema imediatamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleActivateOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={handleActivate}
            >
              {isPending ? "Processando..." : "Confirmar reativação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          className="border-destructive/30 bg-destructive-light text-destructive hover:bg-destructive-light/80"
        >
          {isPending ? "Processando..." : "Desativar"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desativar mecânico</DialogTitle>
          <DialogDescription>
            {`Digite "${MECHANIC_DEACTIVATION_PHRASE}" para confirmar a desativação de ${user.nome}.`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder={MECHANIC_DEACTIVATION_PHRASE}
            autoFocus
          />
        </div>
        {transferOptions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Opcional: transfira budgets e serviços para outro mecânico ativo.
            </p>
            <Select
              value={transferTo || "__none"}
              onValueChange={(value) =>
                setTransferTo(value === "__none" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um mecânico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">Não transferir</SelectItem>
                {transferOptions.map((mechanic) => (
                  <SelectItem key={mechanic.id} value={mechanic.id}>
                    {mechanic.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!confirmationMatches || isPending}
            onClick={handleDeactivate}
          >
            {isPending ? "Processando..." : "Confirmar desativação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
