import { daneApi } from "@/app/ciiu/daneApi";
import { govApi, type GovItem } from "@/app/ciiu/govApi";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const cacheDir = path.join(process.cwd(), "app", "ciiu", "cache");

export const ciiuService = {
  getSections() {
    return withCache({
      name: "section",
      fn: async () => {
        const sections = await daneApi("seccion");
        return sections.map((ciiuItem) => ({
          name: ciiuItem.fields.descripcion,
          includes: ciiuItem.fields.incluye,
          excludes: ciiuItem.fields.excluye,
          section: ciiuItem.fields.seccion_cod,
        }));
      },
    });
  },
  getDivisions() {
    return withCache({
      name: "divisions",
      fn: async () => {
        const sections = await daneApi("division");
        return sections.map((ciiuItem) => ({
          name: ciiuItem.fields.descripcion,
          includes: ciiuItem.fields.incluye,
          excludes: ciiuItem.fields.excluye,
          section: ciiuItem.fields.seccion_cod,
          division: ciiuItem.fields.division_cod,
        }));
      },
    });
  },
  getGroups() {
    return withCache({
      name: "groups",
      fn: async () => {
        const sections = await daneApi("grupo");
        return sections.map((ciiuItem) => ({
          name: ciiuItem.fields.descripcion,
          includes: ciiuItem.fields.incluye,
          excludes: ciiuItem.fields.excluye,
          section: ciiuItem.fields.seccion_cod,
          division: ciiuItem.fields.division_cod,
          group: ciiuItem.fields.grupo_cod,
        }));
      },
    });
  },
  getClasses() {
    return withCache({
      name: "classes",
      fn: async () => {
        const sections = await daneApi("clase");

        const filteredSections = Array.from(
          new Set(
            sections
              .filter((ciiuItem) => {
                return ciiuItem.fields.grupo_cod.endsWith("_");
              })
              .map((ciiuItem) => ciiuItem.fields.clase_cod)
          )
        );

        const batchSize = 5;
        const batch = [];
        const result: GovItem[] = [];
        const totalBatches = Math.ceil(filteredSections.length / batchSize);
        let batchNumber = 0;

        for (const ciiuCode of filteredSections) {
          batch.push(govApi(ciiuCode));
          if (batch.length >= batchSize) {
            batchNumber += 1;
            console.log(`Processing batch ${batchNumber} of ${totalBatches}`);
            const partialResult = await Promise.all(batch);
            result.push(...partialResult.filter((item) => item !== null));
            batch.length = 0;
            console.log(
              `Sections so far ${result.length} of ${filteredSections.length}`
            );
          }
        }

        if (batch.length > 0) {
          batchNumber += 1;
          console.log(`Processing batch ${batchNumber} of ${totalBatches}`);

          const partialResult = await Promise.all(batch);
          result.push(...partialResult.filter((item) => item !== null));
          console.log(
            `Sections so far ${result.length} of ${filteredSections.length}`
          );
        }

        return result.map((item) => ({
          id: item.id,
          class: item.codigo,
          name: item.nombre,
          includes: item.incluye,
          excludes: item.excluye,
          division: item.division,
          group: item.grupo,
          section: item.seccion,
          keyWords: item.palabrasClave.map(
            ({ palabrasClave }: { palabrasClave: string }) => palabrasClave
          ),
        }));
      },
    });
  },
  async getSection(code: string) {
    const allSections = await this.getSections();
    return allSections.find((section) => section.section === code);
  },
  async getDivision(code: string) {
    const allSections = await this.getDivisions();
    return allSections.find((division) => division.division === code);
  },
  async getGroup(code: string) {
    const allGroups = await this.getGroups();
    return allGroups.find((group) => group.group === code);
  },
  async getClass(code: string) {
    const allClasses = await this.getClasses();
    return allClasses.find((ciiu) => ciiu.class === code) ?? null;
  },
};

async function withCache<T>({
  fn,
  name,
  skipCache = false,
}: {
  fn: () => Promise<T>;
  name: string;
  skipCache?: boolean;
}) {
  await mkdir(cacheDir, { recursive: true });
  const filePath = path.join(cacheDir, `${name}.json`);

  if (!skipCache) {
    try {
      const cachedData = await readFile(filePath, "utf-8");
      const data: T = JSON.parse(cachedData);
      return data;
    } catch {
      console.log(`No cache found: ${filePath}`);
    }
  }
  const response = await fn();
  await writeFile(filePath, JSON.stringify(response));
  return response;
}
