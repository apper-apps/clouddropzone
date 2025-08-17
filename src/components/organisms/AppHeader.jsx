import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function AppHeader() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
            <ApperIcon name="Upload" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">File Manager</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
          >
            <ApperIcon name="LogOut" size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

export default AppHeader;