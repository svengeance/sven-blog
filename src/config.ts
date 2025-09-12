import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Sven",
	subtitle: "Home",
	ogDescription: "Random meanderings of an over-caffeinated developer",
	ogImage: "/images/mally.png",
	lang: "en", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 90, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "assets/images/mally-pond.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		{
		  src: '/favicon/mally-16x16.png',
		  sizes: '16x16',
		},
		{
		  src: '/favicon/mally-32x32.png',
		  sizes: '32x32',
		},
		{
		  src: '/favicon/mally-192x192.png',
		  sizes: '192x192',
		},
		{
		  src: '/favicon/mally-512x512.png',
		  sizes: '512x512',
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "Future Posts",
			url: "/future-posts/",
			external: false
		},
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/svengeance", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/mally.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Stephen (Sven) Vernyi",
	bio: [
		"General C# fan. I like making it easy to do the right thing, reducing the effort for myself and others to do our jobs.",
		"All thoughts and writings are my own: locally sourced, 100% organic, and AI-free."
	],
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/svengeance",
		},
		{
			name: "Discord",
			icon: "fa6-brands:discord",
			url: "discord.com/users/.noxian",
		},
		{
			name: "Twitter",
			icon: "fa6-brands:twitter", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://x.com/stevevernyi",
		},
		{
			name: "Email",
			icon: "fa6-regular:envelope",
			url: "mailto:sven.vernyi@gmail.com",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
