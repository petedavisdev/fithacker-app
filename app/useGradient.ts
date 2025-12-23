import { createContext, useContext } from 'react';

const GradientContext = createContext<{
	setViewingOther: (value: boolean) => void;
}>({ setViewingOther: () => {} });

export function useGradient() {
	return useContext(GradientContext);
}

export { GradientContext };

