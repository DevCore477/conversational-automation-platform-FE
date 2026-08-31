// lib/dashboard/export-csv.ts
import Papa from "papaparse";

export function downloadCSV(data: any[], filename = "data.csv") {
  if (!data || !data.length) {
    console.warn("No data to export");
    return;
  }

  const processedRows: string[][] = [];

  for (const row of data) {
    // Empty line
    if (!row || Object.keys(row).length === 0) {
      processedRows.push([]);
      continue;
    }

    // Section heading
    if (Object.keys(row).length === 1) {
      const sectionName = Object.keys(row)[0];
      processedRows.push([`=== ${sectionName.toUpperCase()} ===`]);
      continue;
    }

    // Regular row
    processedRows.push(
      Object.values(row).map((value) => {
        if (value === undefined || value === null) return "";
        return String(value);
      })
    );
  }

  // Generate CSV using PapaParse
  const csvString = Papa.unparse(processedRows, {
    quotes: false,
    skipEmptyLines: false,
  });

  // Add BOM for Excel UTF-8 support
  const blob = new Blob(["\uFEFF" + csvString], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}