import { useState } from 'react';
import Hero from './components/Hero';
import PromptForm from './components/PromptForm';
import OutputPanel from './components/OutputPanel';
import Footer from './components/Footer';

function App() {
  const [output, setOutput] = useState(null);

  return (
    <div className="min-h-screen w-full bg-[#0a0b10] text-white">
      <Hero />
      <PromptForm onGenerate={setOutput} />
      <OutputPanel data={output} />
      <Footer />
    </div>
  );
}

export default App;
