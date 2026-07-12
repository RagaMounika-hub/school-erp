import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function DashboardChart({ teachers, students }) {
    const chartData = {
  labels: ["Teachers", "Students"],
  datasets: [
    {
      label: "Users",
      data: [teachers, students],
      backgroundColor: ["#1cc88a", "#f6c23e"],
      borderRadius: 8,
    },
  ],
};

return (
  <div className="card shadow mt-4">
    <div className="card-body">
      <h4>User Statistics</h4>
      <div style={{ height: "350px" }}>
      <Bar
  data={chartData}
  options={{
    responsive: true,
    maintainAspectRatio: false,
  }}
/>
</div>
    </div>
  </div>
);
}

export default DashboardChart;