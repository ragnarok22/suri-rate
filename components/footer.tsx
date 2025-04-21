const Footer = () => {
  return (
    <footer className="bg-green-900 py-6 text-white mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} Central Exchange - Created by <a target="_blank" rel="noopener noreferrer" href="https://reinierhernandez.com">Reinier Hernández</a></p>
        <p className="mt-2 text-sm text-green-200">
          Helping you find the best exchange rates for Suriname
        </p>
      </div>
    </footer>
  )
}

export default Footer
