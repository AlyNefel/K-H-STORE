import React, { useState } from 'react';

// Official K&H Brand Identity Image Asset
export const OFFICIAL_LOGO_SRC = '/assets/aistudio/WhatsApp_Image_2026-10-29_at_09.39.56_9448d2f6.jpeg';

interface BrandLogoProps {
  variant?: 'dark' | 'light' | 'gold' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  animate?: boolean;
  imageOnly?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSlogan = true,
  animate = true,
  imageOnly = false,
  className = '',
}) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  // Responsive dimension mapping
  const dimensions = {
    sm: { width: 145, height: 44, emblem: 40, fontSize: 18, subSize: 8, sloganSize: 9 },
    md: { width: 210, height: 60, emblem: 52, fontSize: 24, subSize: 10, sloganSize: 11 },
    lg: { width: 260, height: 76, emblem: 68, fontSize: 30, subSize: 12, sloganSize: 13 },
    xl: { width: 320, height: 104, emblem: 92, fontSize: 38, subSize: 14, sloganSize: 15 },
  }[size];

  // Palette mapping
  const colors = {
    dark: {
      emblemBg: '#FFF9F5',
      emblemText: '#C5A477',
      primaryText: '#292626',
      subText: '#B77D83',
      sloganText: '#7A6B69',
      border: '#C5A477',
    },
    light: {
      emblemBg: '#FFFFFF',
      emblemText: '#C5A477',
      primaryText: '#FFFFFF',
      subText: '#F5E7E5',
      sloganText: '#EADCD8',
      border: '#C5A477',
    },
    gold: {
      emblemBg: '#FFF9F5',
      emblemText: '#292626',
      primaryText: '#C5A477',
      subText: '#F5E7E5',
      sloganText: '#B77D83',
      border: '#FFF9F5',
    },
    monochrome: {
      emblemBg: '#FFFFFF',
      emblemText: '#292626',
      primaryText: '#292626',
      subText: '#555555',
      sloganText: '#777777',
      border: '#292626',
    }
  }[variant];

  // If user requests standalone image badge
  if (imageOnly) {
    return (
      <div 
        style={{ width: dimensions.emblem, height: dimensions.emblem }}
        className={`rounded-full overflow-hidden border border-[#C5A477]/50 shadow-md relative bg-[#F5E7E5] shrink-0 ${
          animate ? 'animate-logo-spin-glow' : ''
        } ${className}`}
      >
        <img 
          src={OFFICIAL_LOGO_SRC} 
          alt="K&H Online Store" 
          className="w-full h-full object-cover scale-105"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${animate ? 'animate-logo-aura' : ''} ${className}`}>
      {/* Official Luxury Circular Logo Emblem with 4-Second Spin & Glow */}
      <div 
        style={{
          width: dimensions.emblem,
          height: dimensions.emblem,
          backgroundColor: colors.emblemBg,
          borderColor: colors.border,
        }}
        className={`rounded-full border-2 shadow-md flex items-center justify-center shrink-0 relative overflow-hidden transition-all duration-300 hover:scale-105 ${
          animate ? 'animate-logo-spin-glow' : ''
        }`}
      >
        {imageLoaded ? (
          <img 
            src={OFFICIAL_LOGO_SRC} 
            alt="K&H Online Store" 
            onError={() => setImageLoaded(false)}
            className="w-full h-full object-cover scale-[1.08]"
          />
        ) : (
          <>
            <div 
              className="absolute inset-1 rounded-full border border-dashed opacity-40 pointer-events-none"
              style={{ borderColor: colors.emblemText }}
            />
            <span 
              style={{ 
                color: colors.emblemText, 
                fontSize: dimensions.fontSize * 0.75,
                fontFamily: "'Amiri', 'Cormorant Garamond', Georgia, serif"
              }} 
              className="font-bold tracking-tight z-10"
            >
              K&amp;H
            </span>
          </>
        )}
      </div>

      {/* Brand Typography & Tagline */}
      <div className="flex flex-col text-start justify-center">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span 
            style={{ 
              color: colors.primaryText, 
              fontSize: dimensions.fontSize,
              fontFamily: "'Amiri', 'Cormorant Garamond', Georgia, serif"
            }} 
            className="font-bold tracking-wider"
          >
            K&amp;H
          </span>
          <span 
            style={{ 
              color: colors.subText, 
              fontSize: dimensions.subSize,
              letterSpacing: '0.18em'
            }} 
            className="font-semibold uppercase"
          >
            ONLINE STORE
          </span>
        </div>

        {showSlogan && (
          <span 
            style={{ 
              color: colors.sloganText, 
              fontSize: dimensions.sloganSize,
              fontFamily: "'Cairo', sans-serif" 
            }} 
            className="font-medium tracking-normal mt-0.5 leading-tight opacity-90"
          >
            كل ما يهم المرأة و المنزل
          </span>
        )}
      </div>
    </div>
  );
};
