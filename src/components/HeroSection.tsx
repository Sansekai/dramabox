import { Sparkles, TrendingUp, Clock } from "lucide-react";

interface HeroSectionProps {
  title: string;
  description: string;
  icon?: "sparkles" | "trending" | "clock";
}

const icons = {
  sparkles: Sparkles,
  trending: TrendingUp,
  clock: Clock,
};

export function HeroSection({ title, description, icon = "sparkles" }: HeroSectionProps) {
  const IconComponent = icons[icon];

  return (
    <div className="relative pt-24 pb-8 md:pt-28 md:pb-12">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-30"
             style={{ background: 'var(--gradient-glow)' }} />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl gradient-text">
            {title}
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  );
}
