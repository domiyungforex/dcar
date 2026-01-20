export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">DCAR</h3>
            <p className="text-sm text-muted-foreground">Premium cars, transparent pricing, exceptional service.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/cars" className="hover:text-primary">
                  Browse Cars
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-primary">
                  Home
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Email: dcar@gmail.com
              <br />
              Phone: 08144106774
              <br />
              <span className="text-xs mt-2 block">Lagos: Plot 15, Marina Business District, Lagos Island</span>
              <span className="text-xs block">Ogun: Ibogun Industrial Estate, Ogun State</span>
            </p>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 DCAR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
