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

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listClients } from "@/services/gearbox";
import { useAuth } from "@/contexts/AuthContext";
import { gearboxKeys } from "@/lib/queryKeys";
import { QUERY_STALE_TIMES } from "@/config/query";
import type { Client, PaginatedMeta } from "@/types/api";

type UseClientsParams = {
  page?: number;
  perPage?: number;
  enabled?: boolean;
};

export function useClients({
  page = 1,
  perPage = 50,
  enabled = true,
}: UseClientsParams = {}) {
  const { token } = useAuth();

  const query = useQuery({
    queryKey: gearboxKeys.clients.list({ page, perPage }),
    queryFn: () => listClients(token!, { page, perPage }),
    enabled: Boolean(token) && enabled,
    staleTime: QUERY_STALE_TIMES.clients,
    select: (data) => ({
      list: data.data as Client[],
      meta: data.meta as PaginatedMeta,
    }),
  });

  const clientMap = useMemo(() => {
    const entries = query.data?.list?.map((client) => [client.id, client.nome]) ?? [];
    return new Map(entries);
  }, [query.data?.list]);

  return { ...query, clientMap };
}
