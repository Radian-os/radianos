"use client"

import {
	SVGProps,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import { Search } from "lucide-react"
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/registry/ui/empty"
import { Input, InputWrapper } from "@/registry/ui/input"
import { FlagDetailsDialog } from "./FlagDetailsDialog"
import { FlagShapeDropdown } from "./FlagShapeDropdown"
import { FlagTile } from "./FlagTile"
import type { FlagName, FlagShape } from "./flags-data"
import { flagNames, getFlagDisplayName } from "./flags-data"

const FLAG_SHAPE_STORAGE_KEY = "radian-flags-shape"

function EmptyMediaContent(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width={120}
			height={80}
			viewBox="0 0 120 80"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}>
			<g clipPath="url(#clip0_1643_2671)">
				<g filter="url(#filter0_d_1643_2671)">
					<rect
						width={120}
						height={24}
						rx={6}
						className="fill-bg"
						shapeRendering="crispEdges"
					/>
					<rect
						x={0.5}
						y={0.5}
						width={119}
						height={23}
						rx={5.5}
						className="stroke-primary-focus"
						shapeRendering="crispEdges"
					/>
					<path
						d="M22 18L19.1333 15.1333M20.6667 11.3333C20.6667 14.2789 18.2789 16.6667 15.3333 16.6667C12.3878 16.6667 10 14.2789 10 11.3333C10 8.38781 12.3878 6 15.3333 6C18.2789 6 20.6667 8.38781 20.6667 11.3333Z"
						className="stroke-primary-border"
						strokeWidth={1.5}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<rect
						x={30}
						y={9}
						width={59}
						height={6}
						rx={2}
						className="fill-primary-accent"
					/>
				</g>
				<g filter="url(#filter1_d_1643_2671)">
					<rect
						y={30}
						width={120}
						height={28}
						rx={6}
						className="fill-bg"
						shapeRendering="crispEdges"
					/>
					<rect
						x={0.5}
						y={30.5}
						width={119}
						height={27}
						rx={5.5}
						className="stroke-fill3"
						shapeRendering="crispEdges"
					/>
					<rect
						x={8.5}
						y={36.5}
						width={15}
						height={15}
						rx={7.5}
						className="fill-fill1-alpha stroke-fill3"
					/>
					<rect
						x={30}
						y={37}
						width={77}
						height={5}
						rx={1}
						className="fill-primary-accent"
					/>
					<rect
						x={30}
						y={46}
						width={52}
						height={5}
						rx={1}
						className="fill-primary-accent"
					/>
				</g>
				<g filter="url(#filter2_d_1643_2671)">
					<rect
						y={64}
						width={120}
						height={28}
						rx={6}
						className="fill-bg"
						shapeRendering="crispEdges"
					/>
					<rect
						x={0.5}
						y={64.5}
						width={119}
						height={27}
						rx={5.5}
						className="stroke-fill3"
						shapeRendering="crispEdges"
					/>
					<rect
						x={8.5}
						y={70.5}
						width={15}
						height={15}
						rx={7.5}
						className="fill-fill1-alpha stroke-fill3"
					/>
					<rect
						x={30}
						y={71}
						width={77}
						height={5}
						rx={1}
						className="fill-primary-accent"
					/>
				</g>
				<rect
					y={51}
					width={120}
					height={32}
					fill="url(#paint0_linear_1643_2671)"
				/>
			</g>
			<defs>
				<filter
					id="filter0_d_1643_2671"
					x={-1}
					y={0}
					width={122}
					height={26}
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB">
					<feFlood floodOpacity={0} result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy={1} />
					<feGaussianBlur stdDeviation={0.5} />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.0980392 0 0 0 0 0.0941176 0 0 0 0 0.105882 0 0 0 0.04 0"
					/>
					<feBlend
						mode="normal"
						in2="BackgroundImageFix"
						result="effect1_dropShadow_1643_2671"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_dropShadow_1643_2671"
						result="shape"
					/>
				</filter>
				<filter
					id="filter1_d_1643_2671"
					x={-1}
					y={30}
					width={122}
					height={30}
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB">
					<feFlood floodOpacity={0} result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy={1} />
					<feGaussianBlur stdDeviation={0.5} />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.0980392 0 0 0 0 0.0941176 0 0 0 0 0.105882 0 0 0 0.04 0"
					/>
					<feBlend
						mode="normal"
						in2="BackgroundImageFix"
						result="effect1_dropShadow_1643_2671"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_dropShadow_1643_2671"
						result="shape"
					/>
				</filter>
				<filter
					id="filter2_d_1643_2671"
					x={-1}
					y={64}
					width={122}
					height={30}
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB">
					<feFlood floodOpacity={0} result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy={1} />
					<feGaussianBlur stdDeviation={0.5} />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.0980392 0 0 0 0 0.0941176 0 0 0 0 0.105882 0 0 0 0.04 0"
					/>
					<feBlend
						mode="normal"
						in2="BackgroundImageFix"
						result="effect1_dropShadow_1643_2671"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_dropShadow_1643_2671"
						result="shape"
					/>
				</filter>
				<linearGradient
					id="paint0_linear_1643_2671"
					x1={60}
					y1={51}
					x2={60}
					y2={83}
					gradientUnits="userSpaceOnUse">
					<stop stopColor="var(--color-bg)" stopOpacity={0} />
					<stop offset={1} stopColor="var(--color-bg)" />
				</linearGradient>
				<clipPath id="clip0_1643_2671">
					<rect width={120} height={80} className="fill-bg" />
				</clipPath>
			</defs>
		</svg>
	)
}

export default function FlagsPlayground() {
	const [query, setQuery] = useState("")
	const [shape, setShape] = useState<FlagShape>("flat")
	const [selectedFlag, setSelectedFlag] = useState<FlagName | null>(null)
	const sentinelRef = useRef<HTMLDivElement>(null)
	const bottomSentinelRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const topSentinel = sentinelRef.current
		const bottomSentinel = bottomSentinelRef.current
		if (!topSentinel || !bottomSentinel) return

		let topScrolledPast = false
		let bottomStillVisible = true

		const dispatchSticky = () => {
			const isSticky = topScrolledPast && bottomStillVisible
			window.dispatchEvent(
				new CustomEvent("resource-filter-sticky", { detail: { isSticky } })
			)
		}

		const topObserver = new IntersectionObserver(
			([entry]) => {
				topScrolledPast =
					!entry.isIntersecting && entry.boundingClientRect.top < 50
				dispatchSticky()
			},
			{ threshold: 0, rootMargin: "-50px 0px 0px 0px" }
		)

		const bottomObserver = new IntersectionObserver(
			([entry]) => {
				bottomStillVisible =
					entry.isIntersecting || entry.boundingClientRect.top > 1000
				dispatchSticky()
			},
			{ threshold: 0 }
		)

		topObserver.observe(topSentinel)
		bottomObserver.observe(bottomSentinel)
		return () => {
			topObserver.disconnect()
			bottomObserver.disconnect()
			window.dispatchEvent(
				new CustomEvent("resource-filter-sticky", {
					detail: { isSticky: false },
				})
			)
		}
	}, [])

	useEffect(() => {
		const savedShape = window.localStorage.getItem(FLAG_SHAPE_STORAGE_KEY)
		if (savedShape === "flat" || savedShape === "round") {
			setShape(savedShape)
		}
	}, [])

	const handleShapeChange = (nextShape: FlagShape) => {
		setShape(nextShape)
		window.localStorage.setItem(FLAG_SHAPE_STORAGE_KEY, nextShape)
	}

	const visibleFlags = useMemo(() => {
		const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, "")
		if (!normalizedQuery) return flagNames

		return flagNames.filter((name) =>
			getFlagDisplayName(name)
				.toLowerCase()
				.replace(/[^a-z0-9]/g, "")
				.includes(normalizedQuery)
		)
	}, [query])

	useLayoutEffect(() => {
		const topSentinel = sentinelRef.current
		const playground = topSentinel?.parentElement
		if (!topSentinel || !playground) return

		const sentinelRect = topSentinel.getBoundingClientRect()
		const rowGap = Number.parseFloat(getComputedStyle(playground).rowGap) || 0
		const pinnedSentinelTop = -(sentinelRect.height + rowGap)

		if (sentinelRect.top < pinnedSentinelTop) {
			window.scrollBy({ top: sentinelRect.top - pinnedSentinelTop })
		}
	}, [query])

	return (
		<div className="flex w-full flex-col gap-5 py-2">
			<div ref={sentinelRef} className="pointer-events-none h-px w-full" />
			<div className="bg-bg/95 sticky top-0 z-100 py-3 backdrop-blur-sm">
				<InputWrapper className="bg-fill1 h-13 w-full">
					<FlagShapeDropdown value={shape} onValueChange={handleShapeChange} />
					<Search aria-hidden="true" />
					<Input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search e.g. United States, Japan, Canada..."
						aria-label="Search country flags"
					/>
				</InputWrapper>
			</div>

			{visibleFlags.length ? (
				<ul className="grid list-none grid-cols-[repeat(auto-fill,142px)] justify-center gap-x-3 gap-y-5 sm:justify-between">
					{visibleFlags.map((name, index) => (
						<FlagTile
							key={name}
							name={name}
							shape={shape}
							priority={index < 18}
							onSelect={setSelectedFlag}
						/>
					))}
				</ul>
			) : (
				<div className="border-soft bg-fill1 flex min-h-40 items-center justify-center rounded-lg border border-dashed text-center">
					{/* <p className="text-fg-secondary text-sm">No flags match “{query}”.</p> */}
					<Empty>
						<EmptyMedia>
							<EmptyMediaContent />
						</EmptyMedia>
						<EmptyHeader>
							<EmptyTitle>No Search Results for &quot;{query}&quot;</EmptyTitle>
							<EmptyDescription>
								No results found. Try different keyword or adjusting your search
								filters
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				</div>
			)}

			<div
				ref={bottomSentinelRef}
				className="pointer-events-none h-px w-full"
			/>

			<FlagDetailsDialog
				name={selectedFlag}
				shape={shape}
				open={selectedFlag !== null}
				onOpenChange={(open) => {
					if (!open) setSelectedFlag(null)
				}}
				onShapeChange={handleShapeChange}
				onSelectFlag={setSelectedFlag}
			/>
		</div>
	)
}
