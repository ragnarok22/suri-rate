import Link from "next/link";

interface FooterProps {
  lastUpdated: string | undefined;
}
const Footer = ({ lastUpdated }: FooterProps) => {
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Paramaribo",
      })
    : "Not yet updated";

  return (
    <>
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
        <p>Last updated: {formattedDate}</p>
        <p className="mt-2">
          Rates are for informational purposes only. Contact your bank for
          official rates.
        </p>
      </div>
      <footer className="bg-green-900 dark:bg-gray-950 py-6 text-white mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} SuriRate - Created by{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://reinierhernandez.com"
            >
              Reinier Hernández
            </a>
          </p>
          <p className="mt-2 text-sm text-green-200 dark:text-green-400">
            Helping you find the best exchange rates for Suriname
          </p>
          <nav className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/about"
              className="text-green-100 dark:text-green-300 hover:text-white transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/methodology"
              className="text-green-100 dark:text-green-300 hover:text-white transition-colors duration-200"
            >
              Methodology
            </Link>
            <Link
              href="/banks"
              className="text-green-100 dark:text-green-300 hover:text-white transition-colors duration-200"
            >
              Bank profiles
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
};

export default Footer;
