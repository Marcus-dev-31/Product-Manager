import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Upload, FileText, Table } from "lucide-react";
import {
  exportToExcel,
  exportToCSV,
  parseImportFile,
  ProductRow,
} from "../utils/excel.js";
import { createProduct, getProducts } from "../services/productService.js";

export function ImportExportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: number;
    errors: number;
  } | null>(null);
  const [error, setError] = useState("");

  const handleExportExcel = async () => {
    try {
      const products = await getProducts();
      exportToExcel(products);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  };

  const handleExportCSV = async () => {
    try {
      const products = await getProducts();
      exportToCSV(products);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError("");
    setImportResult(null);

    try {
      const rows: ProductRow[] = await parseImportFile(file);

      if (rows.length === 0) {
        setError("El archivo no tiene filas válidas. Verificá el formato.");
        return;
      }

      let success = 0;
      let errors = 0;

      for (const row of rows) {
        try {
          await createProduct({
            name: String(row.nombre),
            price: Number(row.precio),
            unitPrice: row.precioUnitario
              ? Number(row.precioUnitario)
              : undefined,
          });
          success++;
        } catch {
          errors++;
        }
      }

      setImportResult({ success, errors });
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(
          "No se pudo leer el archivo. Verificá que sea un .xlsx o .csv válido.",
        );
      }
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="settings-back" onClick={() => navigate("/")}>
          ←
        </button>
        <h2>Importar / Exportar</h2>
      </div>

      <div className="ie-section">
        <p className="ie-section-title">Exportar productos</p>
        <p className="ie-section-hint">
          Descargá tu lista de productos para editarla o hacer un respaldo
        </p>
        <div className="ie-buttons">
          <button className="ie-btn" onClick={handleExportExcel}>
            <Table size={18} />
            <span>Exportar Excel</span>
            <Download size={14} />
          </button>
          <button className="ie-btn" onClick={handleExportCSV}>
            <FileText size={18} />
            <span>Exportar CSV</span>
            <Download size={14} />
          </button>
        </div>
      </div>

      <div className="ie-section">
        <p className="ie-section-title">Importar productos</p>
        <p className="ie-section-hint">
          El archivo debe tener las columnas: <strong>nombre</strong>,{" "}
          <strong>precio</strong> y opcionalmente{" "}
          <strong>precioUnitario</strong>
        </p>
        <button
          className="ie-btn ie-btn--primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
        >
          <Upload size={18} />
          <span>{importing ? "Importando..." : "Seleccionar archivo"}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.csv"
          onChange={handleImport}
          style={{ display: "none" }}
        />
        {error && <p className="settings-error">{error}</p>}
        {importResult && (
          <div className="ie-result">
            <p className="ie-result-success">
              ✓ {importResult.success} productos importados
            </p>
            {importResult.errors > 0 && (
              <p className="ie-result-error">
                ✗ {importResult.errors} filas con error
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
