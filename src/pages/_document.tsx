import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary SEO Meta */}
        <meta
          name="description"
          content="The Apna Gym - Bishrampur’s most trusted fitness center. Modern equipment, expert trainers, and flexible membership plans."
        />
        <meta
          name="keywords"
          content="The Apna Gym, gym in Bishrampur, fitness center Bishrampur, gym membership Chhattisgarh, best gym near me"
        />
        <meta name="author" content="The Apna Gym" />

        {/* Open Graph (Social Media Preview) */}
        <meta property="og:title" content="The Apna Gym – Bishrampur" />
        <meta
          property="og:description"
          content="Premium gym with expert trainers and modern equipment. Join The Apna Gym today!"
        />
        <meta property="og:image" content="/logo.jpeg" />
        <meta property="og:url" content="https://theapnagym.in" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Apna Gym – Bishrampur" />
        <meta
          name="twitter:description"
          content="Your trusted fitness destination. Join now!"
        />
        <meta name="twitter:image" content="/logo.jpeg" />

        {/* Mobile + Theme */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ef4b6e" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* JSON-LD: Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "The Apna Gym",
              url: "https://theapnagym.in",
              logo: "https://theapnagym.in/logo.jpeg",
              image: "https://theapnagym.in/logo.jpeg",
              telephone: "+917999693682",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "1st floor Sai Complex, Main Road, Bishrampur",
                addressLocality: "Bishrampur",
                addressRegion: "Chhattisgarh",
                postalCode: "497226",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "23.199",
                longitude: "83.155",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "05:00",
                  closes: "22:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Sunday",
                  opens: "07:00",
                  closes: "20:00",
                },
              ],
              sameAs: ["https://instagram.com/theapnagym"],
            }),
          }}
        />
      </Head>

      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
