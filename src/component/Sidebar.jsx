import { Link } from "react-router-dom";
import { HomeIcon, ClipboardDocumentListIcon, ChartBarIcon, ExclamationTriangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const NavItem = ({ icon: Icon, label, to }) => (
  <Link to={to} className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition">
    <Icon className="w-6 h-6 text-blue-600" /> <span>{label}</span>
  </Link>
);

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg px-6 py-6 space-y-3">
      <NavItem icon={HomeIcon} label="Dashboard" to="/dashboard" />
      <NavItem icon={ClipboardDocumentListIcon} label="Symptom Tracker" to="/tracker" />
      <NavItem icon={ClipboardDocumentListIcon} label="ADHD Test" to="/quiz" />
      <NavItem icon={ChartBarIcon} label="Progress & Insights" to="/progress" />
      <NavItem icon={ExclamationTriangleIcon} label="Severity Check" to="/severity" />
      <NavItem icon={Cog6ToothIcon} label="Settings" to="/settings" />
    </aside>
  );
}
