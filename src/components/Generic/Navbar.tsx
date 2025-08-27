import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="px-6 py-3 flex items-center justify-between border-b border-gray-700" style={{ backgroundColor: "#151515" }}>
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        {/* Red Circle Icon */}
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full opacity-90"></div>
        </div>
        
        {/* OptimaleMD Text */}
        <span className="text-white text-xl font-semibold tracking-wide">
          OPTIMALE<span className="text-red-500">MD</span>
        </span>
      </div>

      {/* Profile Avatar */}
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;