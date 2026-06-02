import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  getProductHistory,
  PriceHistoryEntry,
} from "../services/productService.js";
import { formatARS } from "../utils/format.js";
import { relativeDate } from "../utils/date.js";

interface Props {
  productId: string;
  currentPrice: number;
  currentDate: string;
}

export function PriceHistoryChart({
  productId,
  currentPrice,
  currentDate,
}: Props) {
  const [history, setHistory] = useState<PriceHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductHistory(productId);
        setHistory(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  if (loading)
    return <div className="price-history-loading">Cargando historial...</div>;

  // Combinamos historial + precio actual
  const chartData = [
    ...history.map((h) => ({
      price: h.price,
      date: relativeDate(h.createdAt),
    })),
    {
      price: currentPrice,
      date: relativeDate(currentDate),
    },
  ];

  if (chartData.length < 2) {
    return (
      <div className="price-history-empty">
        <p>Todavía no hay historial de precios.</p>
        <p>Aparecerá acá cuando edites el precio por primera vez.</p>
      </div>
    );
  }

  return (
    <div className="price-history-chart">
      <p className="price-history-title">Historial de precios</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            width={40}
          />
          <Tooltip
            formatter={(value) => [formatARS(Number(value)), "Precio"]}
            labelStyle={{ fontSize: 11 }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.08)",
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#E8590C"
            strokeWidth={2}
            dot={{ fill: "#E8590C", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
