"use client";

import { isValidElement } from "react";

function BenefitsCurves() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block w-full h-full">
      <svg
        // Using your exact Figma dimensions for the coordinate system
        viewBox="0 0 1445 486"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Upper Curve 1 */}
        <path
          d="M336.429 150.209C337.744 150.053 338.685 148.858 338.51 147.545C332.67 103.709 309.966 63.8369 275.172 36.4387C239.749 8.54541 194.696 -4.13376 149.925 1.19046C105.154 6.51468 64.3311 29.4062 36.4378 64.8291C9.03963 99.6231 -3.67977 143.708 0.922916 187.691C1.06077 189.009 2.25568 189.949 3.57091 189.793C4.88614 189.636 5.82359 188.442 5.68628 187.125C1.23346 144.405 13.595 101.591 40.2061 67.7964C67.3125 33.373 106.983 11.1273 150.491 5.95331C194 0.779327 237.781 13.1008 272.205 40.2071C305.999 66.8182 328.057 105.539 333.747 148.112C333.922 149.425 335.114 150.366 336.429 150.209Z"
          fill="#D6E4F0"
        />

        {/* Diagonal 1 */}
        <path
          d="M335 142.001L372.5 343.501"
          stroke="#D6E4F0"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Lower Curve 1 */}
        <path
          d="M703.929 339.623C705.24 339.81 706.153 341.025 705.948 342.334C699.712 382.113 679.549 418.418 649.016 444.746C617.877 471.598 578.061 486.253 536.944 485.998C495.828 485.742 456.197 470.594 425.393 443.358C395.19 416.652 375.48 380.1 369.738 340.246C369.549 338.935 370.477 337.731 371.791 337.561C373.104 337.39 374.305 338.318 374.495 339.629C380.087 378.332 399.236 413.827 428.571 439.765C458.505 466.232 497.018 480.953 536.974 481.201C576.931 481.449 615.623 467.208 645.884 441.114C675.539 415.543 695.126 380.289 701.199 341.658C701.405 340.349 702.617 339.436 703.929 339.623Z"
          fill="#D6E4F0"
        />

        {/* Diagonal 2 */}
        <path
          d="M741.5 142.001L703.5 343.501"
          stroke="#D6E4F0"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Upper Curve 2 */}
        <path
          d="M1073.43 150.209C1074.74 150.053 1075.69 148.859 1075.51 147.546C1070.19 107.622 1050.86 70.8535 1020.93 43.8265C990.404 16.2631 950.921 0.700867 909.798 0.0239868C868.675 -0.652863 828.701 13.6016 797.284 40.1454C766.479 66.1728 745.951 102.285 739.32 142.012C739.102 143.319 740.003 144.543 741.312 144.743C742.622 144.942 743.843 144.041 744.062 142.735C750.517 104.155 770.461 69.0876 800.38 43.8092C830.91 18.0143 869.756 4.16202 909.719 4.81979C949.682 5.47754 988.051 20.6007 1017.72 47.3864C1046.79 73.6358 1065.56 109.341 1070.75 148.112C1070.92 149.425 1072.11 150.366 1073.43 150.209Z"
          fill="#D6E4F0"
        />

        {/* Diagonal 3 */}
        <path
          d="M1072 142.001L1109.5 343.501"
          stroke="#D6E4F0"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Lower Curve 2 */}
        <path
          d="M1442.6 316.001C1443.93 316.001 1445 317.076 1444.98 318.4C1444.39 360.516 1428.18 400.946 1399.44 431.82C1370.16 463.28 1330.05 482.483 1287.19 485.564C1244.32 488.645 1201.88 475.375 1168.4 448.426C1135.55 421.978 1113.72 384.282 1107.11 342.684C1106.9 341.376 1107.81 340.158 1109.12 339.969C1110.43 339.779 1111.65 340.69 1111.85 341.998C1118.29 382.396 1139.5 419.002 1171.41 444.69C1203.94 470.879 1245.19 483.773 1286.84 480.78C1328.5 477.786 1367.48 459.125 1395.93 428.553C1423.84 398.566 1439.59 359.303 1440.19 318.4C1440.21 317.076 1441.28 316.001 1442.6 316.001Z"
          fill="#D6E4F0"
        />
      </svg>
    </div>
  );
}

function BenefitCard({
  icon,
  label,
  index,
  isMobileGrid,
}: {
  icon: any;
  label: string;
  index: number;
  isMobileGrid?: boolean;
}) {
  const isTopRow = index % 2 === 0;
  const isMobileLeftColumn = isMobileGrid ? index % 2 === 0 : false;
  
  return (
    <div
      className={`
        font-dm-sans relative max-lg:inline-flex max-lg:justify-center
        max-lg:h-[188px] max-lg:w-[180px] max-lg:shrink-0
        lg:inline-flex
      `}
    >
      {/* Mobile: large index sits above the circle; bottom of digit tucks under the card (z-10 over z-0). */}
      <span
        className={`
          pointer-events-none absolute ${isMobileGrid ? (isMobileLeftColumn ? "left-[65%]" : "left-[90%]") : (index % 2 === 0 ? "left-[70%]" : "left-[90%]")} top-0 z-0 font-sans text-[100px] font-normal lg:hidden
          leading-[130px] tracking-[-0.02em] text-[rgba(108,117,125,0.1)]
          ${isMobileGrid ? (isMobileLeftColumn ? "translate-x-[calc(-50%+18px)]" : "translate-x-[calc(-50%-18px)]") : (index % 2 === 0 ? "translate-x-[calc(-50%+18px)]" : "translate-x-[calc(-50%-18px)]")}
        `}
        aria-hidden
      >
        {index + 1}
      </span>
      <div
        className={`
          relative z-10 mx-auto flex flex-col items-center justify-center rounded-full bg-white text-center
          max-lg:absolute max-lg:bottom-0 max-lg:left-1/2 max-lg:h-[140px] max-lg:w-[140px] max-lg:-translate-x-1/2
          max-lg:gap-2 max-lg:px-6 max-lg:py-8
          max-lg:shadow-[0px_4px_4px_rgba(14,165,233,0.25)]
          gap-3 p-4
          lg:relative lg:bottom-auto lg:left-auto lg:translate-x-0
          lg:h-[160px] lg:w-[160px] xl:h-[160px] xl:w-[160px] 2xl:h-[220px] 2xl:w-[220px] 4xl:h-[240px] 4xl:w-[240px]
          transition-all duration-500 lg:shadow-none
          ${isTopRow ? "lg:-translate-y-[40px] lg:border-b-2 lg:border-[#D6E4F0]/60" : "lg:translate-y-[40px] lg:border-t-2 lg:border-[#D6E4F0]/60"}
        `}
      >
        <div className=" lg:h-auto lg:w-auto lg:rounded-none lg:bg-transparent lg:shadow-none">
          <img
            src={icon.src}
            alt={label}
            className="size-10 object-contain lg:size-12 xl:size-10 2xl:size-12 4xl:size-14"
          />
        </div>
        <p className="max-w-30 text-xs font-normal leading-4 tracking-[-0.02em] text-slate-gray lg:max-w-[150px] lg:font-thin lg:leading-relaxed 2xl:text-sm">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function UseCaseBenefits({
  title,
  items,
}: {
  title: string;
  items: any[];
}) {

  // Circle positions
  const circles = [
    { cx: 170, cy: 175, r: 148 },
    { cx: 538, cy: 310, r: 148 },
    { cx: 906, cy: 175, r: 148 },
    { cx: 1274, cy: 310, r: 148 },
  ];

  // Helper to render icon based on type
  const renderIcon = (icon: any, x: number, y: number) => {
    if (!icon) return null;

    // If it's a React element
    if (isValidElement(icon)) {
      return (
        <foreignObject x={x - 25} y={y - 25} width="50" height="50">
          <div className="w-full h-full flex items-center justify-center [&_svg]:w-12 [&_svg]:h-12">
            {icon}
          </div>
        </foreignObject>
      );
    }

    // If it's a React component
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return (
        <foreignObject x={x - 25} y={y - 25} width="50" height="50">
          <div className="w-full h-full flex items-center justify-center">
            <IconComponent className="w-12 h-12 object-contain" />
          </div>
        </foreignObject>
      );
    }
    
    // If it's a static image URL/import
    if (icon.src || typeof icon === 'string') {
      const imageUrl = typeof icon === 'string' ? icon : icon.src;
      return (
        <image
          href={imageUrl}
          x={x - 25}
          y={y - 15}
          width="60"
          height="60"
          className="object-contain"
        />
      );
    }

    return null;
  };

  // Helper to wrap text into multiple lines
  const wrapText = (text: string, maxCharsPerLine: number = 18): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach((word) => {
      if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
        currentLine = currentLine ? currentLine + ' ' + word : word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    return lines;
  };

  return (
    <section className="font-dm-sans relative w-full max-w-7xl px-6 md:px-16 mx-auto py-10 lg:py-20 overflow-x-hidden">
      <div className="container mx-auto relative">
        <h2 className="mx-auto mb-12 w-full text-center text-xl xs:text-2xl lg:text-3xl 2xl:text-4xl 4xl:text-[44px] font-medium lg:font-semibold leading-[31px] tracking-[-0.02em] text-dark-gray lg:mb-16 max-w-95 lg:max-w-md xl:max-w-xl 4xl:max-w-2xl lg:leading-snug lg:tracking-tight ">
          {title}
        </h2>

        <div className="relative flex w-full items-center justify-center">
          <div className="relative z-10 hidden max-lg:grid w-full max-w-full gap-1 grid-cols-2 px-4">
            {items?.map((item, index) => (
              <div
                key={index}
                className={`flex items-start justify-center ${
                  index % 2 === 0 ? "pl-0" : "pl-8 pt-16"
                }`}
              >
                <BenefitCard {...item} index={index} isMobileGrid={true} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <svg
            width="100%"
            viewBox="0 0 1445 486"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* ── SNAKE CONNECTORS (exact paths from your SVG) ── */}

            {/* Arc cap: wraps around TOP of C1 */}
            <path d="M336.43 150.209C337.745 150.053 338.686 148.858 338.511 147.545C332.67 103.709 309.966 63.8369 275.172 36.4387C239.749 8.54541 194.697 -4.13377 149.925 1.19045C105.154 6.51467 64.3316 29.4062 36.4382 64.8291C9.04012 99.6231 -3.67928 143.708 0.923404 187.691C1.06126 189.009 2.25617 189.949 3.5714 189.793C4.88663 189.636 5.82408 188.442 5.68677 187.125C1.23395 144.405 13.5955 101.591 40.2066 67.7964C67.3129 33.373 106.984 11.1273 150.492 5.95332C194 0.779318 237.782 13.1008 272.205 40.2071C306 66.8182 328.057 105.539 333.748 148.112C333.923 149.425 335.114 150.366 336.43 150.209Z" fill="#D6E4F0"/>

            {/* Diagonal line: C1 (top-right) → C2 (bottom-left) */}
            <path d="M335 142L372.5 343.5" stroke="#D6E4F0" strokeWidth="5" strokeLinecap="round"/>

            {/* Arc cap: wraps around BOTTOM of C2 */}
            <path d="M703.929 339.623C705.241 339.81 706.154 341.025 705.949 342.334C699.712 382.113 679.55 418.418 649.017 444.746C617.877 471.598 578.062 486.253 536.945 485.998C495.828 485.742 456.197 470.594 425.394 443.358C395.19 416.652 375.48 380.1 369.738 340.246C369.549 338.935 370.478 337.731 371.791 337.561C373.105 337.39 374.306 338.318 374.495 339.629C380.088 378.332 399.236 413.827 428.571 439.765C458.505 466.232 497.018 480.953 536.975 481.201C576.931 481.449 615.624 467.208 645.884 441.114C675.539 415.543 695.127 380.289 701.2 341.658C701.405 340.349 702.618 339.436 703.929 339.623Z" fill="#D6E4F0"/>

            {/* Diagonal line: C2 (top-right) → C3 (bottom-left) — reversed slope = UP */}
            <path d="M741.5 142L703.5 343.5" stroke="#D6E4F0" strokeWidth="5" strokeLinecap="round"/>

            {/* Arc cap: wraps around TOP of C3 */}
            <path d="M1073.43 150.209C1074.74 150.053 1075.69 148.859 1075.51 147.546C1070.19 107.622 1050.86 70.8535 1020.93 43.8265C990.405 16.2631 950.921 0.700864 909.798 0.0239997C868.675 -0.652865 828.701 13.6016 797.285 40.1454C766.48 66.1727 745.951 102.285 739.32 142.012C739.102 143.319 740.004 144.543 741.313 144.743C742.622 144.942 743.844 144.041 744.062 142.735C750.518 104.155 770.462 69.0876 800.38 43.8092C830.91 18.0143 869.757 4.16202 909.719 4.81978C949.682 5.47755 988.051 20.6007 1017.72 47.3864C1046.79 73.6358 1065.57 109.341 1070.75 148.112C1070.92 149.425 1072.11 150.366 1073.43 150.209Z" fill="#D6E4F0"/>

            {/* Diagonal line: C3 (top-right) → C4 (bottom-left) */}
            <path d="M1072 142L1109.5 343.5" stroke="#D6E4F0" strokeWidth="5" strokeLinecap="round"/>

            {/* Arc cap: wraps around BOTTOM of C4 */}
            <path d="M1442.6 316C1443.93 316 1445 317.076 1444.98 318.4C1444.39 360.516 1428.18 400.946 1399.44 431.82C1370.16 463.28 1330.05 482.483 1287.19 485.564C1244.32 488.645 1201.88 475.375 1168.4 448.426C1135.55 421.978 1113.72 384.282 1107.11 342.684C1106.9 341.376 1107.81 340.158 1109.12 339.969C1110.43 339.779 1111.65 340.69 1111.86 341.998C1118.29 382.396 1139.5 419.002 1171.41 444.69C1203.94 470.879 1245.19 483.773 1286.84 480.78C1328.5 477.786 1367.48 459.125 1395.93 428.553C1423.84 398.566 1439.59 359.303 1440.19 318.4C1440.21 317.076 1441.28 316 1442.6 316Z" fill="#D6E4F0"/>

            {/* ── CIRCLES ── */}
            {circles.map((circle, idx) => (
              <circle
                key={idx}
                cx={circle.cx}
                cy={circle.cy}
                r={circle.r}
                fill="white"
                filter="drop-shadow(0 4px 8px rgba(14,165,233,0.18))"
              />
            ))}

            {/* ── ARROWS (exact polygons from your SVG, y-adjusted for new circle positions) ── */}
            {/* C1→C2: pointing down-right */}
            {/* <path fillRule="evenodd" d="M356.111 259.49L342.222 240.879L353.342 244.414L362.48 237.158L356.111 259.49Z" fill="#0EA5E9"/> */}
            {/* C2→C3: pointing up-right */}
            {/* <path fillRule="evenodd" d="M729.111 208.647L715.222 227.258L726.342 223.723L735.48 230.979L729.111 208.647Z" fill="#0EA5E9"/> */}
            {/* C3→C4: pointing down-right */}
            {/* <path fillRule="evenodd" d="M1094.11 259.49L1080.22 240.879L1091.34 244.414L1100.48 237.158L1094.11 259.49Z" fill="#0EA5E9"/> */}

            {/* ── LABELS ── */}
            {/* <text x="12"   y="26"  fontFamily="sans-serif" fontSize="20" fill="#0EA5E9" fontWeight="500">Start</text> */}
            {/* <text x="1380" y="480" fontFamily="sans-serif" fontSize="20" fill="#0EA5E9" fontWeight="500">End</text> */}

            {/* ── DYNAMIC TEXT WITH WRAPPING AND ICONS FROM PROPS ── */}
            {items.map((item, idx) => {
              const circle = circles[idx];
              if (!circle) return null; // Safety check
          
              // Wrap the label text
              const lines = wrapText(item.label, 18);
          
              // Icon position - moved higher to create more gap with text
              const iconY = circle.cy - 50;
              const textStartY = circle.cy + 35; // Adjusted for better spacing
              const lineHeight = 28;

              return (
                <g key={idx}>
                  {/* Render icon using helper function */}
                  {renderIcon(item.icon, circle.cx, iconY)}
              
                  {/* Text lines with wrapping */}
                  {lines.map((line, lineIdx) => (
                    <text
                      key={lineIdx}
                      x={circle.cx}
                      y={textStartY + (lineIdx * lineHeight)}
                      textAnchor="middle"
                      fontFamily="sans-serif"
                      fontSize="20"
                      fill="#6C757D"
                      fontWeight="500"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
