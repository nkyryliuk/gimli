export const DragonLogo = ({ className = "", size = 48 }: { className?: string; size?: number }) => (
  <img 
    src="/dragon-logo.png"
    alt="D&D Dragon Logo"
    className={className}
    style={{ 
      width: size,
      height: size,
      objectFit: 'contain'
    }}
  />
); 