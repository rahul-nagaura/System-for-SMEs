import type { Metadata } from "next";
import BookingPageClient from "./booking-client";

export const metadata: Metadata = {
  title: "Book Your Systems Strategy Session | Systems for SME",
  description: "Book a 30-minute strategy session and walk away with a specific systems roadmap for your business. Limited slots available every month.",
};

export default function BookingPage() {
  return <BookingPageClient />;
}