export default function DashboardTable({ title, description, columns, rows, emptyMessage }) {
  return (
    <section className="dashboard-panel">
      <div className="panel-heading">
        <div><h2>{title}</h2><p>{description}</p></div>
      </div>
      {rows.length ? (
        <div className="table-scroll">
          <table>
            <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="table-empty">{emptyMessage}</p>}
    </section>
  );
}
