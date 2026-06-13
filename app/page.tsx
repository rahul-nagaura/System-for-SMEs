import HomeClient from "./home-client";

export const revalidate = 3600;

const defaultReviews = [
  {
    name: "Anand K.",
    role: "Retail Chain Owner",
    text: "I was managing 15 retail stores via phone calls. After one session, we moved to a dashboard. I finally had a Sunday off after 3 years.",
    rating: 5
  },
  {
    name: "Priya M.",
    role: "Manufacturing Director",
    text: "Raghav understands the reality of Indian SME staff. He doesn't suggest complex tech they won't use. He suggests what actually works.",
    rating: 5
  },
  {
    name: "Vikram Singh",
    role: "Logistics Provider",
    text: "The best ₹1500 I've spent on my business. The roadmap alone saved me 2 months of trial and error with different softwares.",
    rating: 5
  }
];

const defaultFAQs = [
  {
    question: "What if I don't use any tech right now?",
    answer: "That's perfectly fine. We start from wherever you are. Whether you're using pen and paper or WhatsApp, our goal is to find the *simplest* next step for you."
  },
  {
    question: "Will you implement the systems for me?",
    answer: "This session is for strategy and a roadmap. If you need implementation support after the session, we can discuss a full consulting engagement, but there is no obligation."
  },
  {
    question: "Is this session suitable for any industry?",
    answer: "The principles of systems apply to almost any business. However, I specialize in Manufacturing, Retail, Wholesale, and Logistics."
  },
  {
    question: "How do I prepare for the session?",
    answer: "Just bring your biggest operational headaches and an open mind. If you have an org chart or a list of your current staff roles, that's a bonus."
  }
];

export default async function LandingPage() {
  let content = {
    settings: {
      pricing_amount: "2499",
      owner_photo_url: "/raghav.jpg"
    },
    faqs: defaultFAQs,
    reviews: defaultReviews,
    vault: []
  };

  const webappUrl = process.env.GOOGLE_SCRIPT_WEBAPP_URL;
  if (webappUrl) {
    try {
      const res = await fetch(`${webappUrl}?action=fetchContent`, {
        next: { revalidate: 3600 } // 1 hour — kept in sync with the page `revalidate` above
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          content = {
            settings: {
              pricing_amount: data.settings?.pricing_amount || "2499",
              owner_photo_url: data.settings?.owner_photo_url || "/raghav.jpg"
            },
            faqs: data.faqs && data.faqs.length > 0 ? data.faqs : defaultFAQs,
            reviews: data.reviews && data.reviews.length > 0 ? data.reviews : defaultReviews,
            vault: data.vault || []
          };
        }
      }
    } catch (err) {
      console.error("Landing page server-side fetch failed:", err);
    }
  }

  return <HomeClient content={content} />;
}
