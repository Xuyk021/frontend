export const MOCK_BY_YEAR = {
  assistant_text: "I will show you the number of papers by year.",
  intent: "papers_by_year",
  sql: `SELECT p.Year AS Year, COUNT(*) AS count
FROM psu_papers p
WHERE p.Year IS NOT NULL
GROUP BY p.Year
ORDER BY p.Year
LIMIT 5000`,
  data_preview: [
    { Year: 2017.0, count: 1051 },
    { Year: 2018.0, count: 1127 },
    { Year: 2019.0, count: 1171 },
    { Year: 2020.0, count: 1310 },
    { Year: 2021.0, count: 1316 },
    { Year: 2022.0, count: 25 }
  ],
  vega_lite_spec: {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",
    data: { values: [
      { Year: 2017.0, count: 1051 },
      { Year: 2018.0, count: 1127 },
      { Year: 2019.0, count: 1171 },
      { Year: 2020.0, count: 1310 },
      { Year: 2021.0, count: 1316 },
      { Year: 2022.0, count: 25 }
    ]},
    params: [
      { name: "pick", select: { type: "point", fields: ["Year"] } },
      { name: "hover", select: { type: "point", on: "mouseover", clear: "mouseout" } }
    ],
    mark: { type: "bar" },
    encoding: {
      x: { field: "Year", type: "ordinal", sort: "ascending", title: "Year" },
      y: { field: "count", type: "quantitative", title: "count" },
      tooltip: [
        { field: "Year", type: "ordinal" },
        { field: "count", type: "quantitative" }
      ],
      opacity: { condition: { param: "pick", value: 1 }, value: 0.6 }
    },
    config: { view: { stroke: "transparent" } }
  },
  issues: [],
  meta: { columns: ["Year", "count"], n_rows: 6 }
}

export const MOCK_BY_FIELD = {
  assistant_text: "I will show you the number of papers by field (top 15).",
  intent: "papers_by_field",
  sql: `SELECT f.Field_Name AS Field, COUNT(DISTINCT p.PaperID) AS count
FROM psu_papers p
JOIN psu_paper_fields pf ON pf.PaperID = p.PaperID
JOIN psu_fields f ON f.FieldID = pf.FieldID
WHERE f.Field_Name IS NOT NULL AND f.Field_Name <> ''
GROUP BY f.Field_Name
ORDER BY count DESC
LIMIT 15`,
  data_preview: [
    { Field: "Computer Science", count: 980 },
    { Field: "Information Systems", count: 620 },
    { Field: "Artificial Intelligence", count: 510 },
    { Field: "Human-Computer Interaction", count: 420 },
    { Field: "Data Mining", count: 380 },
    { Field: "Networks", count: 310 },
    { Field: "Software Engineering", count: 290 },
    { Field: "Bioinformatics", count: 210 },
    { Field: "Robotics", count: 190 },
    { Field: "Cybersecurity", count: 170 },
    { Field: "Education", count: 160 },
    { Field: "Health Informatics", count: 150 },
    { Field: "Visualization", count: 120 },
    { Field: "Statistics", count: 110 },
    { Field: "Economics", count: 100 }
  ],
  vega_lite_spec: {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",
    description: "Papers by Field",
    data: { values: [
      { Field: "Computer Science", count: 980 },
      { Field: "Information Systems", count: 620 },
      { Field: "Artificial Intelligence", count: 510 },
      { Field: "Human-Computer Interaction", count: 420 },
      { Field: "Data Mining", count: 380 },
      { Field: "Networks", count: 310 },
      { Field: "Software Engineering", count: 290 },
      { Field: "Bioinformatics", count: 210 },
      { Field: "Robotics", count: 190 },
      { Field: "Cybersecurity", count: 170 },
      { Field: "Education", count: 160 },
      { Field: "Health Informatics", count: 150 },
      { Field: "Visualization", count: 120 },
      { Field: "Statistics", count: 110 },
      { Field: "Economics", count: 100 }
    ]},
    params: [
      { name: "pick", select: { type: "point", fields: ["Field"] } },
      { name: "hover", select: { type: "point", on: "mouseover", clear: "mouseout" } }
    ],
    mark: { type: "bar" },
    encoding: {
      y: { field: "Field", type: "nominal", sort: "-x", title: "Field" },
      x: { field: "count", type: "quantitative", title: "count" },
      tooltip: [
        { field: "Field", type: "nominal" },
        { field: "count", type: "quantitative" }
      ],
      opacity: { condition: { param: "pick", value: 1 }, value: 0.6 }
    },
    config: { view: { stroke: "transparent" } }
  },
  issues: [],
  meta: { columns: ["Field", "count"], n_rows: 15 }
}

export const MOCK_UNSUPPORTED = {
  assistant_text: "Unsupported request for the current subset schema.",
  intent: "unsupported",
  sql: null,
  data_preview: [],
  vega_lite_spec: null,
  issues: [],
  meta: { columns: [], n_rows: 0 }
}