import type { Position } from '../../backend';
import { getAlignmentClass, getVerticalAlignmentClass, getObjectPositionClass } from '../../utils/heroLayout';

interface HeroSectionProps {
  title: string;
  body: string;
  imageSrc?: string;
  titlePosition?: Position;
  bodyPosition?: Position;
  imagePosition?: Position;
  isPreview?: boolean;
}

export default function HeroSection({ 
  title, 
  body, 
  imageSrc,
  titlePosition,
  bodyPosition,
  imagePosition,
  isPreview = false
}: HeroSectionProps) {
  const defaultImage = '/assets/generated/hero-illustration.dim_1600x900.png';
  const imageSource = imageSrc || defaultImage;

  // Default positions if not provided
  const titleAlign = titlePosition?.horizontal || 'left';
  const bodyAlign = bodyPosition?.horizontal || 'left';
  const imageAlign = imagePosition?.horizontal || 'right';
  
  // Determine if image should be on left or right
  const imageOnLeft = imageAlign === 'left';
  
  // Get CSS classes for alignment
  const titleAlignClass = getAlignmentClass(titleAlign);
  const bodyAlignClass = getAlignmentClass(bodyAlign);
  const objectPositionClass = getObjectPositionClass(imagePosition);

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className={`space-y-8 ${imageOnLeft ? 'lg:order-2' : ''}`}>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight ${titleAlignClass}`}>
              {title}
            </h1>
            <p className={`text-lg sm:text-xl text-muted-foreground leading-relaxed ${bodyAlignClass}`}>
              {body}
            </p>
            {!isPreview && (
              <div className={`flex flex-wrap gap-4 ${bodyAlignClass === 'text-center' ? 'justify-center' : bodyAlignClass === 'text-right' ? 'justify-end' : ''}`}>
                <button
                  onClick={() => document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg"
                >
                  Learn More
                </button>
              </div>
            )}
          </div>
          
          {/* Image */}
          <div className={`relative ${imageOnLeft ? 'lg:order-1' : ''}`}>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              <img
                src={imageSource}
                alt="Hero illustration"
                className={`w-full h-full object-cover ${objectPositionClass}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
