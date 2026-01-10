import { CheckCircle } from 'lucide-react';

const ProfileCompletionBar = ({ percentage }) => {
    const getColor = () => {
        if (percentage >= 80) return 'bg-success';
        if (percentage >= 50) return 'bg-warning';
        return 'bg-error';
    };

    const getTextColor = () => {
        if (percentage >= 80) return 'text-success';
        if (percentage >= 50) return 'text-warning';
        return 'text-error';
    };

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <CheckCircle className={`w-5 h-5 ${getTextColor()}`} />
                    <span className="font-semibold text-gray-900">Profile Completion</span>
                </div>
                <span className={`font-bold ${getTextColor()}`}>{Math.round(percentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                    className={`h-3 rounded-full transition-all duration-300 ${getColor()}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {percentage < 80 && (
                <p className="text-sm text-gray-600 mt-2">
                    Complete your profile to unlock more opportunities!
                </p>
            )}
        </div>
    );
};

export default ProfileCompletionBar;
