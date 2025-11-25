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

import { useQuery } from "@tanstack/react-query";

const FIPE_BASE_URL = "https://parallelum.com.br/fipe/api/v1";

export interface FipeBrand {
  codigo: string;
  nome: string;
}

export interface FipeModel {
  codigo: number;
  nome: string;
}

export interface FipeYear {
  codigo: string;
  nome: string;
}

export interface FipeVehicle {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  SiglaCombustivel: string;
}

const fipeRequest = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${FIPE_BASE_URL}${path}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erro ao comunicar com a FIPE");
  }
  return (await response.json()) as T;
};

const mapQueryState = (query: { isLoading: boolean; error: unknown }) => ({
  loading: query.isLoading,
  error: query.error instanceof Error ? query.error.message : null,
});

export function useFipeBrands() {
  const query = useQuery({
    queryKey: ["fipe", "brands"],
    queryFn: () => fipeRequest<FipeBrand[]>("/carros/marcas"),
    staleTime: 24 * 60 * 60 * 1000,
  });

  return { brands: query.data ?? [], ...mapQueryState(query) };
}

export function useFipeModels(brandCode: string | null) {
  const query = useQuery({
    queryKey: ["fipe", "models", brandCode],
    queryFn: () =>
      fipeRequest<{ modelos: FipeModel[] }>(
        `/carros/marcas/${brandCode}/modelos`
      ),
    enabled: Boolean(brandCode),
    staleTime: 24 * 60 * 60 * 1000,
    select: (data) => data.modelos ?? [],
  });

  return { models: query.data ?? [], ...mapQueryState(query) };
}

export function useFipeYears(brandCode: string | null, modelCode: string | null) {
  const query = useQuery({
    queryKey: ["fipe", "years", brandCode, modelCode],
    queryFn: () =>
      fipeRequest<FipeYear[]>(
        `/carros/marcas/${brandCode}/modelos/${modelCode}/anos`
      ),
    enabled: Boolean(brandCode && modelCode),
    staleTime: 24 * 60 * 60 * 1000,
  });

  return { years: query.data ?? [], ...mapQueryState(query) };
}

export async function getFipeVehicleDetails(
  brandCode: string,
  modelCode: string,
  yearCode: string
): Promise<FipeVehicle | null> {
  try {
    return await fipeRequest<FipeVehicle>(
      `/carros/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`
    );
  } catch (err) {
    console.error("Erro ao buscar detalhes:", err);
    return null;
  }
}
