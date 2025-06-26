'use client';
import { useState } from "react";

const faqs = [
	{
		question: "How does the free plan work?",
		answer:
			"The Starter plan lets you generate up to 3 AI-powered posts for free—no signup required. Upgrade anytime for unlimited access.",
	},
	{
		question: "Can I cancel my subscription?",
		answer:
			"Yes! You can cancel your Pro or Enterprise subscription at any time from your dashboard. No questions asked.",
	},
	{
		question: "What payment methods do you accept?",
		answer:
			"We accept all major credit and debit cards. For Enterprise plans, we also support invoicing and bank transfers.",
	},
	{
		question: "Is my data secure?",
		answer:
			"Absolutely. We use industry-standard encryption and never share your data with third parties.",
	},
	{
		question: "Can I upgrade or downgrade later?",
		answer:
			"You can switch plans at any time. Your new features will be available instantly after upgrading.",
	},
];

export default function PricingPage() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0e0b25] via-[#201c42] to-[#1f1f32] py-16 px-4 flex items-center justify-center">
			<div className="max-w-4xl w-full mx-auto mt-20">
				<h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-[#00a6ff] to-[#00ff77] bg-clip-text text-transparent mb-8">
					Simple, Transparent Pricing
				</h1>
				<p className="text-center text-gray-300 mb-12">
					Choose the plan that fits your content creation journey. No hidden fees,
					cancel anytime.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:mx-auto mx-5">
					{/* Free Plan */}
					<div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center border border-blue-400/20 shadow">
						<h2 className="text-xl font-bold text-white mb-2">Starter</h2>
						<p className="text-4xl font-extrabold text-white mb-2">Free</p>
						<ul className="text-gray-200 text-sm mb-6 space-y-2">
							<li>✅ 3 AI-generated posts</li>
							<li>✅ Basic analytics</li>
							<li>✅ No signup required</li>
							<li>✅ Signup for 3 posts/day</li>
						</ul>
						<button
							className="px-6 py-2 rounded-full bg-gradient-to-r from-[#00a6ff] to-[#00ff77] text-white font-semibold shadow hover:scale-105 transition"
							disabled
						>
							Current Plan
						</button>
					</div>
					{/* Pro Plan */}
					<div className="bg-white/20 rounded-2xl p-8 flex flex-col items-center border-2 border-blue-400/40 shadow-lg scale-105">
						<h2 className="text-xl font-bold text-white mb-2">Pro</h2>
						<p className="text-4xl font-extrabold text-white mb-2">
							$12
							<span className="text-lg font-normal">/mo</span>
						</p>
						<ul className="text-gray-100 text-sm mb-6 space-y-2">
							<li>🚀 Unlimited AI-generated posts</li>
							<li>📊 Advanced analytics & insights</li>
							<li>✍️ Post editing & regeneration</li>
							<li>🔗 Integrations</li>
							<li>🛡️ Priority support</li>
						</ul>
						<a
							href="/signup"
							className="px-6 py-2 rounded-full bg-gradient-to-r from-[#00a6ff] to-[#00ff77] text-white font-semibold shadow hover:scale-105 transition"
						>
							Start Free Trial
						</a>
					</div>
					{/* Enterprise Plan */}
					<div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center border border-blue-400/20 shadow">
						<h2 className="text-xl font-bold text-white mb-2">Enterprise</h2>
						<p className="text-4xl font-extrabold text-white mb-2">Custom</p>
						<ul className="text-gray-200 text-sm mb-6 space-y-2">
							<li>🏢 Team collaboration</li>
							<li>🔒 Dedicated account manager</li>
							<li>⚙️ Custom integrations</li>
							<li>📞 Priority onboarding & support</li>
						</ul>
						<a
							href="/contact"
							className="px-6 py-2 rounded-full bg-gradient-to-r from-[#00a6ff] to-[#00ff77] text-white font-semibold shadow hover:scale-105 transition"
						>
							Contact Sales
						</a>
					</div>
				</div>
				<p className="text-center text-gray-300 mt-10">
					Need a custom plan?{" "}
					<a href="/contact" className="underline hover:text-blue-400">
						Contact us
					</a>
				</p>

				{/* FAQ Section */}
				<div className="mt-20 max-w-2xl mx-auto">
					<h2 className="text-2xl font-bold text-white text-center mb-6">
						Frequently Asked Questions
					</h2>
					<div className="space-y-4">
						{faqs.map((faq, idx) => (
							<div key={faq.question} className="bg-white/5 rounded-lg">
								<button
									className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
									onClick={() =>
										setOpenIndex(openIndex === idx ? null : idx)
									}
									aria-expanded={openIndex === idx}
									aria-controls={`faq-answer-${idx}`}
								>
									<span className="font-semibold text-blue-300">
										{faq.question}
									</span>
									<span
										className="ml-2 text-blue-300 text-xl transition-transform"
										style={{
											transform:
												openIndex === idx
													? "rotate(90deg)"
													: "rotate(0deg)",
										}}
									>
										▶
									</span>
								</button>
								{openIndex === idx && (
									<div
										id={`faq-answer-${idx}`}
										className="px-4 pb-4 text-gray-300 text-sm animate-fade-in"
									>
										{faq.answer}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}