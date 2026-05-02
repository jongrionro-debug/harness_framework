import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#f6f1e8] px-6 py-16 text-[#111111]">
      <section className="flex w-full max-w-[42rem] flex-col items-center text-center">
        <p className="text-[15px] font-extrabold leading-[1.32] sm:text-[16px]">
          교육과 소통을 하나로,
          <br />
          맞춤형 운영 플랫폼
        </p>

        <h1 className="mt-5 flex items-baseline justify-center gap-2 whitespace-nowrap text-[58px] font-black leading-none tracking-[0] sm:text-[82px]">
          <span
            className="font-black"
            style={{
              fontFamily:
                "'Gemunu Libre', Impact, 'Arial Black', var(--font-ui), sans-serif",
            }}
          >
            DURE
          </span>
          <span className="text-[34px] font-black leading-none sm:text-[52px]">
            : 두레
          </span>
        </h1>

        <div className="relative mt-11 h-[156px] w-[196px] overflow-hidden sm:h-[210px] sm:w-[263px]">
          <Image
            src="/figma-assets/dure-temp-logo.png"
            alt=""
            width={1536}
            height={1024}
            priority
            className="absolute max-w-none"
            style={{
              height: "186.67%",
              left: "-62.17%",
              top: "-35.24%",
              width: "223.57%",
            }}
          />
        </div>

        <Link
          href="/login"
          className="mt-8 inline-flex h-[52px] min-w-[160px] items-center justify-center rounded-[18px] bg-[#ffe70a] px-9 text-[20px] font-extrabold leading-none text-black shadow-[0_3px_3px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
        >
          시작하기
        </Link>
      </section>
    </main>
  );
}
