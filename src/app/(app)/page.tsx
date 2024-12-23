'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/message.json";

import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, History, MessageSquareCode } from "lucide-react";
import Link from "next/link";

function Home() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-1 md:px-20 py-8">
        <section className="text-center mb-6 md:mb-9">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the world of secret messages
          </h1>
          <p className="mt-1 md:mt-2 text-base md:text-lg">
            Explore the world of secret messages!!! <br />Share your secrets with the world and remain anonymous.
          </p>
          <Link href="/sign-up" >
        <Button className="mt-4 md:mt-6"> Join Us Now <ChevronRight className="ml-2 h-3 w-3" /></Button>
        </Link>
        </section>
        <div className="relative group w-full max-w-xs">
          <Carousel
            plugins={[Autoplay({ delay: 2500 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardHeader className="flex items-center bg-slate-300 justify-center">
                        <CardTitle className="text-xl font-bold">
                          {message.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex aspect-auto items-center justify-center p-4 bg-white bg-opacity-25">
                        <div
                          key={index}
                          className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                        >

                          <MessageSquareCode className="mr-3 " />
                          <div className="space-y-1">
                            <p className="text-sm p-1 font-medium leading-none">
                              {message.content}
                            </p>

                            <History className="inline-block h-5 w-5 m-2 text-muted-foreground pb-1"/>
                            <p className="text-sm text-muted-foreground inline
                            ">
                              {message.received}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className=" opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className=" opacity-0 group-hover:opacity-100 transition-opacity" />
          </Carousel>
        </div>
        
      </main>
      <footer className="flex items-center justify-center w-full h-12 rounded-xl border-t">
        &copy; 2024 Secret Message. All rights reserved.
      </footer>
    </>
  );
}

export default Home;


