import React from "react";
import type {Metadata} from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import '../public/css/main.min.scss';
import ConditionalHero from "@/components/ConditionalHero";

export const metadata: Metadata = {
  title: "Palm Reader - MČ Praha 6",
  description: "Oficiální aplikace pro věštění z ruky na akci Městské části Praha 6",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
      <html lang="cs">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/img/web_icon/favicon.ico" sizes="any"/>
        <link rel="icon" type="image/png" href="/img/web_icon/favicon-32x32.png" sizes="32x32"/>
        <title>Palm Reader - MČ Praha 6</title>
      </head>
      <body>
      <div id="home" className="lt_wd">
        <div className="lt_box lt_box_header"><Header/></div>
        <ConditionalHero/>
        <div className="lt_box lt_box_main">{children}</div>
        <div className="lt_box lt_box_footer"><Footer/></div>
      </div>
      </body>
      </html>
  );
}
