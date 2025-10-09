import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(29, 30, 60, 0.7), rgba(29, 30, 60, 0.85)), url('data:image/svg+xml,%3Csvg width=\"1920\" height=\"1080\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3ClinearGradient id=\"grad\" x1=\"0%25\" y1=\"0%25\" x2=\"100%25\" y2=\"100%25\"%3E%3Cstop offset=\"0%25\" style=\"stop-color:%23334155;stop-opacity:1\" /%3E%3Cstop offset=\"100%25\" style=\"stop-color:%231e293b;stop-opacity:1\" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\"1920\" height=\"1080\" fill=\"url(%23grad)\" /%3E%3C/svg%3E')",
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
          Are You Ready for the Next Level?
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          A free 12-question diagnostic to discover your Strategic Readiness Zone and unlock your path from technical leadership to C-suite success.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            variant="default"
            className="text-base"
            data-testid="button-start-assessment"
            onClick={() => console.log('Start assessment clicked')}
          >
            Start Your Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-white/75">
            Join 500+ IT leaders who've discovered their strategic gaps
          </p>
        </div>
      </div>
    </div>
  );
}
