import pRetry from "p-retry";

export interface CiiuItem {
  model: string;
  pk: number;
  fields: Fields;
}

export interface Fields {
  descripcion: string;
  incluye: string;
  excluye: string;
  seccion_cod: string;
  division_cod: string;
  grupo_cod: string;
  clase_cod: string;
}

export async function daneApi(
  service: "seccion" | "division" | "grupo" | "clase"
): Promise<CiiuItem[]> {
  const response = await pRetry(
    () =>
      fetch(`https://clasificaciones.dane.gov.co/ciiu4-0/${service}_service`),
    {
      onFailedAttempt: (error) => {
        console.log(error.message);
        console.log(
          `${service}: Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
        );
      },
    }
  );
  return response.json();
}
