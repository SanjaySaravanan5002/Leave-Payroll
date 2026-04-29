import { BadgeCheck } from "lucide-react";

const BrandLogo = ({ compact = false }) => (
  <div className="brand-lockup">
    <div className="brand-mark" aria-hidden="true">
      <BadgeCheck size={compact ? 20 : 22} />
    </div>
    <div>
      <strong>PeopleCore HR</strong>
      {!compact && <span>Workforce Operations</span>}
    </div>
  </div>
);

export default BrandLogo;
