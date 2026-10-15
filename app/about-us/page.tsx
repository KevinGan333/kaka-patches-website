import type { Metadata } from "next";
import Link from "next/link";

const description = "Meet Amy and Kevin, the founders of KaKa Patches. Discover how a daughter's drawings and a few handmade patches grew into a custom patch business founded in 2019.";
export const metadata: Metadata = {
  title: "Our Story | About KaKa Patches",
  description,
  alternates: { canonical: "https://www.kakapatches.com/about-us" },
  openGraph: { title: "Our Story | About KaKa Patches", description, url: "https://www.kakapatches.com/about-us", type: "website" },
};

export default function Page() {
  return (
    <main className="kk-editorial">
      <section className="kk-page-hero"><div className="kh-container">
        <p className="kk-eyebrow">About us / Our story</p>
        <h1>Little Patches.<br /><span>Lasting Memories.</span></h1>
        <p className="kk-hero-intro">A family story that began with a daughter’s drawings—and grew into KaKa Patches.</p>
        <a className="kk-story-jump" href="#our-story">Meet Amy &amp; Kevin <span aria-hidden="true">↓</span></a>
      </div></section>

      <article id="our-story" className="kk-story">
        <p className="kk-story-lead">KaKa Patches was founded in 2019 by husband-and-wife team Amy Lee and Kevin. But our story began with something much more personal: a desire to hold on to the little moments of our daughter’s childhood.</p>
        <p>Like many parents, we took countless photos as she grew—capturing everyday adventures, new discoveries, and moments we never wanted to forget. Over time, though, we noticed that photos alone couldn’t always help us place a memory. When outfits looked the same, it could be hard to tell when a picture had been taken.</p>
        <p>Then our daughter started kindergarten, and we ran into another familiar parenting challenge. With matching uniforms, similar backpacks, and identical school supplies, belongings often ended up going home with the wrong child. Those same uniforms also made it harder to distinguish one school occasion from another in our photos.</p>
        <h2>So we started making something just for her.</h2>
        <p>We sketched little designs on paper, tried printing them on different materials, and experimented with ways to attach them to her clothes and backpack—from glue to stitching. Our first designs were simple, mostly cute little animals. To us, they were small handmade touches. To our daughter, they were something special.</p>
        <p>As she grew, she began drawing, too. By the time she was four, she was coming up with ideas that surprised and delighted us. With her permission, we turned some of her drawings into embroidered patches.</p>
        <p>She took them to school, and her classmates loved them.</p>
        <h2>From her backpack to something bigger.</h2>
        <p>That response encouraged us to share our patches on social media. We wondered whether something that brought our daughter so much joy might mean something to other people, too.</p>
        <p>Little by little, orders began to come in.</p>
        <p>Customers brought us their own ideas, and we helped turn them into custom designs and samples. As more people were happy with the finished patches, they came back with new projects. What began as a creative family activity gradually became a growing business.</p>
        <p>At first, we worked on orders in the evenings and on weekends while keeping our regular jobs. Eventually, there were more customers and projects than our spare time could accommodate. We decided to give the business our full attention and created kakapatches.com to share our work with more people.</p>
        <h2>The same personal care. A new story every time.</h2>
        <p>Through it all, our purpose has stayed close to where we started: helping people turn something meaningful into something they can hold, wear, and carry with them.</p>
        <p>For our family, it began with a daughter’s drawings and a few little patches on her backpack. Today, we bring that same personal care to the ideas our customers share with us.</p>
        <p className="kk-story-closing">Every patch starts with a story. We’d love to help you bring yours to life.</p>
        <div className="kk-founders"><p>Amy &amp; Kevin</p><span>Founders, KaKa Patches</span></div>
      </article>

      <section className="kk-story-cta"><div className="kh-container">
        <p className="kk-eyebrow">Your idea. Our care.</p><h2>What’s your patch story?</h2>
        <p>Share a drawing, a logo, or an idea. Let’s make something yours.</p>
        <div className="kk-page-actions"><Link className="kh-button" href="/request-a-quote">Start your project ↗</Link><Link className="kh-button kh-button-outline" href="/contact-us">Get in touch ↗</Link></div>
      </div></section>
    </main>
  );
}
