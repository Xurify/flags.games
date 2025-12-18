import React, { ReactNode } from "react";

interface HeaderProps {
  leftContent: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ leftContent }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-card/80 backdrop-blur-sm px-6 py-4 border-2 border-foreground shadow-retro rounded-sm w-full max-w-2xl">
        <div className="flex items-center w-full">
          {leftContent}
        </div>
      </div>
    </div>
  );
};

export default Header;