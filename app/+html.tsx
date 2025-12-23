import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every web page during static rendering.
 * The contents of this function only run in Node.js environments and do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {
	return (
		<html lang="en" style={{ backgroundColor: 'black' }}>
			<head>
				<title>Fithacker</title>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1, shrink-to-fit=no"
			/>

			{/* PWA Meta Tags */}
			<link rel="manifest" href="/manifest.json" />
			<meta name="theme-color" content="#111122" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
			<meta name="apple-mobile-web-app-title" content="Fithacker" />

			{/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
			<ScrollViewStyleReset />
				{/* Add any additional <head> elements that you want globally available on web... */}
			</head>
			<body style={{ backgroundColor: 'black' }}>
				<main className="grid place-items-center h-full">
					<div className="h-full max-h-[800px] w-full">{children}</div>
				</main>
			</body>
		</html>
	);
}
