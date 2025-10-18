import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const GlowCard = ({
  children,
  className = '',
  glowColor = '132, 0, 255',
  enableHover = true,
  enableClick = true,
  onClick
}) => {
  const cardRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (!enableHover || !cardRef.current) return;

    const card = cardRef.current;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const relativeX = (x / rect.width) * 100;
      const relativeY = (y / rect.height) * 100;

      card.style.setProperty('--glow-x', `${relativeX}%`);
      card.style.setProperty('--glow-y', `${relativeY}%`);
      card.style.setProperty('--glow-opacity', '1');
    };

    const handleMouseLeave = () => {
      card.style.setProperty('--glow-opacity', '0');
    };

    const handleClick = (e) => {
      if (!enableClick) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      card.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );

      if (onClick) onClick(e);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('click', handleClick);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('click', handleClick);
    };
  }, [enableHover, enableClick, glowColor, onClick]);

  return (
    <div
      ref={cardRef}
      className={`glow-card ${className}`}
      style={{
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-opacity': '0',
        '--glow-color': glowColor
      }}
    >
      {children}
    </div>
  );
};

export default GlowCard;

