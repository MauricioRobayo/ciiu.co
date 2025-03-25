import { ciiuService } from "@/app/ciiu/service";

export default async function Page() {
  const sections = await ciiuService.getClasses();
  return (
    <div>
      {sections.length}
      <div>{JSON.stringify(sections)}</div>
    </div>
  );
}
