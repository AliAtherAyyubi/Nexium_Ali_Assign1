import React from 'react'
import { Card } from './ui/card'
import { Quote } from 'lucide-react'
import { TypingAnimation } from './magicui/typing-animation'

type ChildProps = {
  isAnimating: Boolean;
  isTyping: Boolean;
  quote: string;
  category: string;
  author: string;
};
const QuoteCard = ({isAnimating,quote,isTyping,author,category}:ChildProps) => {
  let text= "No quote available";
  return (
    <Card className={`p-8 md:p-12 backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl transition-all duration-500 ${
          isAnimating ? 'animate-fade-out' : 'animate-fade-in'
        }`}>
          <div className="text-center space-y-6">
            <Quote className="w-12 h-12 text-white/80 mx-auto drop-shadow-lg" />
            
            <div className="min-h-[120px] flex items-center justify-center">
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed drop-shadow-md">
                "{quote}
                {isTyping && <span className="animate-pulse">|</span>}
                "
              </blockquote>
            </div>
            
            <div className="space-y-2">
              <p className="text-xl md:text-2xl font-semibold text-white/90 drop-shadow-md">
                — {author}
              </p>
              <span className="inline-block px-4 py-2 bg-white/10 shadow-2xl rounded-full text-white/80 text-sm font-medium backdrop-blur-sm">
                {category}
              </span>
            </div>
          </div>
        </Card>
  )
}

export default QuoteCard