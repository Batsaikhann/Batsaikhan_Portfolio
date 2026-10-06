import Image from "next/image";
import mark from "../../public/images/logo/logo-mark.png";
import wordmark from "../../public/images/logo/logo-wordmark.png";

type Props = { height?: number; priority?: boolean; variant?: "mark" | "wordmark" };

/** B/ mark, or the full "BATSAIKHAN — Product builder" wordmark (public/images/logo). */
export function Logo({ height = 40, priority, variant = "mark" }: Props) {
  const src = variant === "wordmark" ? wordmark : mark;
  return (
    <Image
      src={src}
      alt="Batsaikhan"
      height={height}
      width={Math.round((height * src.width) / src.height)}
      preload={priority}
    />
  );
}
