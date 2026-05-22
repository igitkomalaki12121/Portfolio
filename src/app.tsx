/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Philosophy from "./components/philosophy";
import Capabilities from "./components/capabilities";
import Work from "./components/work";
import Testimonials from "./components/testimonials";
import Footer from "./components/footer";

export default function App() {
  return (
    <div className="bg-white/10 text-black min-h-screen selection:bg-white selection:text-black font-sans">
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <Capabilities />
        <Work />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
