export function BackgroundGradient() {
  return (
    <>
      <div
        className="absolute w-[10vw] h-[10vw] max-w-[200px] max-h-[200px] rounded-full bg-[#0EA5E9] opacity-30 blur-[100px] pointer-events-none"
        style={{ left: "74%", top: "7.5%" }}
      />
      <div
        className="absolute w-[10vw] h-[10vw] max-w-[200px] max-h-[200px] rounded-full bg-[#0EA5E9] opacity-30 blur-[100px] pointer-events-none"
        style={{ left: "8%", top: "68%" }}
      />
      <div
        className="absolute w-[10vw] h-[10vw] max-w-[200px] max-h-[200px] rounded-full bg-[rgba(238,16,229,0.6)] opacity-30 blur-[100px] pointer-events-none"
        style={{ left: "83%", top: "9%" }}
      />
      <div
        className="absolute w-[10vw] h-[10vw] max-w-[200px] max-h-[200px] rounded-full bg-[rgba(238,16,229,0.6)] opacity-30 blur-[100px] pointer-events-none"
        style={{ left: "17%", top: "75%" }}
      />
    </>
  );
}
