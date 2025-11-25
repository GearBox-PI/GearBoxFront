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

type QueryKeyParams = Record<
  string,
  string | number | boolean | undefined | null
>;

const withParams = (base: string, params?: QueryKeyParams) =>
  params ? [base, { ...params }] : [base];

export const gearboxKeys = {
  services: {
    all: ["services"] as const,
    list: (params?: QueryKeyParams) => [
      "services",
      ...withParams("list", params),
    ],
  },
  budgets: {
    all: ["budgets"] as const,
    list: (params?: QueryKeyParams) => [
      "budgets",
      ...withParams("list", params),
    ],
  },
  clients: {
    all: ["clients"] as const,
    list: (params?: QueryKeyParams) => [
      "clients",
      ...withParams("list", params),
    ],
  },
  cars: {
    all: ["cars"] as const,
    list: (params?: QueryKeyParams) => ["cars", ...withParams("list", params)],
  },
  users: {
    all: ["users"] as const,
    list: (params?: QueryKeyParams) => ["users", ...withParams("list", params)],
  },
};
