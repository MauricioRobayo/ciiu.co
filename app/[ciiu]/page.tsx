import { ciiuService } from "@/app/ciiu/service";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Grid, Callout, Container, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ ciiu: string }>;
}) {
  const { ciiu } = await params;
  const data = await ciiuService.getClass(ciiu);
  if (!data) {
    notFound();
  }
  const [section, division, group] = await Promise.all([
    ciiuService.getSection(data.section),
    ciiuService.getDivision(data.division),
    ciiuService.getGroup(data.group),
  ]);
  return (
    <Container>
      <header>
        <Heading>Código CIIU {data.class}</Heading>
        <Heading as="h2" size="4">
          {data.name}
        </Heading>
      </header>
      <main>
        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
          <Callout.Root color="green">
            <Callout.Icon>
              <CheckCircledIcon />
            </Callout.Icon>
            <Callout.Text>{data.includes}</Callout.Text>
          </Callout.Root>
          <Callout.Root color="red">
            <Callout.Icon>
              <CrossCircledIcon />
            </Callout.Icon>
            <Callout.Text>{data.excludes}</Callout.Text>
          </Callout.Root>
        </Grid>
        {section && (
          <Section
            title={`Sección ${section.section}`}
            description={section.name}
            includes={section.includes}
            excludes={section.excludes}
          />
        )}
        {division && (
          <Section
            title={`División ${division.division}`}
            description={division.name}
            includes={division.includes}
            excludes={division.excludes}
          />
        )}
        {group && (
          <Section
            title={`Grupo ${group.group}`}
            description={group.name}
            includes={group.includes}
            excludes={group.excludes}
          />
        )}
      </main>
    </Container>
  );
}

function Section({
  title,
  description,
  excludes,
  includes,
}: {
  title: string;
  description: string;
  excludes: string;
  includes: string;
}) {
  return (
    <article>
      <header>
        <Heading as="h3">{title}</Heading>
        <Heading as="h4" size="2">
          {description}
        </Heading>
      </header>
      <main>
        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
          {includes && (
            <Callout.Root color="green">
              <Callout.Icon>
                <CheckCircledIcon />
              </Callout.Icon>
              <Callout.Text>{includes}</Callout.Text>
            </Callout.Root>
          )}
          {excludes && (
            <Callout.Root color="red">
              <Callout.Icon>
                <CrossCircledIcon />
              </Callout.Icon>
              <Callout.Text>{excludes}</Callout.Text>
            </Callout.Root>
          )}
        </Grid>
      </main>
    </article>
  );
}
