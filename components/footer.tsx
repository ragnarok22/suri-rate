const Footer = () => {
  return (
    <footer className="bg-green-900 py-6 text-white mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} Central Exchange - Powered by Telesur</p>
        <p className="mt-2 text-sm text-green-200">Helping you manage your mobile balance and stay connected</p>
      </div>
    </footer>
  )
}

export default Footer
