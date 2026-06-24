const Loader = () => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-3xl shadow-xl animate-spin-cube">
          Z
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-primary text-sm font-medium tracking-wider animate-pulse">
          CHARGEMENT
        </div>
      </div>
    </div>
  )
}

export default Loader
