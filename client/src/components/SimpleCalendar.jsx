import React from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function SimpleCalendar({ tasks }) {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const days = [];
  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), i);
    const hasTask = tasks.some(
      (t) => new Date(t.dueDate).toDateString() === d.toDateString()
    );
    days.push({ date: d, hasTask });
  }

  return (
    <div>
      <h3>
        {today.toLocaleString("default", { month: "long" })} {today.getFullYear()}
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {daysOfWeek.map((day) => (
          <div key={day} style={{ fontWeight: "bold", textAlign: "center" }}>
            {day}
          </div>
        ))}
        {Array(startOfMonth.getDay())
          .fill(null)
          .map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
        {days.map((d) => (
          <div
            key={d.date}
            style={{
              textAlign: "center",
              padding: "8px",
              borderRadius: "50%",
              margin: "2px",
              background:
                d.date.toDateString() === today.toDateString()
                  ? "#2563eb"
                  : d.hasTask
                  ? "#34d399"
                  : "transparent",
              color:
                d.date.toDateString() === today.toDateString() || d.hasTask
                  ? "white"
                  : "black",
            }}
          >
            {d.date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimpleCalendar;
