
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivyProvider } from '@privy-io/react-auth';
import Index from "./pages/Index";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Results from "./pages/Results";
import CardCollection from "./pages/CardCollection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <PrivyProvider
    appId="cm4y6ceg803rdmm6qfnhqwwq9"
    config={{
      appearance: {
        theme: 'dark',
        accentColor: '#10b981',
        logo: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=50&h=50&fit=crop&crop=center',
      },
      loginMethods: ['wallet', 'email'],
      embeddedWallets: {
        createOnLogin: 'users-without-wallets',
      },
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game" element={<Game />} />
            <Route path="/results" element={<Results />} />
            <Route path="/collection" element={<CardCollection />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </PrivyProvider>
);

export default App;
