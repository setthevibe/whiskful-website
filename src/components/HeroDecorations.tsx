import { CinnamonRoll, Cookie, Heart, MixingBowl, RollingPin, Sparkle, Sprinkles, Whisk } from './illustrations'

// Rolls, cookies and baking tools floating around the edges (the middle stays clear for the words)
export function HeroDecorations() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Top left and top right: on every screen */}
      <CinnamonRoll className="absolute -left-12 top-8 h-32 w-32 -rotate-12 opacity-70 motion-safe:animate-float sm:left-4 sm:h-40 sm:w-40 sm:opacity-100" />
      <Cookie className="absolute -right-10 top-24 h-28 w-28 rotate-12 opacity-70 motion-safe:animate-float [animation-delay:-2s] sm:right-6 sm:h-32 sm:w-32 sm:opacity-100" />

      {/* Bigger screens: more treats and tools */}
      <RollingPin className="absolute left-[20%] top-10 hidden w-36 motion-safe:animate-sway lg:block" />
      <Cookie look="red_velvet" className="absolute right-[22%] top-[8%] hidden h-16 w-16 -rotate-6 motion-safe:animate-float [animation-delay:-3s] lg:block" />
      <CinnamonRoll flavour="biscoff" className="absolute bottom-10 left-[8%] hidden h-28 w-28 rotate-6 motion-safe:animate-float [animation-delay:-4s] md:block" />
      <MixingBowl className="absolute bottom-6 left-[26%] hidden w-28 motion-safe:animate-sway [animation-delay:-2s] lg:block" />
      <Cookie look="chocolate" className="absolute bottom-16 right-[24%] hidden h-20 w-20 rotate-12 motion-safe:animate-float [animation-delay:-5s] md:block" />
      <Whisk className="absolute bottom-6 right-[8%] hidden h-36 w-18 rotate-25 motion-safe:animate-sway [animation-delay:-1s] md:block" />
      <CinnamonRoll flavour="oreo" className="absolute left-[4%] top-[48%] hidden h-20 w-20 -rotate-6 motion-safe:animate-float [animation-delay:-6s] xl:block" />

      {/* Sprinkles, hearts and sparkles */}
      <Sprinkles className="absolute left-[30%] top-[28%] hidden h-10 w-10 sm:block" />
      <Sprinkles className="absolute bottom-[30%] right-[14%] h-8 w-8 rotate-45" />
      <Sprinkles className="absolute bottom-[14%] left-[44%] hidden h-9 w-9 -rotate-12 md:block" />
      <Heart className="absolute left-[24%] top-[16%] hidden h-5 w-5 text-blush-300 sm:block" />
      <Heart className="absolute bottom-[22%] right-[30%] hidden h-4 w-4 text-blush-400 sm:block" />
      <Heart className="absolute right-[8%] top-[8%] h-3 w-3 text-blush-300" />
      <Sparkle className="absolute bottom-[28%] left-[6%] h-5 w-5 text-caramel-200" />
      <Sparkle className="absolute right-[34%] top-[6%] hidden h-4 w-4 text-caramel-200 sm:block" />
      <Sparkle className="absolute left-[38%] bottom-[8%] hidden h-3 w-3 text-lavender-800/30 md:block" />
    </div>
  )
}
