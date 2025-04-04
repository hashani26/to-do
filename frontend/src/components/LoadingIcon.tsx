import { AiOutlineLoading3Quarters } from "react-icons/ai";

function LoadingIcon({ size = 50 }: { size?: number }) {
  return (
    <div className="flex justify-center">
      <AiOutlineLoading3Quarters
        size={size}
        className="animate-spin delay-150"
      />
    </div>
  );
}

export default LoadingIcon;
