import fs from "fs"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import path from "path"
import { getCurrentUser } from "@/lib/auth"
import { PlaygroundClient } from "./playground-client"

export const metadata: Metadata = {
	title: "Interactive Component Playground — Radian OS",
	description:
		"Explore Radian UI components in our interactive sandbox. Test live previews on mobile, tablet, and desktop viewports, read source code, and toggle light/dark modes.",
}

// Function to read file content safely
function readFileContent(dirPath: string, fileName: string): string {
	try {
		const fullPath = path.join(dirPath, fileName)
		if (fs.existsSync(fullPath)) {
			return fs.readFileSync(fullPath, "utf-8")
		}
		return `// Error: File ${fileName} not found at ${fullPath}`
	} catch (error) {
		console.error(`Error reading ${fileName}:`, error)
		return `// Error reading file ${fileName}`
	}
}

export default async function PlaygroundPage() {
	const user = await getCurrentUser()
	if (!user) {
		redirect("/sandbox/auth/sign-in?callbackUrl=/sandbox")
	}

	const omrixDir = path.join(process.cwd(), "src/app/sandbox/omrix")
	const motionDir = path.join(process.cwd(), "src/app/sandbox/motion")
	const beamHeaderDir = path.join(process.cwd(), "src/app/sandbox/beam-header")
	const jamboPricingDir = path.join(
		process.cwd(),
		"src/app/sandbox/jambo-pricing"
	)
	const klarheitFaqDir = path.join(
		process.cwd(),
		"src/app/sandbox/klarheit-faq"
	)
	const klarheitTestimonialDir = path.join(
		process.cwd(),
		"src/app/sandbox/klarheit-testimonial"
	)
	const hero21Dir = path.join(process.cwd(), "src/app/sandbox/hero-21")
	const aiworkDir = path.join(process.cwd(), "src/app/sandbox/aiwork")
	const verseoDir = path.join(process.cwd(), "src/app/sandbox/verseo")
	const agentlabDir = path.join(process.cwd(), "src/app/sandbox/agentlab")

	const agentlabFiles = [
		"page.tsx",
		"announcement-bar.tsx",
		"navbar.tsx",
		"hero-section.tsx",
		"logo-marquee.tsx",
		"problem-section.tsx",
		"solution-section.tsx",
		"roi-section.tsx",
		"multi-model-section.tsx",
		"industry-section.tsx",
		"testimonials-section.tsx",
		"security-section.tsx",
		"faq-section.tsx",
		"cta-banner.tsx",
		"footer.tsx",
	]

	const omrixFiles = [
		"page.tsx",
		"navbar.tsx",
		"hero-section.tsx",
		"dashboard-mockup.tsx",
		"dashboard-sidebar.tsx",
		"dashboard-header.tsx",
		"dashboard-metrics.tsx",
		"dashboard-chart.tsx",
		"dashboard-activity.tsx",
		"dashboard-table.tsx",
		"logos-strip.tsx",
	]
	const motionFiles = [
		"logo-section.tsx",
		"logo-marquee.tsx",
		"logo-icon.tsx",
		"page.tsx",
	]
	const beamHeaderFiles = [
		"beam-header-section.tsx",
		"beam-logo-strip.tsx",
		"beam-dashboard.tsx",
	]
	const jamboPricingFiles = [
		"jambo-pricing-section.tsx",
		"pricing-card.tsx",
		"rating.tsx",
		"logo-strip.tsx",
		"page.tsx",
	]
	const klarheitFaqFiles = [
		"faq-section.tsx",
		"faq-accordion.tsx",
		"stat-card.tsx",
		"page.tsx",
	]
	const klarheitTestimonialFiles = [
		"testimonial-section.tsx",
		"testimonial-card.tsx",
		"page.tsx",
	]
	const hero21Files = [
		"hero-section.tsx",
		"hero-navbar.tsx",
		"review-badge.tsx",
		"testimonial-card.tsx",
		"showcase-grid.tsx",
		"logo-marquee.tsx",
		"page.tsx",
	]
	const aiworkFiles = [
		"page.tsx",
		"navbar.tsx",
		"hero-section.tsx",
		"dashboard-mockup.tsx",
		"logos-strip.tsx",
		"solutions-section.tsx",
		"agents-section.tsx",
		"automation-section.tsx",
		"integrations-section.tsx",
		"how-it-works-section.tsx",
		"testimonials-section.tsx",
		"pricing-section.tsx",
		"faq-section.tsx",
		"cta-banner.tsx",
		"footer.tsx",
	]
	const verseoFiles = [
		"page.tsx",
		"navbar.tsx",
		"hero-section.tsx",
		"client-logos.tsx",
		"problem-difference-section.tsx",
		"features-section.tsx",
		"use-cases-section.tsx",
		"how-it-works-section.tsx",
		"results-section.tsx",
		"examples-section.tsx",
		"testimonials-section.tsx",
		"pricing-section.tsx",
		"faq-section.tsx",
		"cta-section.tsx",
		"footer.tsx",
	]

	const omrixData: Record<string, string> = {}
	const motionData: Record<string, string> = {}
	const beamHeaderData: Record<string, string> = {}
	const jamboPricingData: Record<string, string> = {}
	const klarheitFaqData: Record<string, string> = {}
	const klarheitTestimonialData: Record<string, string> = {}
	const hero21Data: Record<string, string> = {}
	const aiworkData: Record<string, string> = {}
	const verseoData: Record<string, string> = {}
	const agentlabData: Record<string, string> = {}

	for (const file of omrixFiles) {
		omrixData[file] = readFileContent(omrixDir, file)
	}

	for (const file of motionFiles) {
		motionData[file] = readFileContent(motionDir, file)
	}

	for (const file of beamHeaderFiles) {
		beamHeaderData[file] = readFileContent(beamHeaderDir, file)
	}

	for (const file of jamboPricingFiles) {
		jamboPricingData[file] = readFileContent(jamboPricingDir, file)
	}

	for (const file of klarheitFaqFiles) {
		klarheitFaqData[file] = readFileContent(klarheitFaqDir, file)
	}

	for (const file of klarheitTestimonialFiles) {
		klarheitTestimonialData[file] = readFileContent(
			klarheitTestimonialDir,
			file
		)
	}

	for (const file of hero21Files) {
		hero21Data[file] = readFileContent(hero21Dir, file)
	}

	for (const file of aiworkFiles) {
		aiworkData[file] = readFileContent(aiworkDir, file)
	}

	for (const file of verseoFiles) {
		verseoData[file] = readFileContent(verseoDir, file)
	}

	for (const file of agentlabFiles) {
		agentlabData[file] = readFileContent(agentlabDir, file)
	}

	const files = {
		agentlab: agentlabData,
		omrix: omrixData,
		motion: motionData,
		"beam-header": beamHeaderData,
		"jambo-pricing": jamboPricingData,
		"klarheit-faq": klarheitFaqData,
		"klarheit-testimonial": klarheitTestimonialData,
		"hero-21": hero21Data,
		aiwork: aiworkData,
		verseo: verseoData,
	}

	return <PlaygroundClient files={files} />
}
