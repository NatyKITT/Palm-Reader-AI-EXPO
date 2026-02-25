import React from "react";

const AspectRatio = ({children, ratio = 16 / 9, className = ""}: {
  children: React.ReactNode;
  ratio?: number;
  className?: string;
}) => {
  const paddingBottom = `${100 / ratio}%`;

  return (
      <div className={`aspect-ratio ${className}`} style={{position: 'relative', width: '100%', paddingBottom}}>
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
          {children}
        </div>
      </div>
  );
};

export default AspectRatio;