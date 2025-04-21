import { getFinabankExchangeRates } from "@/utils/places/providers";

export default function Home() {
  // Example usage
  getFinabankExchangeRates().then(rates => {
    console.log('Exchange Rates:', rates);
  });
  return (
    <div className="">
      hola
    </div>
  );
}
