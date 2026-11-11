import React from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, Box, Group, Text, Badge } from "@mantine/core";
import { RunLogView } from "@/components/RunLog/RunLogView";
import { theme, resolver } from "@/theme";
import events from "./sample-events.json";
import "@mantine/core/styles.css";
const stamped = events.map((e) => ({run_id:"illustrative-session",turn:1,ts:"2026-10-16T12:00:00Z",...e}));
createRoot(document.getElementById("root")!).render(
  <MantineProvider theme={theme} cssVariablesResolver={resolver} forceColorScheme="dark">
    <Box id="capture" bg="#101114" p={24} w={1024}>
      <Group justify="space-between" mb={18}>
        <Group gap={10}><Text fw={650} size="lg">Gauge</Text><Text c="dimmed" size="sm">/</Text><Text size="sm">Coding session</Text></Group>
        <Badge radius="xs" variant="outline" color="gray" tt="none" ff="monospace">Illustrative session · sample data</Badge>
      </Group>
      <Group justify="space-between" mb={18} align="end">
        <Box><Text size="xl" fw={550}>Install the SDK using the quickstart</Text><Text c="dimmed" size="sm" mt={5}>Codex · PR docs preview · Session excerpt</Text></Box>
        <Text size="xs" c="dimmed" ff="monospace">events 12–17</Text>
      </Group>
      <Box style={{display:"flex", height:340}}>
        <RunLogView events={stamped as any} active={false} status="SUCCEEDED" startedAtMs={null} timeline={[]} variant="codex" modelDisplayName="Codex" compactBar barRight={<Text size="xs" ff="monospace" c="dimmed">Transcript · 6 events</Text>} />
      </Box>
      <Text size="xs" c="dimmed" mt={12}>Fictional Acme SDK scenario. Rendered with Gauge’s session viewer; no agent run was launched.</Text>
    </Box>
  </MantineProvider>
);
