import { PlannerAgent } from "./architect.agent";

export async function architectNode() {
  const planner = new PlannerAgent();
  const result = await planner.execute(
    "Build a real-time collaborative code editor"
  );
  console.log(JSON.stringify(result, null, 2));
}