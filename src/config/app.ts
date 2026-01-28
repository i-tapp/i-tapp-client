export const app = {
  name: "I-TAPP",
  title: "I-Tapp - Bringing opportunities closer",
  description:
    "Login to I-Tapp to search, find and secure SIWES/IT placement across different companies in Nigeria.",
  logo_url: "/logo.png",
  favicon_url: "/favicon.ico",
  nav_links: [
    {
      title: "Homepage",
      href: "/",
      text: "Home",
    },
    {
      title: "About Us - Know our purpose, vision, mission and the team.",
      href: "/about-us",
      text: "About Us",
    },
    {
      title: "Contact Us - We are avaliable 24/7 via all support channels.",
      href: "/contact-us",
      text: "Contact Us",
    },
  ],
  links: {
    signin: "/signin",
    signup: "/get-started",
  },

  footer_links: [
    {
      title: "LEGAL",
      links: [
        { href: "/privacy", title: "Privacy" },
        { href: "/terms-of-service", title: "Terms of service" },
      ],
    },

    // {
    //   title: "RESOURCES",
    //   links: [
    //     { href: "/", title: "Tools" },
    //     { href: "/", title: "Blogs" },
    //   ],
    // },

    {
      title: "COMPANY",
      links: [
        { href: "/about-us", title: "About Us" },
        // { href: "/", title: "FAQ" },
        // { href: "/", title: "Students" },
        // { href: "/", title: "Companies" },
        { href: "/partnership", title: "Partnership" },
        { href: "/contact-us", title: "Contact-us" },
      ],
    },
  ],
};
