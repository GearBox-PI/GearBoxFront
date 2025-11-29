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

import { apiRequest } from "@/lib/api";
import type {
  AuthResponse,
  PaginatedResponse,
  Client,
  Car,
  Service,
  Budget,
  BudgetStatus,
  Role,
  ApiUser,
  ServiceStatus,
} from "@/types/api";

type QueryParamValue = string | number | boolean | undefined | null;

interface ListParams {
  page?: number;
  perPage?: number;
  [key: string]: QueryParamValue;
}

const buildQueryString = (params?: ListParams) => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export function login(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/login", { method: "POST", body: payload });
}

export function logout(token: string) {
  return apiRequest<void>("/logout", { method: "DELETE", token });
}

export function createUser(
  token: string,
  payload: {
    nome: string;
    email: string;
    senha: string;
    tipo: Role;
    ativo?: boolean;
  },
) {
  return apiRequest<ApiUser>("/users", {
    method: "POST",
    body: payload,
    token,
  });
}

export function listUsers(token: string, params?: ListParams) {
  return apiRequest<PaginatedResponse<ApiUser>>(
    `/users${buildQueryString(params)}`,
    {
      token,
    },
  );
}

export function updateUser(
  token: string,
  id: string,
  payload: Partial<{
    nome: string;
    email: string;
    senha: string;
    tipo: Role;
    ativo: boolean;
  }>,
) {
  return apiRequest<ApiUser>(`/users/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export function deleteUser(
  token: string,
  id: string,
  payload?: { transferToUserId?: string | null },
) {
  return apiRequest<void>(`/users/${id}`, {
    method: "DELETE",
    token,
    body: payload,
  });
}

export function listClients(token: string, params?: ListParams) {
  return apiRequest<PaginatedResponse<Client>>(
    `/clients${buildQueryString(params)}`,
    {
      token,
    },
  );
}

export function createClient(
  token: string,
  payload: { nome: string; telefone: string; email?: string | null },
) {
  return apiRequest<Client>("/clients", {
    method: "POST",
    body: payload,
    token,
  });
}

export function updateClient(
  token: string,
  id: string,
  payload: Partial<{ nome: string; telefone: string; email?: string | null }>,
) {
  return apiRequest<Client>(`/clients/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export function deleteClient(token: string, id: string) {
  return apiRequest<void>(`/clients/${id}`, { method: "DELETE", token });
}

export function listCars(token: string, params?: ListParams) {
  return apiRequest<PaginatedResponse<Car>>(
    `/cars${buildQueryString(params)}`,
    {
      token,
    },
  );
}

export function listServices(token: string, params?: ListParams) {
  return apiRequest<PaginatedResponse<Service>>(
    `/services${buildQueryString(params)}`,
    {
      token,
    },
  );
}

export function updateService(
  token: string,
  id: string,
  payload: Partial<{
    status: ServiceStatus;
    dataPrevista: string;
    prazoEstimadoDias: number;
  }>,
) {
  return apiRequest<Service>(`/services/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export function listBudgets(token: string, params?: ListParams) {
  return apiRequest<PaginatedResponse<Budget>>(
    `/budgets${buildQueryString(params)}`,
    {
      token,
    },
  );
}

export function createBudget(
  token: string,
  payload: {
    clientId: string;
    carId: string;
    description: string;
    amount: number;
    status?: BudgetStatus;
    prazoEstimadoDias?: number | null;
  },
) {
  return apiRequest<Budget>("/budgets", {
    method: "POST",
    body: payload,
    token,
  });
}

export function updateBudget(
  token: string,
  id: string,
  payload: Partial<{
    clientId: string;
    carId: string;
    description: string;
    amount: number;
    status: BudgetStatus;
    prazoEstimadoDias: number | null;
  }>,
) {
  return apiRequest<Budget>(`/budgets/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export function acceptBudget(
  token: string,
  id: string,
  payload: { assignedToId: string; confirm: boolean },
) {
  return apiRequest<{ budget: Budget; service: Service }>(
    `/budgets/${id}/accept`,
    {
      method: "POST",
      token,
      body: payload,
    },
  );
}

export function rejectBudget(token: string, id: string) {
  return apiRequest<Budget>(`/budgets/${id}/reject`, {
    method: "POST",
    token,
  });
}

export function createCar(
  token: string,
  payload: {
    clientId: string;
    placa: string;
    marca: string;
    modelo: string;
    ano: number;
  },
) {
  return apiRequest<Car>("/cars", { method: "POST", body: payload, token });
}

export function deleteCar(token: string, id: string) {
  return apiRequest<void>(`/cars/${id}`, { method: "DELETE", token });
}

export function updateCar(
  token: string,
  id: string,
  payload: Partial<{
    placa: string;
    marca: string;
    modelo: string;
    ano: number;
  }>,
) {
  return apiRequest<Car>(`/cars/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}
