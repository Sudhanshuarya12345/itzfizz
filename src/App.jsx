import Hero from './components/Hero';

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <Hero />
      
      {/* Spacer / Following content to allow scrolling
      <section className="relative w-full min-h-screen bg-neutral-950 flex flex-col items-center justify-center border-t border-neutral-900 px-4">
        <div className="max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Beyond Limits.
          </h2>
          <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            Experience the zenith of web animations powered by GSAP and React. 
            Scroll back up to witness the smoothness of properly implemented scrub animations.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-12 border-t border-neutral-800/50">
             <div>
                <h3 className="text-2xl font-semibold mb-2">Performant</h3>
                <p className="text-neutral-500">Hardware accelerated.</p>
             </div>
             <div>
                <h3 className="text-2xl font-semibold mb-2">Responsive</h3>
                <p className="text-neutral-500">Looks great anywhere.</p>
             </div>
             <div>
                <h3 className="text-2xl font-semibold mb-2">Beautiful</h3>
                <p className="text-neutral-500">Sleek styling.</p>
             </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}

export default App;
