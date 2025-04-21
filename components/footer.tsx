interface FooterProps {
  lastUpdated: number | null;
}
const Footer = ({ lastUpdated }: FooterProps) => {
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "America/Paramaribo",
      })
    : "Not yet updated";

  return (
    <>
      <div className="text-center text-sm text-gray-500 mt-auto">
        <p>Last updated: {formattedDate}</p>
        <p className="mt-2">
          Rates are for informational purposes only. Contact your bank for
          official rates.
        </p>
      </div>
      <footer className="bg-green-900 py-6 text-white mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} Central Exchange - Created by{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://reinierhernandez.com"
            >
              Reinier Hernández
            </a>
          </p>
          <p className="mt-2 text-sm text-green-200">
            Helping you find the best exchange rates for Suriname
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
