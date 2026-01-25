import { Text, type TextProps } from 'react-native';

type ATextColor = 'cyan' | 'pink' | 'yellow' | 'slate';
type ATextShade = 300 | 400 | 500;
type ATextSize =
	| 'xs'
	| 'sm'
	| 'base'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
	| '4xl'
	| '5xl'
	| '6xl'
	| '7xl';

type ATextProps = TextProps & {
	className?: string;
	color?: ATextColor;
	shade?: ATextShade;
	size?: ATextSize;
};

// Static class name lookups for NativeWind's build-time analysis
const COLOR_CLASSES: Record<ATextColor, Record<ATextShade, string>> = {
	cyan: {
		300: 'text-cyan-300',
		400: 'text-cyan-400',
		500: 'text-cyan-500',
	},
	pink: {
		300: 'text-pink-300',
		400: 'text-pink-400',
		500: 'text-pink-500',
	},
	yellow: {
		300: 'text-yellow-300',
		400: 'text-yellow-400',
		500: 'text-yellow-500',
	},
	slate: {
		300: 'text-slate-300',
		400: 'text-slate-400',
		500: 'text-slate-500',
	},
};

const SIZE_CLASSES: Record<ATextSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	base: 'text-base',
	lg: 'text-lg',
	xl: 'text-xl',
	'2xl': 'text-2xl',
	'3xl': 'text-3xl',
	'4xl': 'text-4xl',
	'5xl': 'text-5xl',
	'6xl': 'text-6xl',
	'7xl': 'text-7xl',
};

export function AText(props: ATextProps) {
	const {
		color = 'cyan',
		shade = 400,
		size = 'base',
		className,
		...restProps
	} = props;

	// Get static class names from lookups (required for NativeWind build-time extraction)
	const textColorClass = COLOR_CLASSES[color][shade];
	const textSizeClass = SIZE_CLASSES[size];

	// Check if className already has a text color class
	const hasTextColor =
		className?.match(/\btext-(cyan|yellow|pink|slate|black|white)-\d+\b/) ||
		className?.match(/\btext-(cyan|yellow|pink|slate|black|white)\b/);

	// Check if className already has a text size class
	const hasTextSize = className?.match(
		/\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\b/,
	);

	// Use explicit color from className if present, otherwise use props
	const finalColorClass = hasTextColor ? '' : textColorClass;

	// Use explicit size from className if present, otherwise use props
	const finalSizeClass = hasTextSize ? '' : textSizeClass;

	// Combine classes - ensure font-sans and default color/size are applied
	// Order: font, color, size, then user className (so user can override)
	const classParts = [
		'font-sans', // Default font (Ubuntu Mono configured in tailwind.config.js)
		finalColorClass, // Default color (text-cyan-400) unless overridden
		finalSizeClass, // Default size (text-base) unless overridden
		className, // User-provided classes (can override defaults)
	];
	const finalClassName = classParts.filter(Boolean).join(' ');

	return <Text {...restProps} className={finalClassName} />;
}
