import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Consistent back / secondary navigation link used across Dakshath pages.
 */
const BackLink = ({ to, label = 'Back', className = '' }) => {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
};

export default BackLink;
