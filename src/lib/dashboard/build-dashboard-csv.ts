// lib/dashboard/build-dashboard-csv.ts

interface BuildDashboardCSVParams {
  overview: any;
  recentActivity: any[];
  scripts: any;
  agents: any[];
  flows: any[];
  scriptPerf: any[];
}

interface CSVRow {
  [key: string]: any;
}

export function buildDashboardCSV({
  overview,
  recentActivity,
  scripts,
  agents,
  flows,
  scriptPerf,
}: BuildDashboardCSVParams): CSVRow[] {
  const csvData: CSVRow[] = [];

  // Dashboard Stats Section
  if (overview?.callStats) {
    csvData.push({}); // Empty line
    csvData.push({ "Dashboard Stats": "" }); // Section heading
    csvData.push({}); // Empty line
    csvData.push({ "Metric": "Number Of Calls", "Value": overview.callStats.total ?? 0 });
    csvData.push({ "Metric": "Active Calls", "Value": overview.callStats.byStatus?.active ?? 0 });
    csvData.push({ "Metric": "Success Rate (%)", "Value": overview.callStats.successRate ?? 0 });
    csvData.push({ "Metric": "Completed Calls", "Value": overview.callStats.byStatus?.completed ?? 0 });
    csvData.push({ "Metric": "Initiating Calls", "Value": overview.callStats.byStatus?.initiating ?? 0 });
    csvData.push({ "Metric": "Failed Calls", "Value": overview.callStats.byStatus?.failed ?? 0 });
    csvData.push({ "Metric": "Retried Calls", "Value": overview.callStats.byStatus?.retried ?? 0 });
  }

  // Agent Performance Section
  if (agents && agents.length > 0) {
    csvData.push({}); // Empty line
    csvData.push({}); // Empty line
    csvData.push({ "Agent Performance": "" }); // Section heading
    csvData.push({}); // Empty line
    
    // Headers
    csvData.push({
      "Agent Name": "Agent Name",
      "Template Type": "Template Type", 
      "Total Calls": "Total Calls",
      "Success Calls": "Success Calls",
      "Failed Calls": "Failed Calls",
      "Active Calls": "Active Calls",
      "Retried Calls": "Retried Calls",
      "Success Rate (%)": "Success Rate (%)",
    });
    
    // Data rows
    agents.forEach((agent: any) => {
      csvData.push({
        "Agent Name": agent.agentName ?? "",
        "Template Type": agent.responseEngineType ?? "",
        "Total Calls": agent.totalCalls ?? 0,
        "Success Calls": agent.successfulCalls ?? 0,
        "Failed Calls": agent.failedCalls ?? 0,
        "Active Calls": agent.activeCalls ?? 0,
        "Retried Calls": agent.retriedCalls ?? 0,
        "Success Rate (%)": agent.successRate ?? 0,
      });
    });
  }

  // Flow Performance Section
  if (flows && flows.length > 0) {
    csvData.push({}); // Empty line
    csvData.push({}); // Empty line
    csvData.push({ "Flow Performance": "" }); // Section heading
    csvData.push({}); // Empty line
    
    // Headers
    csvData.push({
      "Flow Name": "Flow Name",
      "Status": "Status",
      "Success Calls": "Success Calls",
      "Failed Calls": "Failed Calls",
      "Active Calls": "Active Calls",
      "Retried Calls": "Retried Calls",
      "Total Calls": "Total Calls",
      "Success Rate (%)": "Success Rate (%)",
    });
    
    // Data rows
    flows.forEach((flow: any) => {
      csvData.push({
        "Flow Name": flow.name ?? "",
        "Status": flow.status ?? "",
        "Success Calls": flow.successfulCalls ?? 0,
        "Failed Calls": flow.failedCalls ?? 0,
        "Active Calls": flow.activeCalls ?? 0,
        "Retried Calls": flow.retriedCalls ?? 0,
        "Total Calls": flow.totalCalls ?? 0,
        "Success Rate (%)": flow.successRate ?? 0,
      });
    });
  }

  // Script Performance Section
  if (scriptPerf && scriptPerf.length > 0) {
    csvData.push({}); // Empty line
    csvData.push({}); // Empty line
    csvData.push({ "Script Performance": "" }); // Section heading
    csvData.push({}); // Empty line
    
    // Headers
    csvData.push({
      "Script Name": "Script Name",
      "Success Calls": "Success Calls",
      "Failed Calls": "Failed Calls",
      "Active Calls": "Active Calls",
      "Retried Calls": "Retried Calls",
      "Total Calls": "Total Calls",
      "Success Rate (%)": "Success Rate (%)",
    });
    
    // Data rows
    scriptPerf.forEach((script: any) => {
      csvData.push({
        "Script Name": script.name ?? "",
        "Success Calls": script.successfulCalls ?? 0,
        "Failed Calls": script.failedCalls ?? 0,
        "Active Calls": script.activeCalls ?? 0,
        "Retried Calls": script.retriedCalls ?? 0,
        "Total Calls": script.totalCalls ?? 0,
        "Success Rate (%)": script.successRate ?? 0,
      });
    });
  }

  // Top Performing Templates Section
  if (scripts?.templates && scripts.templates.length > 0) {
    csvData.push({}); // Empty line
    csvData.push({}); // Empty line
    csvData.push({ "Top Performing Templates": "" }); // Section heading
    csvData.push({}); // Empty line
    
    // Headers
    csvData.push({
      "Script Name": "Script Name",
      "Template": "Template",
      "Total Calls": "Total Calls",
      "Success Rate (%)": "Success Rate (%)",
    });
    
    // Data rows
    scripts.templates.forEach((script: any) => {
      csvData.push({
        "Script Name": script.name ?? "",
        "Template": script.template ?? 0,
        "Total Calls": script.totalCalls ?? 0,
        "Success Rate (%)": script.successRate?.toFixed(1) ?? 0,
      });
    });
  }

  // Recent Call Activity Section
  if (recentActivity && recentActivity.length > 0) {
    csvData.push({}); // Empty line
    csvData.push({}); // Empty line
    csvData.push({ "Recent Call Activity": "" }); // Section heading
    csvData.push({}); // Empty line
    
    // Headers
    csvData.push({
      "From": "From",
      "To": "To",
      "Template": "Template",
      "Category": "Category",
      "Status": "Status",
      "Created At": "Created At",
    });
    
    // Data rows
    recentActivity.forEach((call: any) => {
      csvData.push({
        "From": call.phoneNumberFrom ?? "",
        "To": call.phoneNumberTo ?? "",
        "Template": call.scriptUsed?.name ?? "No Script/Flow",
        "Category": call.template ?? "Custom Script",
        "Status": call.status ?? "",
        "Created At": call.createdAt ?? "",
      });
    });
  }

  return csvData;
}