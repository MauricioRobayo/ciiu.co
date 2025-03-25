import pRetry from "p-retry";

export interface RequestCodeResponse {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  filter: null;
  order: null;
  succeeded: boolean;
  errors: null;
  message: null;
  numOfPages: number;
  data?: RequestCodeItem[];
}
export interface RequestCodeItem {
  id: number;
  division: null;
  grupo: null;
  codigo: string;
  nombre: string;
  incluye: null;
  excluye: null;
  palabrasClaveString: null;
  tieneTramites: boolean;
}
export interface GovItem {
  id: number;
  codigo: string;
  nombre: string;
  incluye: string;
  excluye: string;
  division: string;
  grupo: string;
  seccion: string;
  tipoCodigoCIIUId: number;
  totalRegistrosBusqueda: number;
  tipoCodigoCIIU: null;
  palabrasClave: PalabrasClave[];
  palabrasClaveString: null;
}
export interface PalabrasClave {
  id: number;
  palabrasClave: string;
  codigoCIIU: number;
  fecha: Date;
  codigoCiiuDto: null;
}

export async function govApi(code: string) {
  const id = await getCodeId(code);
  if (!id) {
    return null;
  }
  const response = await pRetry(() =>
    fetch(
      `https://api-interno.www.gov.co/api/ficha-tramites-y-servicios/ConsultaCIIU/codigoCIIU/ObtenerCodigoCIIUAngular/${id}`
    )
  );
  const data: GovItem = await response.json();
  return data;
}

async function getCodeId(code: string) {
  const response = await pRetry(() =>
    fetch(
      "https://api-interno.www.gov.co/api/ficha-tramites-y-servicios/ConsultaCIIU/codigoCIIU/ObtenerActividadesEconomicas/requestCodigo",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          filtro: code,
          pageSize: 1,
          numPage: 1,
        }),
      }
    )
  );
  const data: RequestCodeResponse = await response.json();
  if (!data.data) {
    console.log(`Failed to get data for: '${code}`);
    return null;
  }
  return data.data.at(0)?.id ?? null;
}
