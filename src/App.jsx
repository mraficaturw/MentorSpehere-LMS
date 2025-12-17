import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import AppRouter from './router/AppRouter';

const App = () => {
  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
};

export default App;
