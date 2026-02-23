import Link from "next/link";

const Footer = () => {
  return (
    <div className="mt-3">
      <div className="h-px w-full bg-border/80"></div>
      <div className="flex justify-between py-8">
        <p className="text-primary tracking-tight">
          Designed and Developed by{" "}
          <Link
            href={"https://suvasis-portfolio.vercel.app/"}
            className="font-bold"
          >
            Suvasis
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;
