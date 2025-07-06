'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Quote, Sparkles } from 'lucide-react';
import QuoteCard from './quoteCard';
import { AuroraText } from './magicui/aurora-text';
import { Label } from './ui/label';
import { Input } from './ui/input';
import quotes from '../lib/quotes.json'
import { useForm} from 'react-hook-form';
import { gradients } from '@/lib/gradients';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

///////////////
const formSchema = z.object({
  topic: z.string().min(1, { message: "Please enter a topic." })
});

type FormValues = z.infer<typeof formSchema>;
////
const QuoteGenerator: React.FC = () => {
  //// Use States
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [currentGradient, setCurrentGradient] = useState(gradients[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  ///
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "" }
  });
  // TypeWriter effect
  const typeWriter = (text: string) => {
    setIsTyping(true);
    setDisplayText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 30);
  };

  const generateQuoteByTopic = (topic: string) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Filter quotes by topic if specified
    let filteredQuotes = quotes;
    if (topic) {
      filteredQuotes = quotes.filter(quote => 
        quote.category.toLowerCase().includes(topic.toLowerCase()) ||
        quote.text.toLowerCase().includes(topic.toLowerCase())
      );
    }
    
    // If no quotes found then we will use all quotes
    else {
      filteredQuotes = quotes;
    }
    
    // Getting random quote and gradient
    const randomQuoteIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomGradientIndex = Math.floor(Math.random() * gradients.length);
    
    // for not getting the same quote twice in a row
    let newQuote = filteredQuotes[randomQuoteIndex];
    while (newQuote.text === currentQuote.text && filteredQuotes.length > 1) {
      const newIndex = Math.floor(Math.random() * filteredQuotes.length);
      newQuote = filteredQuotes[newIndex];
    }
    
    setTimeout(() => {
      setCurrentQuote(newQuote);
      setCurrentGradient(gradients[randomGradientIndex]);
      typeWriter(newQuote.text);
      setIsAnimating(false);
    }, 300);

  };

  const handleTopicSubmit = () => {
    const topicToUse = customTopic;
    console.log(topicToUse)
    if (topicToUse) {
      generateQuoteByTopic(topicToUse);
    } else {
      generateQuoteByTopic('all');
    }
    setCustomTopic('');
    form.reset();
  };

  useEffect(() => {
    typeWriter(currentQuote.text);
  }, []);
 
  return (
   
    <div className={`min-h-screen transition-all duration-1000 ease-in-out ${currentGradient} flex items-center justify-center p-4 flex-col`}>
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Quote Generator
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
            Discover inspiration with every click
          </p>
        </div>

        {/* Topic Selection Form */}
        <Card className="p-6 my-6 backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl animate-fade-in">
          <div className="space-y-4">
            <div className="text-center">
              <Sparkles className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <h3 className="text-2xl font-semibold text-white mb-4">Enter Your Inspiration Topic</h3>
            </div>
            
            <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleTopicSubmit)}
        className="space-y-4 w-full max-w-md mx-auto"
      >
        {/* Field */}
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className="text-white">Custom Topic</FormLabel> */}
              <FormControl>
                <Input
                  {...field}
                  required
                  onChange={(e) => {
                    field.onChange(e);
                    setCustomTopic(e.target.value);
                  }}
                  placeholder="e.g., love, wisdom, career..."
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />

        {/* Button */}
        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            disabled={isAnimating}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white text-lg border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Generate Quote
          </Button>
        </div>
      </form>
    </Form>
          </div>
        </Card>

{/* Quote Card */}
        <QuoteCard isAnimating={isAnimating} isTyping={isTyping} quote={displayText} author={currentQuote.author} category={currentQuote.category} />
        
      </div>
      <p className="text-center text-sm text-white/70 mt-8">
  © {new Date().getFullYear()} Quote Generator. Made with <span className="text-red-500">❤️</span> by Ali Ather.
</p>


    </div>
  
    
  );
};

export default QuoteGenerator;