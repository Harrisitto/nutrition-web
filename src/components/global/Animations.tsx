import { colors } from "../../styles/colors";

type PropsLoading = {
	size?: number;
	color?: string;
	className?: string;
};

export const AnimationLoading = ({ size = 40, color = colors.green, className = "" }: PropsLoading) => {
	return (
		<div role="status" className={"inline-block " + className}>
			<svg
				width={size}
				height={size}
				viewBox="0 0 50 50"
				className="animate-spin"
				aria-hidden="true"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
					fill="none"
					stroke={color}
					strokeWidth="4"
					strokeLinecap="round"
					strokeDasharray="90"
					strokeDashoffset="60"
				/>
			</svg>
		</div>
	);
};