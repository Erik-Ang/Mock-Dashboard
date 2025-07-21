import { useState } from "react";
import "./App.css";
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";
import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import "./i18n";

import { useTranslation } from "react-i18next";

const data = [
  { name: "Acadia University", ftu: 3680, ftg: 146, ptu: 330, ptg: 314 },
  { name: "Cape Breton University", ftu: 7148, ftg: 304, ptu: 451, ptg: 142 },
  { name: "Dalhousie University", ftu: 14588, ftg: 4060, ptu: 1624, ptg: 740 },
  {
    name: "Mount Saint Vincent University",
    ftu: 2418,
    ftg: 193,
    ptu: 482,
    ptg: 743,
  },
  { name: "NSCAD University", ftu: 590, ftg: 51, ptu: 195, ptg: 13 },
  { name: "Saint Mary's University", ftu: 4838, ftg: 612, ptu: 400, ptg: 121 },
  {
    name: "St. Francis Xavier University",
    ftu: 3872,
    ftg: 115,
    ptu: 454,
    ptg: 641,
  },
  { name: "Université Sainte-Anne", ftu: 489, ftg: 10, ptu: 39, ptg: 22 },
  { name: "University of King's College", ftu: 877, ftg: 115, ptu: 26, ptg: 0 },
];

const pieGroups = [
  { key: "ftu", label: "Full Time Undergraduate" },
  { key: "ftg", label: "Full Time Graduate" },
  { key: "ptu", label: "Part Time Undergraduate" },
  { key: "ptg", label: "Part Time Graduate" },
];

function App() {
  const [selected, setSelected] = useState(data.map((d) => d.name));
  const [pieGroup, setPieGroup] = useState("ftu");
  const [sortKey, setSortKey] = useState("ftu");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleChange = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const filteredData = data.filter((d) => selected.includes(d.name));

  const barData = [
    {
      group: "Full Time Undergraduate",
      ...Object.fromEntries(filteredData.map((u) => [u.name, u.ftu])),
    },
    {
      group: "Full Time Graduate",
      ...Object.fromEntries(filteredData.map((u) => [u.name, u.ftg])),
    },
    {
      group: "Part Time Undergraduate",
      ...Object.fromEntries(filteredData.map((u) => [u.name, u.ptu])),
    },
    {
      group: "Part Time Graduate",
      ...Object.fromEntries(filteredData.map((u) => [u.name, u.ptg])),
    },
  ];

  const pieData = filteredData.map((u) => ({
    name: u.name,
    value: u[pieGroup],
  }));

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#a4de6c",
    "#d0ed57",
    "#8dd1e1",
    "#83a6ed",
    "#8e4585",
  ];

  const renderPieLabel = ({ value, percent }) =>
    `${(percent * 100).toFixed(1)}%`;

  const sortedData = [...data].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];
    if (valA === undefined || valB === undefined) return 0;
    if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Arrow rendering helper
  const renderArrow = (key) => {
    if (sortKey === key) {
      return (
        <span style={{ fontSize: "0.8em" }}>
          {sortOrder === "asc" ? "▲" : "▼"}
        </span>
      );
    }
    return (
      <span style={{ fontSize: "0.8em", color: "#bbb" }}>
        {sortOrder === "asc" ? "△" : "▽"}
      </span>
    );
  };

  const { t, i18n } = useTranslation();

  const handleLanguageToggle = () => {
    i18n.changeLanguage(i18n.language === "en" ? "fr" : "en");
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col overflow-hidden p-16 text-black">
      <h1 className="w-full text-2xl font-bold text-center mb-4 pb-8">
        {t("title")}
      </h1>
      <div className="fixed top-6 right-8 z-10">
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleLanguageToggle}
        >
          {i18n.language === "en" ? "Français" : "English"}
        </button>
      </div>
      <div className="w-full flex-1 flex flex-row items-stretch gap-4">
        <div className="w-2/3 h-full flex flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-white">
          <h2 className="text-xl font-semibold mb-2 text-center">
            {t("bar_chart")}
          </h2>
          <ResponsiveContainer width="95%" height="90%">
            <BarChart
              data={barData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis />
              <Tooltip />
              {filteredData.map((u, idx) => (
                <Bar
                  key={u.name}
                  dataKey={u.name}
                  fill={colors[idx % colors.length]}
                  name={u.name}
                  stroke="none"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/3 h-full flex flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-white">
          <h2 className="text-xl font-semibold mb-2 text-center">
            {t("pie_chart")}
          </h2>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={renderPieLabel}
                labelLine={true}
              >
                {pieData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={colors[idx % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mb-4">
            {pieGroups.map((g) => (
              <label key={g.key} className="mr-4">
                <input
                  type="radio"
                  name="pieGroup"
                  value={g.key}
                  checked={pieGroup === g.key}
                  onChange={() => setPieGroup(g.key)}
                />
                <span className="ml-1">{g.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center mt-6 mb-4 border-gray-300 rounded-lg border-2 bg-white">
        <div className="w-full">
          <table className="w-full overflow-hidden">
            <thead>
              <tr>
                <th className="p-2 text-left">{t("include")}</th>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  {t("university")} {renderArrow("name")}
                </th>
                <th
                  className="p-2 text-right cursor-pointer"
                  onClick={() => handleSort("ftu")}
                >
                  {t("ftu")} {renderArrow("ftu")}
                </th>
                <th
                  className="p-2 text-right cursor-pointer"
                  onClick={() => handleSort("ftg")}
                >
                  {t("ftg")} {renderArrow("ftg")}
                </th>
                <th
                  className="p-2 text-right cursor-pointer"
                  onClick={() => handleSort("ptu")}
                >
                  {t("ptu")} {renderArrow("ptu")}
                </th>
                <th
                  className="p-2 text-right cursor-pointer"
                  onClick={() => handleSort("ptg")}
                >
                  {t("ptg")} {renderArrow("ptg")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((u, idx) => (
                <tr key={u.name} className="border-t border-gray-200">
                  <td className="p-2 text-left pl-6">
                    <input
                      type="checkbox"
                      checked={selected.includes(u.name)}
                      onChange={() => handleChange(u.name)}
                    />
                  </td>
                  <td className="p-2 flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded"
                      style={{ backgroundColor: colors[idx % colors.length] }}
                    ></span>
                    {u.name}
                  </td>
                  <td className="p-2 text-right">{u.ftu}</td>
                  <td className="p-2 text-right">{u.ftg}</td>
                  <td className="p-2 text-right">{u.ptu}</td>
                  <td className="p-2 text-right">{u.ptg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
