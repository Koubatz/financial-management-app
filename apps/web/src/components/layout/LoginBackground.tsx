import React from 'react';

export function LoginBackground() {
  const shapes = [
    {
      floating: true,
      style: {
        left: '1.5%',
        top: '18%',
        width: '1rem',
        height: '1rem',
        background: '#a8ddd3',
      },
    },
    {
      style: {
        left: '11.9%',
        top: '5.3%',
        width: '14.3%',
        height: '21.1%',
        transform: 'rotate(-45deg)',
        background: '#a8ddd3',
      },
    },
    {
      style: {
        left: '11.9%',
        top: '26.3%',
        width: '14.3%',
        height: '13.2%',
        transform: 'rotate(-45deg)',
        background: '#a78bfa',
      },
    },
    {
      floating: true,
      style: {
        left: '33.3%',
        top: '10.5%',
        width: '1rem',
        height: '1rem',
        background: '#e2bec6',
      },
    },
    {
      style: {
        left: '33.3%',
        top: '15.8%',
        width: '9.5%',
        height: '10.5%',
        transform: 'rotate(-45deg)',
        background: '#e2bec6',
      },
    },
    {
      style: {
        left: '42.9%',
        top: '2.6%',
        width: '11.9%',
        height: '10.5%',
        transform: 'rotate(-45deg)',
        background: '#d3b4d3',
      },
    },
    {
      style: {
        left: '42.9%',
        top: '13.2%',
        width: '11.9%',
        height: '15.8%',
        transform: 'rotate(-45deg)',
        background: '#a8ddd3',
      },
    },
    {
      style: {
        left: '54.8%',
        top: '15.8%',
        width: '16.7%',
        height: '13.2%',
        transform: 'rotate(-45deg)',
        background: '#a78bfa',
      },
    },
    {
      floating: true,
      style: {
        left: '80%',
        top: '20%',
        width: '1rem',
        height: '1rem',
        background: '#a78bfa',
      },
    },
    {
      floating: true,
      style: {
        left: '16%',
        top: '80%',
        width: '1rem',
        height: '1rem',
        background: '#d3b4d3',
      },
    },
    {
      style: {
        left: '26.2%',
        top: '71.1%',
        width: '16.7%',
        height: '13.2%',
        transform: 'rotate(-45deg)',
        background: '#d3b4d3',
      },
    },
    {
      style: {
        left: '42.9%',
        top: '71.1%',
        width: '11.9%',
        height: '15.8%',
        transform: 'rotate(-45deg)',
        background: '#a78bfa',
      },
    },
    {
      style: {
        left: '42.9%',
        top: '86.8%',
        width: '9.5%',
        height: '10.5%',
        transform: 'rotate(-45deg)',
        background: '#a8ddd3',
      },
    },
    // Large top-left cluster
    {
      style: {
        left: '54.8%',
        top: '73.7%',
        width: '9.5%',
        height: '10.5%',
        transform: 'rotate(-45deg)',
        background: '#d3b4d3',
      },
    },
    {
      floating: true,
      style: {
        left: '57.1%',
        top: '89.5%',
        width: '1rem',
        height: '1rem',
        background: '#a8ddd3',
      },
    },
    {
      style: {
        left: '71.4%',
        top: '73.7%',
        width: '14.3%',
        height: '21.1%',
        transform: 'rotate(-45deg)',
        background: '#e2bec6',
      },
    },
    // Large top-left cluster
    {
      style: {
        left: '71.4%',
        top: '60.5%',
        width: '14.3%',
        height: '13.2%',
        transform: 'rotate(-45deg)',
        background: '#a78bfa',
      },
    },
    {
      floating: true,
      style: {
        left: '91%',
        top: '83%',
        width: '1rem',
        height: '1rem',
        background: '#e2bec6',
      },
    },
  ];

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-0"
      aria-hidden
    >
      <style>{`@-webkit-keyframes loginDotFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } } @keyframes loginDotFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }`}</style>

      {/* Centered container for background shapes */}
      <div className="relative w-[42rem] h-[38rem] max-w-[90vw] max-h-[80vh]">
        {shapes.map((s, i) => {
          const isFloating = !!s.floating;
          return (
            <div
              key={i}
              className={
                isFloating ? 'absolute rounded-full filter' : 'absolute rounded-2xl filter'
              }
              style={{
                ...s.style,
                // Ensure large corner radii for squares unless overridden
                // borderRadius: s.style.borderRadius ?? (isFloating ? '9999px' : '1rem'),
                // boxShadow: '0 30px 60px rgba(0,0,0,0.06)',
                // When the shape is floating, animate the element that has the visible background
                ...(isFloating
                  ? { willChange: 'transform', animation: 'loginDotFloat 2s ease-in-out infinite' }
                  : {}),
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
