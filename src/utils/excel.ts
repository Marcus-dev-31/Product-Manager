import * as XLSX from "xlsx";

export interface ProductRow {
  nombre: string;
  precio: number;
  precioUnitario?: number;
}

export const exportToExcel = (
  products: { name: string; price: number; unitPrice?: number }[],
) => {
  if (products.length === 0) {
    throw new Error("No hay productos para exportar");
  }
  const rows = products.map((p) => ({
    nombre: p.name,
    precio: p.price,
    precioUnitario: p.unitPrice ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Productos");
  XLSX.writeFile(wb, "precify-productos.xlsx");
};

export const exportToCSV = (
  products: { name: string; price: number; unitPrice?: number }[],
) => {
  if (products.length === 0) {
    throw new Error("No hay productos para exportar");
  }
  const rows = products.map((p) => ({
    nombre: p.name,
    precio: p.price,
    precioUnitario: p.unitPrice ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "precify-productos.csv";
  a.click();
  URL.revokeObjectURL(url);
};

export const parseImportFile = (file: File): Promise<ProductRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<ProductRow>(ws);

        const valid = rows.filter(
          (r) => r.nombre && r.precio && !isNaN(Number(r.precio)),
        );
        resolve(valid);
      } catch {
        reject(new Error("Error al leer el archivo"));
      }
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsBinaryString(file);
  });
};
