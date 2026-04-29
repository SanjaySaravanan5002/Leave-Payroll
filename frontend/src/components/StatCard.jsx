const StatCard = ({ label, value, tone = "neutral" }) => (
  <div className={`stat-card ${tone}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default StatCard;
