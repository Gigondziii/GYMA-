import Spline from '@splinetool/react-spline';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0a0a] text-white selection:bg-[#00ff41] selection:text-black">
      
      {/* 3D Background - pointer events auto by default in Spline so user can drag */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Spline scene="https://prod.spline.design/zbHiHVgoZgUAaMFp/scene.splinecode" />
      </div>

      {/* Header / Nav - Pointer Events None to let drag pass through if needed */}
      <nav className="absolute top-0 left-0 w-full px-8 md:px-16 py-8 flex justify-between items-center z-10 pointer-events-none">
        <div className="text-2xl font-extrabold tracking-widest text-shadow-md">
          GYMA<span className="text-[#00ff41]">.</span>
        </div>
      </nav>

      {/* Foreground Content - Pointer Events None so text doesn't steal draggable area */}
      <div className="absolute bottom-[2%] md:bottom-[5%] left-[2%] md:left-[5%] right-[5%] md:right-auto max-w-[500px] z-10 pointer-events-none text-center md:text-left bg-[#080808]/30 backdrop-blur-xl p-6 md:p-10 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 bg-gradient-to-br from-white to-[#b3b3b3] bg-clip-text text-transparent">
          Intelligent<br />Movement.
        </h1>
        
        <p className="text-lg md:text-xl text-[#d0d0d0] leading-relaxed mb-10">
          Experience real-time biomechanical feedback engineered for precision, alignment, and injury prevention. Drag the robot to interact.
        </p>
        
        {/* Enable pointer events just for the button */}
        <div className="pointer-events-auto">
          {/* Note: In a real migration this links to the dashboard. For now, we link to the external index.html if we were serving them together, OR we can link to a new path. Since they are currently separate apps, we'll just put a placeholder or an absolute path if necessary. */}
          <Link 
            href="http://127.0.0.1:8080/index.html" 
            className="inline-block px-10 py-4 font-semibold tracking-wide text-[#0a0a0a] bg-[#00ff41] rounded-full uppercase transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#1aff57] hover:shadow-[0_0_30px_rgba(0,255,65,0.4)]"
          >
            Launch System
          </Link>
        </div>
      </div>
    </main>
  );
}
